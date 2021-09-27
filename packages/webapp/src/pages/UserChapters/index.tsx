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
  const { slug } = useParams<{ slug: string }>();
  const { data: story } = useStory(slug);
  const gotoUserStory = useGoEditStory();
  const gotoCreateChapter = useGoCreateChapter();
  const gotoEditChapter = useGoEditChapter();
  const intl = useIntl();

  const handleBack = useCallback(() => {
    gotoUserStory(slug);
  }, [gotoUserStory, slug]);

  const handleCreateNew = useCallback(() => {
    gotoCreateChapter(slug);
  }, [gotoCreateChapter, slug]);

  const handleEditChapter = useCallback(
    (chapterNo: number) => {
      gotoEditChapter(slug, chapterNo);
    },
    [gotoEditChapter, slug],
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
