import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Avatar, Icon, Nav } from "rsuite";

import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { logoutAsync } from "../../../features/auth/authSlice";
import {
  selectShowMenu,
  selectShowSearchBox,
  setShowMenu,
  setShowSearchBox,
} from "../../../features/settings/settingsSlice";
import { selectUser } from "../../../features/user/userSlice";

import "./index.less";
import { SearchBox } from "../../../features/search/SearchBox";
import { GridMenu } from "../../GridMenu";
import { GridMenuItem } from "../../GridMenu/GridMenuItem";

export function Toolbar() {
  const user = useAppSelector(selectUser);
  const showSearchBox = useAppSelector(selectShowSearchBox);
  const showMenu = useAppSelector(selectShowMenu);
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
      <Nav pullRight className="toolbar-container">
        <Nav.Item
          active={showSearchBox}
          className="nav-icon"
          onSelect={() => dispatch(setShowSearchBox(!showSearchBox))}
        >
          <Icon size="lg" icon={showSearchBox ? "compress" : "search"} />
        </Nav.Item>
        {user ? (
          <Nav.Item
            className="user-avatar"
            disabled={showSearchBox}
            onSelect={() => dispatch(setShowMenu(!showMenu))}
          >
            <Avatar src={user.photoUrl} circle />
          </Nav.Item>
        ) : (
          <>
            <Nav.Item
              disabled={showSearchBox}
              className="nav-icon"
              onSelect={handleLogin}
            >
              <Icon icon="sign-in" />
            </Nav.Item>
            <Nav.Item
              disabled={showSearchBox}
              className="nav-icon"
              onSelect={() => dispatch(setShowMenu(!showMenu))}
            >
              <Icon icon="bars" />
            </Nav.Item>
          </>
        )}
      </Nav>
      {showMenu && (
        <GridMenu cols={3} className="user-grid-menu">
          {user && (
            <>
              <GridMenuItem icon={<Icon icon="user" />}>
                {user.fullName}
              </GridMenuItem>
              <GridMenuItem
                icon={<Icon icon="star" />}
                onClick={handleShowFollowing}
              >
                <FormattedMessage id="userMenuFollowing" />
              </GridMenuItem>
              <GridMenuItem
                icon={<Icon icon="address-book" />}
                onClick={handleShowUserStories}
              >
                <FormattedMessage id="userMenuMyStories" />
              </GridMenuItem>
            </>
          )}
          <GridMenuItem
            icon={<Icon icon="history" />}
            onClick={handleShowHistory}
          >
            <FormattedMessage id="userMenuHistory" />
          </GridMenuItem>
          <GridMenuItem icon={<Icon icon="info" />} className="contact">
            <FormattedMessage id="userMenuAbout" />
          </GridMenuItem>
          {!user && (
            <GridMenuItem
              icon={<Icon icon="hand-peace-o" />}
              onClick={handleLogin}
            >
              <FormattedMessage id="userMenuJoinUs" />
            </GridMenuItem>
          )}
          {user && (
            <GridMenuItem
              icon={<Icon icon="sign-out" />}
              className="logout"
              onClick={handleLogout}
            >
              <FormattedMessage id="userMenuLogout" />
            </GridMenuItem>
          )}
        </GridMenu>
      )}
      <SearchBox />
    </>
  );
}
