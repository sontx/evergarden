import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { Icon, IconButton } from "rsuite";
import { UserPage } from "../../components/UserPage";
import { useIntl } from "react-intl";
import { UpdateStoryEditor } from "../../features/story-editor/UpdateStoryEditor";
import { CreateStoryEditor } from "../../features/story-editor/CreateStoryEditor";
import { useGoStory } from "../../hooks/navigation/useGoStory";
import { useGoUserChapterList } from "../../hooks/navigation/useGoUserChapterList";
import { useGoUserStoryList } from "../../hooks/navigation/useGoUserStoryList";

export function StoryEditorPage() {
  const intl = useIntl();
  const { slug } = useParams<{ slug: string }>();
  const isUpdate = !!slug;
  const gotoStory = useGoStory();
  const gotoUserChapterList = useGoUserChapterList();
  const gotoUserStoryList = useGoUserStoryList();

  const handleGoUserChapterList = useCallback(() => {
    gotoUserChapterList(slug);
  }, [gotoUserChapterList, slug]);

  return (
    <UserPage
      title={intl.formatMessage({
        id: isUpdate ? "pageTitleUpdateStory" : "pageTitleCreateStory",
      })}
      action={
        <>
          {isUpdate && (
            <>
              <IconButton
                onClick={handleGoUserChapterList}
                icon={<Icon icon="list" />}
                appearance="link"
                size="sm"
              />
              <IconButton
                onClick={() => gotoStory(slug)}
                icon={<Icon icon="eye" />}
                appearance="link"
                size="sm"
              />
            </>
          )}
          <IconButton
            onClick={gotoUserStoryList}
            icon={<Icon icon="close" />}
            appearance="link"
            size="sm"
          />
        </>
      }
    >
      {isUpdate ? <UpdateStoryEditor /> : <CreateStoryEditor />}
    </UserPage>
  );
}
