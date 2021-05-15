import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Drawer,
  Icon,
  Input,
  InputGroup,
  Nav
} from "rsuite";

import "./index.less";
import { useCallback, useState } from "react";
import { isDesktop } from "react-device-detect";
import { useHistory } from "react-router";
import { FormattedMessage } from "react-intl";
import { logoutAsync, selectUser } from "../../features/auth/authSlice";

function SearchBox(props: { fillWidth?: boolean }) {
  return (
    <div style={{ display: "inline-block", padding: "10px 12px", width: props.fillWidth ? "100%" : "unset" }}>
      <InputGroup inside>
        <Input />
        <InputGroup.Button>
          <Icon icon="search" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
}

export function UserToolbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const user = useAppSelector(selectUser);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleShowSearch = useCallback(() => {
    setShowSearch((prevState) => !prevState);
  }, []);

  const handleLogin = useCallback(() => {
    history.push("/login");
  }, [history]);

  const handleLogout = useCallback(() => {
    dispatch(logoutAsync());
  }, [dispatch]);

  const handleToggleDrawer = useCallback(() => {
    setShowDrawer(!showDrawer);
  }, [showDrawer]);

  return (
    <>
      <Nav pullRight>
        {isDesktop ? (
          <SearchBox />
        ) : (
          <Nav.Item active={showSearch} className="user-toolbar-icon" onSelect={handleShowSearch}>
            <Icon size="lg" icon={showSearch ? "compress" : "search"} />
          </Nav.Item>
        )}
        {user ? (
          <>
            <Nav.Item className="user-toolbar-icon">
              <Badge content={false}>
                <Icon size="lg" icon="bell" />
              </Badge>
            </Nav.Item>
            <Nav.Item className="user-toolbar-avatar" onSelect={handleToggleDrawer}>
              <Avatar src={user.photoUrl} circle />
            </Nav.Item>
          </>
        ) : (
          <>
            <Nav.Item className="user-toolbar-icon">
              <Icon size="lg" icon="cog" />
            </Nav.Item>
            <Nav.Item className="user-toolbar-icon" onSelect={handleLogin}>
              <Icon size="lg" icon="sign-in" />
            </Nav.Item>
          </>
        )}
      </Nav>
      {user && (
        <Drawer keyboard full={!isDesktop} placement="right" show={showDrawer} onHide={handleToggleDrawer}>
          <Drawer.Header>
            <Drawer.Title style={{ display: "flex" }}>
              <Avatar src={user.photoUrl} circle />
              <div style={{ marginLeft: "8px" }}>
                <div>{user.fullName}</div>
                <span className="user-toolbar-drawer-subtle">{user.email}</span>
              </div>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Button block size="lg">
              <span>
                <Icon size="lg" icon="star" />
              </span>
              <FormattedMessage id="userMenuFollowing"/>
            </Button>
            <Button block size="lg">
              <span>
                <Icon size="lg" icon="address-book" />
              </span>
              <FormattedMessage id="userMenuMyStories"/>
            </Button>
            <Button block size="lg">
              <span>
                <Icon size="lg" icon="history" />
              </span>
              <FormattedMessage id="userMenuHistory"/>
            </Button>
            <Divider/>
            <Button block size="lg">
              <span>
                <Icon size="lg" icon="user" />
              </span>
              <FormattedMessage id="userMenuProfile"/>
            </Button>
          </Drawer.Body>
          <Drawer.Footer style={{ margin: 0 }}>
            <Button onClick={handleLogout} block className="user-toolbar-logout-button">
              <Icon icon="sign-out" /> <FormattedMessage id="userMenuLogout" />
            </Button>
          </Drawer.Footer>
        </Drawer>
      )}
      {showSearch && <SearchBox fillWidth />}
    </>
  );
}
