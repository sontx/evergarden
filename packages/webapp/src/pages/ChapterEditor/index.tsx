import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectStory } from "../../features/story-editor/storyEditorSlice";
import { useHistory, useParams } from "react-router-dom";
import { withUpdateStory } from "../StoryEditor/withUpdateStory";
import { UserPage } from "../../components/UserPage";
import React, { useCallback, useEffect } from "react";
import {
  fetchChapterAsync,
  selectChapter,
  setChapter,
} from "../../features/chapter-editor/chapterEditorSlice";
import { Icon, IconButton } from "rsuite";
import { openReading } from "../../features/story/storySlice";
import { ChapterEditor } from "../../features/chapter-editor/ChapterEditor";

const Wrapper = withUpdateStory(UserPage);

export function ChapterEditorPage() {
  const story = useAppSelector(selectStory);
  const chapter = useAppSelector(selectChapter);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { url, chapterNo } = useParams<{ url: string; chapterNo: string }>();

  useEffect(() => {
    dispatch(setChapter(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (story && isFinite(parseInt(chapterNo))) {
      if (
        chapter &&
        chapter.storyId === story.id &&
        chapter.chapterNo === parseInt(chapterNo)
      ) {
        return;
      }
      dispatch(
        fetchChapterAsync({
          storyId: story.id,
          chapterNo: parseInt(chapterNo),
        }),
      );
    }
  }, [chapter, chapterNo, dispatch, story, url]);

  const handleBack = useCallback(() => {
    history.push(`/user/story/${url}/chapter`);
  }, [history, url]);

  const handleView = useCallback(() => {
    if (story) {
      dispatch(openReading(history, story, parseInt(chapterNo)));
    }
  }, [chapterNo, dispatch, history, story]);

  const mode = isFinite(parseInt(chapterNo)) ? "update" : "create";
  const showChapterNo =
    mode === "update" ? chapterNo : story ? (story.lastChapter || 0) + 1 : 0;

  return (
    <Wrapper
      title={mode === "update" ? `Update chapter ${chapterNo}` : "New chapter"}
      action={
        <>
          {mode === "update" && (
            <IconButton
              onClick={handleView}
              appearance="link"
              size="sm"
              icon={<Icon icon="eye" />}
            />
          )}
          <IconButton
            icon={<Icon icon="close" />}
            onClick={handleBack}
            appearance="link"
            size="sm"
          />
        </>
      }
    >
      <ChapterEditor mode={mode} chapterNo={showChapterNo} />
    </Wrapper>
  );
}
