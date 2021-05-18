import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Icon,
  Panel,
  Placeholder,
} from "rsuite";
import { IntlShape, useIntl } from "react-intl";
import { Link, useParams } from "react-router-dom";

import "./readingMobile.less";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import { ReadingPanel } from "../../components/ReadingPanel";
import { useHistory } from "react-router";
import classNames from "classnames";
import { useAppSelector } from "../../app/hooks";
import { selectStatus } from "./chapterSlice";

function getChapterDisplayName(
  chapter: GetChapterDto,
  intl: IntlShape,
): string {
  return chapter.title
    ? `${intl.formatMessage(
        { id: "chapterTitle" },
        { chapterNo: chapter.chapterNo },
      )}: ${chapter.title}`
    : intl.formatMessage(
        { id: "chapterTitle" },
        { chapterNo: chapter.chapterNo },
      );
}

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

function ReadingNavigationTop(props: {
  story: GetStoryDto;
  chapter: GetChapterDto;
}) {
  const { story, chapter } = props;
  const history = useHistory();
  const { url } = useParams() as any;
  const [showMore, setShowMore] = useState(false);
  const intl = useIntl();

  const handleClickBack = useCallback(() => {
    history.push(`/story/${url}`);
  }, [url, history]);

  const handleClickMore = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);

  const handleClickComment = useCallback(() => {
    history.push(`/story/${url}`, { focusTo: "comment" });
  }, [history, url]);

  return (
    <div className="reading-navigation reading-navigation--top">
      <div className="reading-navigation-top-header">
        <Button onClick={handleClickBack} appearance="subtle">
          <Icon size="lg" icon="chevron-left" />
        </Button>
        <div className="reading-navigation-title">
          <div
            className={classNames({
              "reading-navigation-title--more": showMore,
            })}
          >
            {story.title}
          </div>
          {showMore && (
            <div className="reading-navigation-title--sub">
              {getChapterDisplayName(chapter, intl)}
            </div>
          )}
        </div>
        <Button onClick={handleClickMore} appearance="subtle">
          <Icon size="lg" icon="more" />
        </Button>
      </div>
      {showMore && (
        <ButtonToolbar>
          <ButtonGroup justified>
            <Button>
              <Icon icon="download" />
            </Button>
            <Button onClick={handleClickComment}>
              <Icon icon="commenting" />
            </Button>
            <Button>
              <Icon icon="heart" />
            </Button>
            <Button>
              <Icon icon="bug" />
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      )}
    </div>
  );
}

function ReadingNavigationBottom(props: {
  story: GetStoryDto;
  chapter: GetChapterDto;
}) {
  const { story, chapter } = props;
  const history = useHistory();
  const status = useAppSelector(selectStatus);

  const handleNext = useCallback(() => {
    history.push(`/reading/${story.url}/${chapter.chapterNo + 1}`);
  }, [chapter, history, story]);
  const handleBack = useCallback(() => {
    history.push(`/reading/${story.url}/${chapter.chapterNo - 1}`);
  }, [chapter, history, story]);
  const handleShowChapters = useCallback(() => {}, []);
  const handleShowSettings = useCallback(() => {}, []);

  return (
    <div className="reading-navigation reading-navigation--bottom">
      <ButtonToolbar>
        <ButtonGroup justified>
          <Button
            onClick={handleBack}
            disabled={status === "processing" || chapter.chapterNo <= 1}
          >
            <Icon size="lg" icon="arrow-circle-o-left" />
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              status === "processing" || chapter.chapterNo >= story.lastChapter
            }
          >
            <Icon size="lg" icon="arrow-circle-right" />
          </Button>
          <Button onClick={handleShowChapters}>
            <Icon size="lg" icon="list-ol" />
          </Button>
          <Button onClick={handleShowSettings}>
            <Icon size="lg" icon="font" />
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
  );
}

export function ReadingMobile(props: {
  chapter?: GetChapterDto | false;
  story?: GetStoryDto;
}) {
  const { story, chapter } = props;
  const intl = useIntl();
  const footerRef = useRef<HTMLDivElement>(null);
  const [showNavigation, setShowNavigation] = useState(false);

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
    setShowNavigation(!showNavigation);
  }, [showNavigation]);

  return (
    <>
      <Panel
        className="reading-container"
        header={
          story && chapter ? (
            <>
              <h5>
                <span
                  style={{
                    textTransform: "uppercase",
                    color: !chapter.title ? "unset" : "rgb(164 169 179 / 50%)",
                  }}
                >
                  {intl.formatMessage(
                    { id: "chapterTitle" },
                    { chapterNo: chapter.chapterNo },
                  )}
                  {chapter.title && ":"}
                </span>
                {chapter.title && (
                  <span style={{ marginLeft: "5px", lineHeight: "1.5em" }}>
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
            </>
          ) : (
            <Placeholder.Graph active height={35} />
          )
        }
      >
        {chapter ? (
          <ReadingPanel
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
