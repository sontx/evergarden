import { StandardProps } from "rsuite/es/@types/common";
import { GetStoryDto } from "@evergarden/shared";
import TextTruncate from "react-text-truncate";
import classNames from "classnames";

import "./index.less";
import { AuthorLink } from "../AuthorLink";
import { Icon } from "rsuite";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Parallax } from "swiper";

SwiperCore.use([Navigation, Pagination, Parallax]);

export function SpotlightList({
  stories,
  className,
  ...rest
}: StandardProps & { stories?: GetStoryDto[] }) {
  return (
    <Swiper
      className={classNames(className, "spotlight-list")}
      {...rest}
      speed={600}
      parallax
      pagination={{ clickable: true }}
      navigation
    >
      <div
        slot="container-start"
        className="parallax-bg"
        data-swiper-parallax="-23%"
      />
      {(stories || []).map((story) => (
        <SwiperSlide key={story.id}>
          <TextTruncate
            containerClassName="title"
            text={story.title}
            line={1}
            element="h5"
          />
          <div className="subtitle">
            <AuthorLink story={story} className="author" />
            <div className="meta">
              <span>
                <Icon icon="eye" /> {story.view}
              </span>
              <span>
                <Icon icon="thumbs-up" /> {story.upvote}
              </span>
            </div>
          </div>
          <TextTruncate containerClassName="description" text={story.description} line={3} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
