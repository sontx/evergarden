import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { Panel, Placeholder } from "rsuite";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import "./readingMobile.less";
import { forwardRef, useEffect, useRef } from "react";
import moment from "moment";
import { ReadingPanel } from "../../components/ReadingPanel";

const ReadingFooter = forwardRef(
  (props: { chapter: GetChapterDto }, ref: any) => {
    const intl = useIntl();
    const { chapter } = props;
    const content = chapter.title
      ? `${intl.formatMessage(
          { id: "chapterTitle" },
          { chapterNo: chapter.chapterNo },
        )}: ${chapter.title}`
      : intl.formatMessage(
          { id: "chapterTitle" },
          { chapterNo: chapter.chapterNo },
        );
    return (
      <div title={content} className="reading-footer" ref={ref}>
        {content}
      </div>
    );
  },
);

export function ReadingMobile(props: {
  chapter?: GetChapterDto;
  story?: GetStoryDto;
}) {
  const { story, chapter } = props;
  const intl = useIntl();
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCurrentScrollTop = () =>
      window.pageYOffset || document.documentElement.scrollTop;
    let lastScrollTop = getCurrentScrollTop();
    const handleScroll = () => {
      const scrollTop = getCurrentScrollTop();
      if (footerRef.current) {
        const isScrollDown = scrollTop > lastScrollTop;
        const isTouchTop = scrollTop === 0;
        footerRef.current.style.visibility = isScrollDown || isTouchTop
          ? "collapse"
          : "visible";
      }
      lastScrollTop = scrollTop;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [footerRef.current]);

  useEffect(() => {
    if (chapter) {
      window.scrollTo({ top: 0 });
    }
  }, [chapter]);

  return (
    <>
      <Panel
        className="reading-container"
        header={
          story ? (
            <>
              {chapter && (
                <h5>
                  <span
                    style={{
                      textTransform: "uppercase",
                      color: !chapter.title
                        ? "unset"
                        : "rgb(164 169 179 / 50%)",
                    }}
                  >
                    {intl.formatMessage(
                      { id: "chapterTitle" },
                      { chapterNo: chapter.chapterNo },
                    )}
                    {chapter.title && ":"}
                  </span>
                  {chapter.title && (
                    <span style={{ marginLeft: "5px" }}>{chapter.title}</span>
                  )}
                </h5>
              )}
              {chapter && (
                <span className="reading-subtitle">
                  {typeof chapter.uploadBy === "object"
                    ? intl.formatMessage(
                        { id: "readingSubtitle" },
                        {
                          updated: moment(chapter.updated).fromNow(),
                          updatedBy: (
                            <Link
                              to={{ pathname: `/user/${chapter.uploadBy.id}` }}
                            >
                              {chapter.uploadBy.fullName}
                            </Link>
                          ),
                        },
                      )
                    : moment(chapter.updated).fromNow()}
                </span>
              )}
            </>
          ) : (
            <Placeholder.Graph active height={20} />
          )
        }
      >
        {chapter ? (
          <ReadingPanel>{chapter.content}</ReadingPanel>
        ) : (
          <Placeholder.Paragraph rows={50} active />
        )}
      </Panel>
      {chapter && <ReadingFooter chapter={chapter} ref={footerRef} />}
    </>
  );
}
