import React, { useCallback } from "react";
import { Icon, IconButton } from "rsuite";
import { UserPage } from "../../components/UserPage";
import { useGoEditStory } from "../../hooks/navigation/useGoEditStory";
import { useGoCreateChapter } from "../../hooks/navigation/useGoCreateChapter";
import { useGoEditChapter } from "../../hooks/navigation/useGoEditChapter";
import { ChaptersPanel } from "../../features/chapters/ChaptersPanel";
import { useParams } from "react-router-dom";
import { useStory } from "../../features/story/hooks/useStory";
import { useIntl } from "react-intl";

export function UserChaptersPage() {
  const { url } = useParams<{ url: string }>();
  const { data: story } = useStory(url);
  const gotoUserStory = useGoEditStory();
  const gotoCreateChapter = useGoCreateChapter();
  const gotoEditChapter = useGoEditChapter();
  const intl = useIntl();

  const handleBack = useCallback(() => {
    gotoUserStory(url);
  }, [gotoUserStory, url]);

  const handleCreateNew = useCallback(() => {
    gotoCreateChapter(url);
  }, [gotoCreateChapter, url]);

  const handleEditChapter = useCallback(
    (chapterNo: number) => {
      gotoEditChapter(url, chapterNo);
    },
    [gotoEditChapter, url],
  );

  return (
    <UserPage
      showBackTop
      fullContent
      title={
        story ? story.title : intl.formatMessage({ id: "pageTitleChapters" })
      }
      action={
        <>
          {story?.status !== "full" && (
            <IconButton
              icon={<Icon icon="plus" />}
              onClick={handleCreateNew}
              size="sm"
              appearance="link"
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
      <ChaptersPanel
        story={story}
        onClick={handleEditChapter}
        hasFilterBar
        fitHeight
      />
    </UserPage>
  );
}
