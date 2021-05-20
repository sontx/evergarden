import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { Panel, Placeholder } from "rsuite";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import "./readingMobile.less";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import moment from "moment";
import { ReadingPanel } from "../../components/ReadingPanel";
import { ReadingNavigationBottom } from "./ReadingNavigationBottom";
import {
  getChapterDisplayName,
  ReadingNavigationTop,
} from "./ReadingNavigationTop";
import { useAppSelector } from "../../app/hooks";
import {
  getFont,
  selectReadingFont,
  selectReadingFontSize,
  selectReadingLineSpacing,
} from "../settings/settingsSlice";

const ReadingFooter = forwardRef(
  (props: { chapter: GetChapterDto }, ref: any) => {
    const intl = useIntl();
    const { chapter } = props;
    const content = getChapterDisplayName(chapter, intl);
    return (
      <div title={content} className="reading-footer" ref={ref}>
        {content}
      </div>
    );
  },
);

export function ReadingMobile(props: {
  chapter?: GetChapterDto | false;
  story?: GetStoryDto | false;
}) {
  const { story, chapter } = props;
  const intl = useIntl();
  const footerRef = useRef<HTMLDivElement>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const readingFont = useAppSelector(selectReadingFont);
  const readingFontSize = useAppSelector(selectReadingFontSize);
  const readingLineSpacing = useAppSelector(selectReadingLineSpacing);
  const fontSize = useMemo(() => {
    const config = {
      S: "0.75em",
      M: "1em",
      L: "1.25em",
      XL: "1.75em",
    };
    return config[readingFontSize] || "1em";
  }, [readingFontSize]);
  const lineSpacingClass = useMemo(() => {
    const config = {
      S: "line-spacing--s",
      M: "line-spacing--m",
      L: "line-spacing--l",
      XL: "line-spacing--xl",
    };
    return config[readingLineSpacing] || "1em";
  }, [readingLineSpacing]);

  useEffect(() => {
    const getCurrentScrollTop = () =>
      window.pageYOffset || document.documentElement.scrollTop;
    let lastScrollTop = getCurrentScrollTop();
    const handleScroll = () => {
      const scrollTop = getCurrentScrollTop();
      if (footerRef.current) {
        const isScrollDown = scrollTop > lastScrollTop;
        const isTouchTop = scrollTop === 0;
        footerRef.current.style.visibility =
          isScrollDown || isTouchTop ? "collapse" : "visible";
      }
      lastScrollTop = scrollTop;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [footerRef.current]);

  useEffect(() => {
    if (chapter) {
      setShowNavigation(false);
    }
  }, [chapter]);

  const handleClick = useCallback(() => {
    setShowNavigation((prevState) => !prevState);
  }, []);

  const font = getFont(readingFont);

  return (
    <>
      <Panel
        className="reading-container"
        style={{ fontFamily: font.family }}
        header={
          story && chapter ? (
            <div style={{ textAlign: "center" }}>
              <h5>
                <span
                  style={{
                    textTransform: "uppercase",
                    color: !chapter.title ? "unset" : "#a4a9b3",
                  }}
                >
                  {intl.formatMessage(
                    { id: "chapterTitle" },
                    { chapterNo: chapter.chapterNo },
                  )}
                  {chapter.title && ":"}
                </span>
                {chapter.title && (
                  <span
                    style={{
                      marginLeft: "5px",
                      lineHeight: "calc(1ex / 0.32)",
                    }}
                  >
                    {chapter.title}
                  </span>
                )}
              </h5>
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
            </div>
          ) : (
            <Placeholder.Graph active height={35} />
          )
        }
      >
        {chapter ? (
          <ReadingPanel
            style={{ fontSize: fontSize }}
            className={lineSpacingClass}
            minHeightConfig={{
              selectors: [".rs-panel-heading", ".rs-footer"],
              containerVertPadding: 30,
            }}
            onClick={handleClick}
          >
            {chapter.content}
          </ReadingPanel>
        ) : (
          <Placeholder.Paragraph rows={15} active />
        )}
      </Panel>
      {!showNavigation && chapter && window.scrollY > 0 && (
        <ReadingFooter chapter={chapter} ref={footerRef} />
      )}
      {showNavigation && story && chapter && (
        <>
          <ReadingNavigationTop chapter={chapter} story={story} />
          <ReadingNavigationBottom story={story} chapter={chapter} />
        </>
      )}
    </>
  );
}
