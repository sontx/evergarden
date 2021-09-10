import { ComponentType } from "react";
import { FullPanelProps } from "./index";
import { StoryList } from "../StoryList";
import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";
import { GetStoryDto } from "@evergarden/shared";
import { useTwoDimensionsArray } from "../../hooks/useTwoDimensionsArray";
import { useTransformItems } from "../../hooks/useTransformItems";
import { BackTop } from "../BackTop";
import { useQueryElement } from "../../hooks/useQueryElement";

const COMPACT_STORY_ITEM_HEIGHT = 66;

export function withInfiniteList(Component: ComponentType<any>) {
  return ({
    query,
    initialQueryKey,
    transformItems,
    ...rest
  }: Omit<FullPanelProps, "children"> & {
    onClose: () => void;
    transformItems?: (items?: GetStoryDto[]) => GetStoryDto[] | undefined;
    query: (
      queryKey: unknown[],
      options?: UseInfiniteQueryOptions<GetStoryDto[]>,
    ) => UseInfiniteQueryResult<GetStoryDto[]>;
    initialQueryKey: unknown[];
  }) => {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = query(
      initialQueryKey,
    );
    const stories = useTwoDimensionsArray(data?.pages);
    const transformedStories = useTransformItems(stories, transformItems);
    const [listRef, setListRef] = useQueryElement(
      (targetNode) => targetNode.querySelector("div.List") as HTMLElement,
      1000,
    );

    return (
      <Component {...rest}>
        <StoryList
          ref={setListRef}
          layout="infinite"
          stories={transformedStories}
          loadNext={async () => {
            await fetchNextPage();
          }}
          hasMore={hasNextPage}
          isNextPageLoading={isFetchingNextPage}
          itemHeight={COMPACT_STORY_ITEM_HEIGHT}
        />
        <BackTop containerElement={listRef} />
      </Component>
    );
  };
}
