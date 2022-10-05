import { useCallback, useEffect, useRef, useState } from "react";

function InfiniteScroll(props) {
    const { renderListItem, listData, getData, query } = props;
    const pageNumber = useRef(1);
    const [isLoading, setIsLoading] = useState(false);
    const observer = useRef(null);
    const fetchData = useCallback(() => {
        setIsLoading(true);
        getData(query, pageNumber.current).finally(() => {
            setIsLoading(false);
        });
    }, [getData, query])

    const lastElementObserver = useCallback(node => {
        if (isLoading) {
            return;
        }
        if (observer.current) {
            observer.current.disconnect();
        }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                pageNumber.current += 1;
                fetchData();
            }
        });
        if (node) {
            observer.current.observe(node);
        }
    }, [fetchData, isLoading])



    useEffect(() => {
        fetchData();
    }, [fetchData, getData, query]);

    const renderList = useCallback(() => {
        return listData.map((item, index) => {
            if (index === listData.length - 1) {
                return renderListItem(item, index, lastElementObserver);
            }
            return renderListItem(item, index, null);
        });
    }, [lastElementObserver, listData, renderListItem]);

    return <>
        {renderList()}
        {isLoading && <div>Loading...</div>}
    </>;
}

export default InfiniteScroll;
