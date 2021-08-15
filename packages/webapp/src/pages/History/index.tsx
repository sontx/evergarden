import React, { useEffect, useState } from "react";

import { UserListStoriesPage } from "../../components/UserListStoriesPage";
import { useIntl } from "react-intl";
import { selectHistories } from "../../features/histories/historiesSlice";
import { useAppSelector } from "../../app/hooks";
import { UserListStories } from "../../components/UserListStories";
import { withContinueReading } from "../../components/StoryItemEx/withContinueReading";
import { withAnimation } from "../../components/StoryItemEx/withAnimation";
import { StoryItemEx } from "../../components/StoryItemEx";
import { fetchStoriesByIds } from "../../features/stories/storiesAPI";
import { GetStoryDto } from "@evergarden/shared";

const StoryItemWrapper = withContinueReading(withAnimation(StoryItemEx));

export function History() {
  const intl = useIntl();
  const histories = useAppSelector(selectHistories);
  const [stories, setStories] = useState<GetStoryDto[]>([]);

  useEffect(() => {
    if (histories) {
      let isActive = true;
      const ids = histories.map((item) => item.storyId);
      fetchStoriesByIds(ids).then((res) => {
        if (isActive) {
          setStories(res);
        }
      });
      return () => {
        isActive = false;
      };
    }
  }, [histories]);

  return (
    <UserListStoriesPage title={intl.formatMessage({ id: "userMenuHistory" })}>
      {(props) => (
        <UserListStories
          {...props}
          stories={stories}
          StoryItem={StoryItemWrapper}
        />
      )}
    </UserListStoriesPage>
  );
}
