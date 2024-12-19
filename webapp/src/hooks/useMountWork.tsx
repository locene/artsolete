import { useEffect, useRef } from 'react';

function useMountWork() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (
                        containerRef.current
                        && typeof ((node as Element).getAttribute) == 'function'
                        && (node as Element).getAttribute('alt')?.startsWith('artsolete_')
                        && node.parentElement?.tagName == 'BODY'
                    ) {
                        containerRef.current.appendChild(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
        };
    }, [containerRef]);

    return <div id="work" ref={containerRef}></div>;
}

export default useMountWork;
