import { useAppSelector } from "../../../app/hooks";
import { Avatar, Icon, Nav } from "rsuite";

import { useState } from "react";
import { selectUser } from "../../../features/user/userSlice";

import "./index.less";
import { SearchBox } from "../../../features/search/SearchBox";
import { useLogin } from "../hooks/useLogin";
import { UserMenu } from "../UserMenu";
import { useToggle } from "../../../hooks/useToggle";

export function Toolbar() {
  const user = useAppSelector(selectUser);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const handleLogin = useLogin();
  const toggleMenu = useToggle(setShowMenu);

  return (
    <>
      <Nav pullRight className="toolbar-container">
        <Nav.Item
          active={showSearchBox}
          className="nav-icon"
          onSelect={() => setShowSearchBox((prev) => !prev)}
        >
          <Icon size="lg" icon={showSearchBox ? "compress" : "search"} />
        </Nav.Item>
        {user ? (
          <Nav.Item
            className="user-avatar"
            disabled={showSearchBox}
            onSelect={toggleMenu}
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
              onSelect={toggleMenu}
            >
              <Icon icon="bars" />
            </Nav.Item>
          </>
        )}
      </Nav>
      {showMenu && <UserMenu onClose={toggleMenu} />}
      {showSearchBox && <SearchBox onClose={() => setShowSearchBox(false)} />}
    </>
  );
}
