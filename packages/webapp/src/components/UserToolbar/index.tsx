import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Avatar, Badge, Dropdown, Icon, Nav } from "rsuite";

import "./index.less";
import { useCallback } from "react";
import { isDesktop } from "react-device-detect";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { logoutAsync } from "../../features/auth/authSlice";
import { SearchBox } from "../../features/search/SearchBox";
import { StorySearchBody } from "@evergarden/shared";
import { openStoryByUrl } from "../../features/story/storySlice";
import {
  selectShowSearchBox,
  setShowSearchBox,
} from "../../features/settings/settingsSlice";
import { selectUser } from "../../features/user/userSlice";

export function UserToolbar() {
  const showSearch = useAppSelector(selectShowSearchBox);
  const user = useAppSelector(selectUser);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleShowSearch = useCallback(() => {
    dispatch(setShowSearchBox(!showSearch));
  }, [dispatch, showSearch]);

  const handleLogin = useCallback(() => {
    history.push("/login");
  }, [history]);

  const handleLogout = useCallback(() => {
    dispatch(logoutAsync());
  }, [dispatch]);

  const handleSelectSearchResult = useCallback(
    (story: StorySearchBody) => {
      setShowSearchBox(false);
      dispatch(openStoryByUrl(history, story.url));
    },
    [dispatch, history],
  );

  const handleShowFollowing = useCallback(() => {
    history.push("/following");
  }, [history]);

  const handleShowHistory = useCallback(() => {
    history.push("/history");
  }, [history]);

  const handleShowUserStories = useCallback(() => {
    history.push("/user/story");
  }, [history]);

  return (
    <>
      <Nav pullRight className="user-toolbar-container">
        {isDesktop ? (
          <SearchBox onSelectStory={handleSelectSearchResult} />
        ) : (
          <Nav.Item
            active={showSearch}
            className="nav-icon"
            onSelect={handleShowSearch}
          >
            <Icon size="lg" icon={showSearch ? "compress" : "search"} />
          </Nav.Item>
        )}
        {user ? (
          <>
            <Nav.Item disabled={showSearch} className="nav-icon">
              <Badge content={false}>
                <Icon size="lg" icon="bell" />
              </Badge>
            </Nav.Item>
            <Dropdown
              disabled={showSearch}
              menuStyle={{ minWidth: "200px" }}
              placement="bottomEnd"
              renderTitle={() => (
                <Nav.Item className="user-avatar">
                  <Avatar src={user.photoUrl} circle />
                </Nav.Item>
              )}
            >
              <Dropdown.Item>
                <div>{user.fullName}</div>
                <span className="nav-sub">{user.email}</span>
              </Dropdown.Item>
              <Dropdown.Item divider />
              <Dropdown.Item onSelect={handleShowFollowing}>
                <Icon icon="star" />
                <FormattedMessage id="userMenuFollowing" />
              </Dropdown.Item>
              <Dropdown.Item onSelect={handleShowHistory}>
                <Icon icon="history" />
                <FormattedMessage id="userMenuHistory" />
              </Dropdown.Item>
              <Dropdown.Item onSelect={handleShowUserStories}>
                <Icon icon="address-book" />
                <FormattedMessage id="userMenuMyStories" />
              </Dropdown.Item>
              <Dropdown.Item divider />
              <Dropdown.Item onSelect={handleLogout}>
                <Icon icon="sign-out" />{" "}
                <FormattedMessage id="userMenuLogout" />
              </Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <>
            <Nav.Item
              disabled={showSearch}
              className="nav-icon"
              onSelect={handleLogin}
            >
              <Icon icon="sign-in" />
            </Nav.Item>
          </>
        )}
      </Nav>
      {showSearch && (
        <SearchBox
          onSelectStory={handleSelectSearchResult}
          onClose={handleShowSearch}
        />
      )}
    </>
  );
}
