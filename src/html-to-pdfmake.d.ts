// Ambient type shim — html-to-pdfmake ships no declarations. Minimal surface used
// by exportToPdf.ts. Uses an inline import() type so this stays a global ambient
// declaration (a top-level import would turn the file into a module).
declare module "html-to-pdfmake" {
    interface HtmlToPdfmakeOptions {
        window?: Window;
        tableAutoSize?: boolean;
        defaultStyles?: Record<string, Record<string, unknown>>;
        imagesByReference?: boolean;
    }
    export default function htmlToPdfmake(
        html: string,
        options?: HtmlToPdfmakeOptions,
    ): import("pdfmake/interfaces").Content;
}
