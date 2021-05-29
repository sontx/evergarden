import { List, Loader } from "rsuite";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Selector } from "react-redux";
import { PaginationResult } from "@evergarden/shared";
import InfiniteScroll from "react-infinite-scroller";
import { AsyncThunk } from "@reduxjs/toolkit";
import { selectLimitCountPerPage } from "../../features/settings/settingsSlice";
import { ProcessingStatus } from "../../utils/types";

type ItemType = any;

export interface InfiniteListProps {
  renderItem: (item: ItemType, index: number) => ReactNode;
  itemsSelector: Selector<any, ItemType>;
  totalItemsSelector: Selector<any, number>;
  statusSelector: Selector<any, ProcessingStatus>;
  onItemClick?:(item: ItemType) => void;
  fetchFunc: AsyncThunk<
    PaginationResult<ItemType>,
    { page: number; limit: number },
    {}
  >;
}

export function InfiniteList(props: InfiniteListProps) {
  const dispatch = useAppDispatch();
  const {
    renderItem,
    itemsSelector,
    totalItemsSelector,
    fetchFunc,
    statusSelector,
    onItemClick
  } = props;

  const items = useAppSelector(itemsSelector);
  const totalItems = useAppSelector(totalItemsSelector);
  const limitCountPerPage = useAppSelector(selectLimitCountPerPage);
  const status = useAppSelector(statusSelector);

  // Workaround: InfiniteScroll won't start fetching data if the cached items in the list is big
  const [isStartLoading, setStartLoading] = useState(false);
  const [isMounted, setMounted] = useState(false);
  const [pageOffset, setPageOffset] = useState(1);

  const fetchMore = useCallback(
    (page: number) => {
      setStartLoading(true);
      dispatch(
        fetchFunc({ page: page - pageOffset, limit: limitCountPerPage }),
      );
    },
    [dispatch, fetchFunc, limitCountPerPage, pageOffset],
  );

  useEffect(() => {
    if (isMounted) {
      if (!isStartLoading) {
        setPageOffset(0);
        fetchMore(1);
      }
    }
    setMounted(true);
  }, [fetchMore, isMounted, isStartLoading]);

  const handleItemClick = useCallback((item: ItemType) => {
    if (onItemClick) {
      onItemClick(item);
    }
  }, [onItemClick]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <List hover>
        <InfiniteScroll
          loadMore={fetchMore}
          hasMore={
            status === "none" ||
            (items.length < totalItems && status !== "processing")
          }
        >
          {items.map((item: any, index: any) => (
            <List.Item key={item.id || index} onClick={() => handleItemClick(item)}>
              {renderItem(item, index)}
            </List.Item>
          ))}
        </InfiniteScroll>
      </List>
      {status === "processing" && (
        <div style={{ height: "40px", position: "relative", marginTop: "8px" }}>
          <Loader center />
        </div>
      )}
    </div>
  );
}
