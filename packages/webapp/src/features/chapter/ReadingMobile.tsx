import { GetChapterDto, GetStoryDto, SizeType } from "@evergarden/shared";
import { Animation, Panel } from "rsuite";
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
import { selectStatus as selectChapterStatus } from "./chapterSlice";
import { selectStatus as selectStoryStatus } from "../story/storySlice";
import { ReadingLoader } from "../../components/ReadingLoader";
import { selectUserSettings } from "../user/userSlice";
import { defaultUserSettings, getFont } from "../../utils/user-settings-config";

const ReadingFooter = forwardRef(
  (props: { chapter: GetChapterDto | undefined }, ref: any) => {
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
  chapter?: GetChapterDto;
  story?: GetStoryDto;
}) {
  const { story, chapter } = props;

  const intl = useIntl();
  const footerRef = useRef<HTMLDivElement>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const settings = useAppSelector(selectUserSettings) || defaultUserSettings;
  const fetchChapterStatus = useAppSelector(selectChapterStatus);
  const fetchStoryStatus = useAppSelector(selectStoryStatus);

  const fontSize = useMemo(() => {
    const config: { [x in SizeType]: string } = {
      S: "0.75em",
      M: "1em",
      L: "1.25em",
      XL: "1.75em",
    };
    return config[settings.readingFontSize] || "1em";
  }, [settings.readingFontSize]);

  const lineSpacingClass = useMemo(() => {
    const config: { [x in SizeType]: string } = {
      S: "line-spacing--s",
      M: "line-spacing--m",
      L: "line-spacing--l",
      XL: "line-spacing--xl",
    };
    return config[settings.readingLineSpacing] || "1em";
  }, [settings.readingLineSpacing]);

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
  }, []);

  useEffect(() => {
    if (chapter) {
      setShowNavigation(false);
    }
  }, [chapter]);

  const handleClick = useCallback(() => {
    setShowNavigation((prevState) => !prevState);
  }, []);

  const font = getFont(settings.readingFont);
  const isFetchingStory = fetchStoryStatus === "processing";
  const isFetchingChapter = fetchChapterStatus === "processing";
  const isStoryReady = !isFetchingStory && story;
  const isChapterReady = !isFetchingChapter && chapter;
  const isReady = isStoryReady && isChapterReady;

  return (
    <>
      {isReady ? (
        <Animation.Bounce in>
          {(animationProps, ref) => (
            <div ref={ref} {...animationProps}>
              <Panel
                className="reading-container"
                style={{ fontFamily: font.family }}
                header={
                  <div style={{ textAlign: "center" }}>
                    <h5>
                      <span
                        style={{
                          textTransform: "uppercase",
                          color: !chapter?.title ? "unset" : "#a4a9b3",
                        }}
                      >
                        {intl.formatMessage(
                          { id: "chapterTitle" },
                          { chapterNo: chapter?.chapterNo },
                        )}
                        {chapter?.title && ":"}
                      </span>
                      {chapter?.title && (
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
                      {typeof chapter?.createdBy === "object"
                        ? intl.formatMessage(
                            { id: "readingSubtitle" },
                            {
                              updated: moment(chapter.updated).fromNow(),
                              updatedBy: (
                                <Link
                                  to={{
                                    pathname: `/user/${chapter.createdBy.id}`,
                                  }}
                                >
                                  {chapter.createdBy.fullName}
                                </Link>
                              ),
                            },
                          )
                        : moment(chapter?.updated).fromNow()}
                    </span>
                  </div>
                }
              >
                <ReadingPanel
                  style={{ fontSize: fontSize }}
                  className={lineSpacingClass}
                  minHeightConfig={{
                    selectors: [".rs-panel-heading", ".rs-footer"],
                    containerVertPadding: 30,
                  }}
                  onClick={handleClick}
                >
                  {chapter?.content}
                </ReadingPanel>
              </Panel>
            </div>
          )}
        </Animation.Bounce>
      ) : (
        <ReadingLoader />
      )}
      {!showNavigation && isReady && window.scrollY > 0 && (
        <ReadingFooter chapter={chapter} ref={footerRef} />
      )}
      {isReady && (
        <Animation.Fade in={showNavigation} unmountOnExit>
          {(props1, ref1) => (
            <div {...props1} ref={ref1}>
              <ReadingNavigationTop chapter={chapter} story={story} />
              <ReadingNavigationBottom chapter={chapter} story={story} />
            </div>
          )}
        </Animation.Fade>
      )}
    </>
  );
}
