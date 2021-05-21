import { Loader, Message, Pagination, Placeholder } from "rsuite";
import { GetStoryDto } from "@evergarden/shared";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchChaptersAsync,
  resetChapters,
  selectChapters,
  selectErrorMessage,
  selectStatus,
  selectTotalPage,
} from "./chaptersSlice";
import { useCallback, useEffect, useState } from "react";

import "./chapterList.less";
import { useIntl } from "react-intl";
import { isEmpty } from "../../utils/types";

export function ChapterList(props: { story: GetStoryDto }) {
  const { story } = props;
  const status = useAppSelector(selectStatus);
  const errorMessage = useAppSelector(selectErrorMessage);
  const chapters = useAppSelector(selectChapters);
  const totalPages = useAppSelector(selectTotalPage);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const intl = useIntl();

  useEffect(() => {
    dispatch(resetChapters());
  }, [dispatch, story.id]);

  useEffect(() => {
    dispatch(
      fetchChaptersAsync({
        storyId: story.id,
        page: page,
        limit: 30,
      }),
    );
  }, [page, dispatch, story.id]);

  const handleChangePage = useCallback((gotoPage) => {
    setPage(gotoPage - 1);
  }, []);

  return (
    <>
      {(status === "success" || !isEmpty(chapters)) && (
        <div style={{ position: "relative" }}>
          <div className="chapter-list-container">
            {(chapters || []).map((chapter) => (
              <Link
                key={chapter.id}
                to={{ pathname: `/reading/${story.url}/${chapter.chapterNo}` }}
              >
                {intl.formatMessage(
                  { id: "chapterTitle" },
                  { chapterNo: chapter.chapterNo },
                )}
                {chapter.title && `: ${chapter.title}`}
              </Link>
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
        <Placeholder.Grid rows={10} active />
      )}
      {status === "error" && (
        <Message closable type="error" description={errorMessage} full />
      )}
    </>
  );
}
