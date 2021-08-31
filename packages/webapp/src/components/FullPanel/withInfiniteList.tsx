import { ComponentType } from "react";
import { FullPanelProps } from "./index";
import { StoryList } from "../StoryList";
import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";
import { GetStoryDto } from "@evergarden/shared";
import { useTwoDimensionsArray } from "../../hooks/useTwoDimensionsArray";

export function withInfiniteList(Component: ComponentType<any>) {
  return ({
    query,
    ...rest
  }: Omit<FullPanelProps, "children"> & {
    onClose: () => void;
    query: (
      page: number,
      options?: UseInfiniteQueryOptions<GetStoryDto[]>,
    ) => UseInfiniteQueryResult<GetStoryDto[]>;
  }) => {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = query(0);
    const stories = useTwoDimensionsArray(data?.pages);

    return (
      <Component {...rest}>
        <StoryList
          layout="compact"
          stories={stories}
          loadNext={async () => {
            await fetchNextPage();
          }}
          hasMore={hasNextPage}
          isNextPageLoading={isFetchingNextPage}
          itemHeight={66}
        />
      </Component>
    );
  };
}
