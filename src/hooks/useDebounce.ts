import { useState, useEffect } from "react";

// Returns a value that only updates after the user has stopped changing
// the input for `delay` milliseconds — used to avoid calling the API
// on every single keystroke
const useDebounce = <T>(value: T, delay: number = 300): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;