import { forwardRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { StoryListBaseProps } from "../index";
import { GetStoryDto } from "@evergarden/shared";
import classNames from "classnames";

import "./index.less";
import { List, Loader } from "rsuite";
import { FormattedMessage } from "react-intl";

export const InfiniteStoryList = forwardRef(
  (
    {
      loadNext,
      stories,
      loader,
      hasMore,
      dataLength,
      renderItem,
      className,
      renderSkeleton,
      ...rest
    }: StoryListBaseProps,
    ref,
  ) => {
    return (
      <div
        {...rest}
        ref={ref as any}
        className={classNames(className, "story-list--infinite")}
      >
        {stories ? (
          <InfiniteScroll
            next={loadNext as () => void}
            loader={loader}
            hasMore={!!hasMore}
            dataLength={dataLength !== undefined ? dataLength : stories.length}
          >
            <List>
              {stories.map((story: GetStoryDto) => (
                <List.Item key={story.id}>renderItem(story)</List.Item>
              ))}
            </List>
          </InfiniteScroll>
        ) : renderSkeleton ? (
          <List>
            {Array.from(Array(10).keys()).map((value) => (
              <List.Item key={value}>{renderSkeleton()}</List.Item>
            ))}
          </List>
        ) : (
          <Loader
            backdrop
            content={<FormattedMessage id="loadingText" />}
            vertical
          />
        )}
      </div>
    );
  },
);
