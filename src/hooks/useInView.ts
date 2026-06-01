import { useEffect, useRef, useState } from "react";

// Hook that returns a ref + visibility state.
// Used for scroll-triggered fade-in animations.
const useInView = (threshold: number = 0.15) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, visible };
};

export default useInView;