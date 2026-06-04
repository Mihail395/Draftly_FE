import * as pdfMakeNs from "pdfmake/build/pdfmake";
import * as pdfFontsNs from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import type { Content, CustomTableLayout, TDocumentDefinitions } from "pdfmake/interfaces";

// pdfmake's browser build is UMD; under Vite/esbuild the callable object may be the
// namespace itself or sit under `.default`. vfs_fonts (0.2.x) exports the font
// dictionary directly, but older builds nested it under `.pdfMake.vfs` / `.vfs` —
// cover every shape so the embedded Roboto font is always registered.
/* eslint-disable @typescript-eslint/no-explicit-any */
const pdfMake: any = (pdfMakeNs as any).default ?? pdfMakeNs;
const pdfFonts: any = (pdfFontsNs as any).default ?? pdfFontsNs;
pdfMake.vfs = pdfFonts?.pdfMake?.vfs ?? pdfFonts?.vfs ?? pdfFonts;
/* eslint-enable @typescript-eslint/no-explicit-any */

// Per-tag style overrides so the PDF approximates the editor theme. The embedded
// font is Roboto only (pdfmake's built-in) — Merriweather/Source Sans 3 are NOT
// embedded; headings are approximated with sizes/weights instead. Sizes are scaled
// down from the editor's rem values to print points (body 11pt).
const TAG_STYLES: Record<string, Record<string, unknown>> = {
    h1: { fontSize: 22, bold: true, color: "#1A1A2E", margin: [0, 12, 0, 6] },
    h2: { fontSize: 17, bold: true, color: "#1A1A2E", margin: [0, 10, 0, 5] },
    h3: { fontSize: 14, bold: true, color: "#1A1A2E", margin: [0, 8, 0, 4] },
    p: { margin: [0, 0, 0, 6] },
    a: { color: "#2B579A", decoration: "underline" },
    // No real left border in pdfmake text — approximate with indent + italic + muted color.
    blockquote: { italics: true, color: "#5C6B7A", margin: [12, 4, 0, 8] },
    ul: { margin: [0, 2, 0, 6] },
    ol: { margin: [0, 2, 0, 6] },
    li: { margin: [0, 1, 0, 1] },
    table: { margin: [0, 6, 0, 10] },
    th: { bold: true, fillColor: "#EDF1F8", color: "#1A1A2E", margin: [0, 2, 0, 2] },
    td: { margin: [0, 2, 0, 2] },
    // Roboto isn't monospace; distinguish code by background + color instead.
    code: { background: "#EEF1F6", color: "#2B579A" },
    pre: { fontSize: 9.5, color: "#1A1A2E", background: "#F2F3F5", margin: [0, 4, 0, 8] },
    mark: { background: "#FFF59D" },
};

// Hairline grey borders + cell padding to mirror the editor's table look.
const TABLE_LAYOUTS: Record<string, CustomTableLayout> = {
    draftlyTable: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => "#D0D5DD",
        vLineColor: () => "#D0D5DD",
        paddingLeft: () => 6,
        paddingRight: () => 6,
        paddingTop: () => 4,
        paddingBottom: () => 4,
    },
};

// Pre-process the editor HTML for things pdfmake/html-to-pdfmake can't render
// natively: task-list checkboxes and (out-of-scope) images.
const prepareHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(`<div id="__root">${html}</div>`, "text/html");
    const root = doc.getElementById("__root");
    if (!root) return html;

    // Task lists → paragraphs prefixed with [x]/[ ] (ASCII, so the embedded Roboto
    // font always has the glyphs; ballot-box Unicode chars would render blank).
    root.querySelectorAll('ul[data-type="taskList"]').forEach((list) => {
        const replacement = doc.createElement("div");
        list.querySelectorAll(":scope > li").forEach((li) => {
            const checked = li.getAttribute("data-checked") === "true";
            const body = li.querySelector("div") ?? li;
            const inner = (body.querySelector("p") ?? body).innerHTML;
            const p = doc.createElement("p");
            p.innerHTML = `${checked ? "[x] " : "[ ] "}${inner}`;
            replacement.appendChild(p);
        });
        list.replaceWith(replacement);
    });

    // Images are remote-URL-only in the editor and pdfmake can't embed remote URLs;
    // images are out of scope for this export, so replace with a muted placeholder
    // (keeps export from breaking on docs that contain images).
    root.querySelectorAll("img").forEach((img) => {
        const p = doc.createElement("p");
        const em = doc.createElement("em");
        em.setAttribute("style", "color:#8B96A3");
        em.textContent = "[image not included in PDF export]";
        p.appendChild(em);
        img.replaceWith(p);
    });

    return root.innerHTML;
};

// Recursively tag every pdfmake table node with our custom border layout.
const applyTableLayout = (node: unknown): void => {
    if (Array.isArray(node)) {
        node.forEach(applyTableLayout);
        return;
    }
    if (node && typeof node === "object") {
        const obj = node as Record<string, unknown>;
        if ("table" in obj && !("layout" in obj)) {
            obj.layout = "draftlyTable";
        }
        Object.values(obj).forEach(applyTableLayout);
    }
};

// pdfmake throws on empty content — guarantee at least one node.
const normalizeContent = (content: Content): Content => {
    if (Array.isArray(content) && content.length === 0) return [{ text: " " }];
    return content;
};

// Strip filesystem-illegal chars (keep spaces/hyphens), collapse whitespace, drop
// trailing dots (Windows), cap length, and fall back to "document" if empty.
const ILLEGAL_FILENAME_CHARS = new RegExp("[<>:\"/\\\\|?*]", "g");

const sanitizeFilename = (title: string): string => {
    const cleaned = title
        .replace(ILLEGAL_FILENAME_CHARS, "")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\.+$/, "")
        .slice(0, 120)
        .trim();
    return `${cleaned.length > 0 ? cleaned : "document"}.pdf`;
};

// Convert the editor's rendered HTML into a searchable (text-based) PDF and trigger
// the browser download. Read-only: it only consumes the HTML string — it never
// mutates the editor, triggers a save, or touches the live Yjs session.
export async function exportToPdf(html: string, title: string): Promise<void> {
    // Yield one frame so the caller's loading state paints before pdfmake's
    // (synchronous) generation briefly blocks the main thread on long documents.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    const content = htmlToPdfmake(prepareHtml(html), {
        window,
        tableAutoSize: true,
        defaultStyles: TAG_STYLES,
    });

    applyTableLayout(content);

    const docDefinition: TDocumentDefinitions = {
        info: { title: title.trim() || "document" },
        pageSize: "A4",
        pageMargins: [40, 48, 40, 54],
        defaultStyle: {
            font: "Roboto",
            fontSize: 11,
            lineHeight: 1.35,
            color: "#1A1A2E",
        },
        content: normalizeContent(content),
    };

    await new Promise<void>((resolve, reject) => {
        try {
            pdfMake.createPdf(docDefinition, TABLE_LAYOUTS).download(sanitizeFilename(title), () => resolve());
        } catch (err) {
            reject(err instanceof Error ? err : new Error("PDF generation failed"));
        }
    });
}
