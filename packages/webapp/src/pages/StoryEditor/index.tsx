import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Icon, IconButton } from "rsuite";
import { UserPage } from "../../components/UserPage";
import { useIntl } from "react-intl";
import { UpdateStoryEditor } from "../../features/story-editor/UpdateStoryEditor";
import { CreateStoryEditor } from "../../features/story-editor/CreateStoryEditor";
import { useAppDispatch } from "../../app/hooks";
import { openStoryByUrl } from "../../features/story/storySlice";

export function StoryEditorPage() {
  const intl = useIntl();
  const { url } = useParams<{ url: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const isUpdate = !!url;

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
                onClick={() => history.push(`/user/story/${url}/chapter`)}
                icon={<Icon icon="list" />}
                appearance="link"
                size="sm"
              />
              <IconButton
                onClick={() => dispatch(openStoryByUrl(history, url))}
                icon={<Icon icon="eye" />}
                appearance="link"
                size="sm"
              />
            </>
          )}
          <IconButton
            onClick={() => history.push("/user/story")}
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
