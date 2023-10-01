import {useState, useEffect} from "react";

const useIntersectionObserver = (callback) => {
  const [element, setElement] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    });

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [element, callback]);

  return [setElement];
};

export default useIntersectionObserver;
