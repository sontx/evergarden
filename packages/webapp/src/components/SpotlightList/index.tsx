import { StandardProps } from "rsuite/es/@types/common";
import { GetStoryDto } from "@evergarden/shared";
import classNames from "classnames";

import "./index.less";
import { AuthorLink } from "../AuthorLink";
import { Icon } from "rsuite";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Parallax } from "swiper";
import { abbreviateNumber } from "../../utils/types";
import { useEffect } from "react";
import { textTruncateAssistant } from "../../utils/text-truncate-assistant";

SwiperCore.use([Navigation, Pagination, Parallax]);

export function SpotlightList({
  stories,
  className,
  ...rest
}: StandardProps & { stories?: GetStoryDto[] }) {
  useEffect(() => {
    document.querySelectorAll(".spotlight-list .title").forEach((title) => {
      title.setAttribute("data-swiper-parallax", "-300");
    });
    document
      .querySelectorAll(".spotlight-list .description")
      .forEach((description) => {
        description.setAttribute("data-swiper-parallax", "-100");
      });
  }, [stories]);

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
          <div className="spotlight-content">
            <h5 className="title">{story.title}</h5>
            <div className="subtitle" data-swiper-parallax="-200">
              <AuthorLink story={story} className="author" />
              <div className="meta">
                <span>
                  <Icon icon="eye" /> {abbreviateNumber(story.view)}
                </span>
                <span>
                  <Icon icon="thumbs-up" /> {abbreviateNumber(story.upvote)}
                </span>
              </div>
            </div>
            <div ref={textTruncateAssistant} className="description">{story.description}</div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
