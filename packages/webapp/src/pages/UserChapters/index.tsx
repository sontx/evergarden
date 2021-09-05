import React, { useCallback, useState } from "react";
import { Icon, IconButton } from "rsuite";
import { useAppSelector } from "../../app/hooks";
import { selectStory } from "../../features/story-editor/storyEditorSlice";
import { withUpdateStory } from "../StoryEditor/withUpdateStory";
import { UserPage } from "../../components/UserPage";
import { ChaptersPanel } from "../../components/ChaptersPanel";
import { GetChapterDto } from "@evergarden/shared";

import { ChaptersToolBar } from "../../components/ChaptersToolBar";
import { useGoEditStory } from "../../hooks/navigation/useGoEditStory";
import { useGoCreateChapter } from "../../hooks/navigation/useGoCreateChapter";
import { useGoEditChapter } from "../../hooks/navigation/useGoEditChapter";

const Wrapper = withUpdateStory(UserPage);

export function UserChaptersPage() {
  const story = useAppSelector(selectStory);
  const [isDesc, setDesc] = useState(true);
  const gotoUserStory = useGoEditStory();
  const gotoCreateChapter = useGoCreateChapter();
  const gotoEditChapter = useGoEditChapter();

  const handleBack = useCallback(() => {
    if (story) {
      gotoUserStory(story);
    }
  }, [gotoUserStory, story]);

  const handleCreateNew = useCallback(() => {
    if (story) {
      gotoCreateChapter(story);
    }
  }, [gotoCreateChapter, story]);

  const handleSelectChapter = useCallback(
    (chapter: GetChapterDto | number) => {
      if (story) {
        gotoEditChapter(story, chapter);
      }
    },
    [gotoEditChapter, story],
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
          <IconButton
            icon={<Icon icon="plus" />}
            onClick={handleCreateNew}
            size="sm"
            appearance="link"
          />
          <IconButton
            icon={<Icon icon="close" />}
            onClick={handleBack}
            appearance="link"
            size="sm"
          />
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
