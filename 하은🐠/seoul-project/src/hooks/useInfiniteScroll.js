import {useState, useEffect} from "react";

function useInfiniteScroll(callback) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1) {
        setIsFetching(true);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!isFetching) return;

      try {
        await callback();
      } finally {
        setIsFetching(false);
      }
    }

    fetchData();
  }, [isFetching, callback]);

  return [isFetching];
}

export default useInfiniteScroll;
