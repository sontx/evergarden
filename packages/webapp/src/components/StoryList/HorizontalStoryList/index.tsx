import { forwardRef } from "react";
import classNames from "classnames";
import { StoryListBaseProps } from "../index.api";

import "./index.less";
import { Swiper, SwiperSlide } from 'swiper/react';

export const HorizontalStoryList = forwardRef(
  (
    {
      className,
      stories,
      renderItem,
      renderSkeleton,
      ...rest
    }: StoryListBaseProps,
    ref,
  ) => {
    return (
      <Swiper
        className={classNames(className, "story-list--horizontal")}
        {...rest}
        slidesPerView="auto"
        spaceBetween={10}
        freeMode
      >
        {stories
          ? stories.map((story) => (
              <SwiperSlide key={story.id}>{renderItem(story)}</SwiperSlide>
            ))
          : Array.from(Array(10).keys()).map((value) => (
              <SwiperSlide className="story-item-container" key={value}>
                {renderSkeleton()}
              </SwiperSlide>
            ))}
      </Swiper>
    );
  },
);
