import React, { useEffect, useState } from "react";

import { UserListStoriesPage } from "../../components/UserListStoriesPage";
import { useIntl } from "react-intl";
import { selectHistories } from "../../features/histories/historiesSlice";
import { useAppSelector } from "../../app/hooks";
import { UserListStories } from "../../components/UserListStories";
import { fetchStoriesByIds } from "../../features/stories/storiesAPI";
import { GetStoryDto } from "@evergarden/shared";
import { ProcessingStatus } from "../../utils/types";
import { withHistory } from "../../components/StoryList/StoryItem/withHistory";
import { withAnimation } from "../../components/StoryList/StoryItem/withAnimation";
import { StoryItem } from "../../components/StoryList/StoryItem";

const StoryItemWrapper = withHistory(withAnimation(StoryItem));

export function History() {
  const intl = useIntl();
  const histories = useAppSelector(selectHistories);
  const [stories, setStories] = useState<GetStoryDto[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>("none");

  useEffect(() => {
    if (histories) {
      const ids = histories.map((item) => item.storyId);
      if (ids.length > 0) {
        let isActive = true;
        setStatus("processing");
        fetchStoriesByIds(ids)
          .then((res) => {
            if (isActive) {
              setStories(res);
              setStatus("success");
            }
          })
          .catch(() => {
            if (isActive) {
              setStatus("error");
            }
          });
        return () => {
          isActive = false;
        };
      }
    }
  }, [histories]);

  return (
    <UserListStoriesPage title={intl.formatMessage({ id: "userMenuHistory" })}>
      {(props) => (
        <UserListStories
          {...props}
          status={status}
          stories={stories}
          StoryItem={StoryItemWrapper}
        />
      )}
    </UserListStoriesPage>
  );
}
