import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Avatar, Badge, Dropdown, Icon, Input, InputGroup, Nav } from "rsuite";

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
            <Dropdown
              menuStyle={{ minWidth: "200px" }}
              placement="bottomEnd"
              renderTitle={() => (
                <Nav.Item className="user-toolbar-avatar">
                  <Avatar src={user.photoUrl} circle />
                </Nav.Item>
              )}
            >
              <Dropdown.Item>
                <div>{user.fullName}</div>
                <span className="user-toolbar-drawer-subtle">{user.email}</span>
              </Dropdown.Item>
              <Dropdown.Item divider />
              <Dropdown.Item>
                <Icon icon="star" />
                <FormattedMessage id="userMenuFollowing" />
              </Dropdown.Item>
              <Dropdown.Item>
                <Icon icon="history" />
                <FormattedMessage id="userMenuHistory" />
              </Dropdown.Item>
              <Dropdown.Item>
                <Icon icon="address-book" />
                <FormattedMessage id="userMenuMyStories" />
              </Dropdown.Item>
              <Dropdown.Item>
                <Icon icon="th-list" />
                <FormattedMessage id="userMenuMyCollection" />
              </Dropdown.Item>
              <Dropdown.Item divider />
              <Dropdown.Item onSelect={handleLogout}>
                <Icon icon="sign-out" /> <FormattedMessage id="userMenuLogout" />
              </Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <>
            <Nav.Item className="user-toolbar-icon" onSelect={handleLogin}>
              <Icon icon="sign-in" />
            </Nav.Item>
          </>
        )}
      </Nav>
      {showSearch && <SearchBox fillWidth />}
    </>
  );
}
