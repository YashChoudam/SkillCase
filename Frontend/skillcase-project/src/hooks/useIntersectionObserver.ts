import { useEffect, useState, useRef } from "react";

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverProps = { threshold: 0.6, rootMargin: "0px" }
) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<{ [key: string]: HTMLElement }>({});

  const registerElement = (id: string, element: HTMLElement | null) => {
    if (element) {
      elementsRef.current[id] = element;
    } else {
      delete elementsRef.current[id];
    }
  };

  useEffect(() => {
    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetId = entry.target.getAttribute("data-id");
          if (targetId) {
            setActiveId(targetId);
          }
        }
      });
    }, options);

    // Observe all registered elements
    Object.values(elementsRef.current).forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  // Re-observe if elements list changes
  const updateObservedElements = () => {
    if (!observerRef.current) return;
    
    // Disconnect and re-observe to ensure sync
    observerRef.current.disconnect();
    Object.values(elementsRef.current).forEach((element) => {
      observerRef.current?.observe(element);
    });
  };

  return { activeId, registerElement, updateObservedElements };
};
export default useIntersectionObserver;
