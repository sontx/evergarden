import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Avatar, Badge, Dropdown, Icon, Nav } from "rsuite";

import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { logoutAsync } from "../../features/auth/authSlice";
import {
  selectShowSearchBox,
  setShowSearchBox,
} from "../../features/settings/settingsSlice";
import { selectUser } from "../../features/user/userSlice";

import "./index.less";
import { SearchBox } from "../../features/search/SearchBox";

export function UserToolbar() {
  const user = useAppSelector(selectUser);
  const showSearchBox = useAppSelector(selectShowSearchBox);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleLogin = useCallback(() => {
    history.push("/login");
  }, [history]);

  const handleLogout = useCallback(() => {
    dispatch(logoutAsync());
  }, [dispatch]);

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
        <Nav.Item
          active={showSearchBox}
          className="nav-icon"
          onSelect={() => dispatch(setShowSearchBox(!showSearchBox))}
        >
          <Icon size="lg" icon={showSearchBox ? "compress" : "search"} />
        </Nav.Item>
        {user ? (
          <>
            <Nav.Item disabled={showSearchBox} className="nav-icon">
              <Badge content={false}>
                <Icon size="lg" icon="bell" />
              </Badge>
            </Nav.Item>
            <Dropdown
              disabled={showSearchBox}
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
              disabled={showSearchBox}
              className="nav-icon"
              onSelect={handleLogin}
            >
              <Icon icon="sign-in" />
            </Nav.Item>
          </>
        )}
      </Nav>
      <SearchBox/>
    </>
  );
}
