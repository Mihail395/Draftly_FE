import { useEffect, useRef, useCallback } from "react";

interface UseAutoSaveProps<T> {
    // The data to watch for changes (will trigger auto-save when it changes)
    data: T;
    onSave: (data: T) => Promise<void>;
    enabled: boolean;
    delay?: number;
}

const useAutoSave = <T,>({
                             data,
                             onSave,
                             enabled,
                             delay = 3000,
                         }: UseAutoSaveProps<T>) => {
    const timeoutRef = useRef<number | null>(null);
    const lastSavedRef = useRef<T>(data);
    const isFirstRender = useRef<boolean>(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            lastSavedRef.current = data;
            return;
        }

        if (!enabled) return;

        if (JSON.stringify(data) === JSON.stringify(lastSavedRef.current)) {
            return;
        }

        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            void (async () => {
                try {
                    await onSave(data);
                    lastSavedRef.current = data;
                } catch {
                    // Error handled by onSave caller
                }
            })();
        }, delay);

        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, [data, onSave, enabled, delay]);

    const saveNow = useCallback(async () => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (JSON.stringify(data) === JSON.stringify(lastSavedRef.current)) {
            return;
        }
        await onSave(data);
        lastSavedRef.current = data;
    }, [data, onSave]);

    return { saveNow };
};

export default useAutoSave;