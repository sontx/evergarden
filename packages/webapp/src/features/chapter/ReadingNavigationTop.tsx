import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Button, ButtonGroup, ButtonToolbar, Icon } from "rsuite";
import classNames from "classnames";

export function getChapterDisplayName(
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

export function ReadingNavigationTop(props: {
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
    setShowMore((prevState) => !prevState);
  }, []);

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
