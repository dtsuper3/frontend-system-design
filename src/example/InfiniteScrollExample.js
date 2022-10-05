import { useCallback, useState, useRef } from "react";
import InfiniteScroll from "../components/InfiniteScroll";

function InfiniteScrollExample() {
    const [query, setQuery] = useState("");
    const [data, setData] = useState([]);

    const controllerRef = useRef(null);

    const handleInputChange = useCallback((e) => {
        setQuery(e.target.value);
    }, []);

    const getData = useCallback((query, pageNumber) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!query) {
                    reject()
                    return
                }
                if (controllerRef.current) {
                    controllerRef.current.abort();
                }
                controllerRef.current = new AbortController();
                const url = "http://openlibrary.org/search.json?";
                const res = await fetch(
                    url +
                    new URLSearchParams({
                        q: query,
                        page: pageNumber
                    }),
                    { signal: controllerRef.current.signal }
                );
                const data = await res.json();
                resolve();
                setData((prevData) => [...prevData, ...data.docs]);
            } catch (error) {
                reject();
            }
        });
    }, []);

    const renderItem = useCallback(({ title }, key, ref) => {
        return <div key={key} ref={ref}>{title}</div>;
    }, []);

    return (
        <div>
            <input value={query} onChange={handleInputChange} />
            <InfiniteScroll
                renderListItem={renderItem}
                listData={data}
                getData={getData}
                query={query}
            />
        </div>
    );
}


export default InfiniteScrollExample;