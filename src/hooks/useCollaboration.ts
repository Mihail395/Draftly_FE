import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import documentAPI from "../api/documentAPI";
import type { Permission } from "../api/types/common";

// URL of the standalone Node y-websocket relay (Draftly/collab-server).
// Dumb, unauthenticated, in-memory relay — see the Real-Time Collaboration
// section in CLAUDE.md.
export const COLLAB_WS_URL = "ws://localhost:1234";

export type CollaborationState =
    | { status: "loading" }
    | { status: "denied" }
    | { status: "ready"; ydoc: Y.Doc; provider: WebsocketProvider; permission: Permission | null };

// Option 2 auth gate: ask Spring Boot whether the current user may access the
// document BEFORE opening the WebSocket. Only on an affirmative response do we
// create the Yjs doc + provider. Any failure fails closed (denied) so we never
// open the socket without confirmed access. The relay itself stays unauthenticated.
const useCollaboration = (documentId: string): CollaborationState => {
    const [state, setState] = useState<CollaborationState>({ status: "loading" });

    useEffect(() => {
        if (!documentId) return;

        let cancelled = false;
        let ydoc: Y.Doc | null = null;
        let provider: WebsocketProvider | null = null;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({ status: "loading" });

        void (async () => {
            try {
                const access = await documentAPI.checkCollabAccess(documentId);
                if (cancelled) return;
                if (!access.allowed) {
                    setState({ status: "denied" });
                    return;
                }
                ydoc = new Y.Doc();
                provider = new WebsocketProvider(COLLAB_WS_URL, documentId, ydoc);
                setState({ status: "ready", ydoc, provider, permission: access.permission });
            } catch {
                if (!cancelled) setState({ status: "denied" });
            }
        })();

        return () => {
            cancelled = true;
            provider?.destroy();
            ydoc?.destroy();
        };
    }, [documentId]);

    return state;
};

export default useCollaboration;
