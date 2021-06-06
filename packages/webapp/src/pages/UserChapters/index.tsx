import React, { useCallback, useState } from "react";
import { Button } from "rsuite";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectStory,
  setStory,
} from "../../features/story-editor/storyEditorSlice";
import { withUpdateStory } from "../StoryEditor/withUpdateStory";
import { UserPage } from "../../components/UserPage";
import { ChaptersPanel } from "../../components/ChaptersPanel";
import { GetChapterDto } from "@evergarden/shared";

import "./index.less";
import { ChaptersToolBar } from "../../components/ChaptersToolBar";
import { PublishSub } from "../../components/PublishSub";

const Wrapper = withUpdateStory(UserPage);

export function UserChaptersPage() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const story = useAppSelector(selectStory);
  const [isDesc, setDesc] = useState(true);

  const handleBack = useCallback(() => {
    if (story) {
      history.push(`/user/story/${story.url}`);
    }
  }, [history, story]);

  const handleCreateNew = useCallback(() => {
    if (story) {
      dispatch(setStory(undefined));
      history.push(`/user/story/${story.url}/chapter/new`);
    }
  }, [dispatch, history, story]);

  const handleSelectChapter = useCallback(
    (chapter: GetChapterDto | number) => {
      if (story) {
        const chapterNo =
          typeof chapter === "object" ? chapter.chapterNo : chapter;
        history.push(`/user/story/${story.url}/chapter/${chapterNo}`);
      }
    },
    [history, story],
  );

  return (
    <Wrapper
      fullContent
      title={story ? `${story.title} - chapters` : "Chapters"}
      header={
        <div className="page-title">
          <h5 style={{ display: "block" }}>Story chapters</h5>
          {story && (
            <small className="user-chapters-story-title">{story.title}</small>
          )}
        </div>
      }
      action={
        <>
          <Button onClick={handleCreateNew} size="sm" appearance="link">
            Create new
          </Button>
          <Button onClick={handleBack} appearance="link" size="sm">
            Back
          </Button>
        </>
      }
    >
      <div style={{ marginBottom: "20px" }}>
        <ChaptersToolBar
          story={story}
          onJumpTo={handleSelectChapter}
          onSortChange={setDesc}
        />
      </div>
      <div className="user-chapters-container">
        <ChaptersPanel
          renderAction={(chapter) =>
            typeof chapter === "object" && !chapter.published ? (
              <span className="chapter-action">Unpublished</span>
            ) : (
              <></>
            )
          }
          sort={isDesc ? "9-0" : "0-9"}
          story={story}
          onSelect={handleSelectChapter}
        />
      </div>
    </Wrapper>
  );
}
