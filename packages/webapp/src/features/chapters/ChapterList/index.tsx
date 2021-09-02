import { Loader, Message, Pagination, Placeholder } from "rsuite";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchChaptersAsync,
  resetChapters,
  selectChapters,
  selectErrorMessage,
  selectStatus,
  selectTotalPage,
} from "../chaptersSlice";
import { useCallback, useEffect, useState } from "react";

import { useIntl } from "react-intl";
import { isEmpty } from "../../../utils/types";
import { openReading } from "../../story/storySlice";
import { useHistory } from "react-router-dom";
import { GetStoryDto } from "@evergarden/shared";

export function ChapterList(props: { story: GetStoryDto }) {
  const { story } = props;
  const status = useAppSelector(selectStatus);
  const errorMessage = useAppSelector(selectErrorMessage);
  const chapters = useAppSelector(selectChapters);
  const totalPages = useAppSelector(selectTotalPage);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const intl = useIntl();
  const history = useHistory();

  useEffect(() => {
    dispatch(resetChapters());
  }, [dispatch, story.id]);

  useEffect(() => {
    dispatch(
      fetchChaptersAsync({
        storyId: story.id,
        page: page,
        limit: 50,
      }),
    );
  }, [page, dispatch, story.id]);

  const handleChangePage = useCallback((gotoPage) => {
    setPage(gotoPage - 1);
  }, []);

  const handleChapterClick = useCallback(
    (chapter) => {
      dispatch(openReading(history, story, chapter.chapterNo));
    },
    [dispatch, history, story],
  );

  return (
    <div style={{ marginTop: "10px" }}>
      {(status === "success" || !isEmpty(chapters)) && (
        <div style={{ position: "relative" }}>
          <div className="chapter-list-container">
            {(chapters || []).map((chapter) => (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a key={chapter.id} onClick={() => handleChapterClick(chapter)}>
                <span className="chapter-no">
                  {intl.formatMessage(
                    { id: "chapterTitle" },
                    { chapterNo: chapter.chapterNo },
                  )}
                </span>
                {chapter.title && `: ${chapter.title}`}
              </a>
            ))}
          </div>
          <div style={{ marginTop: "14px", textAlign: "center" }}>
            <Pagination
              activePage={page + 1}
              onSelect={handleChangePage}
              prev
              last
              next
              first
              size="sm"
              ellipsis={true}
              boundaryLinks={true}
              maxButtons={4}
              pages={totalPages}
            />
          </div>
          {status === "processing" && (
            <Loader
              backdrop
              content={intl.formatMessage({ id: "loadingText" })}
              vertical
            />
          )}
        </div>
      )}
      {status === "processing" && isEmpty(chapters) && (
        <Placeholder.Paragraph rows={10} active />
      )}
      {status === "error" && (
        <Message closable type="error" description={errorMessage} full />
      )}
    </div>
  );
}
