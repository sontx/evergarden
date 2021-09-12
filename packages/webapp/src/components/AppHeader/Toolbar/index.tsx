import { Avatar, Icon, Nav } from "rsuite";
import { useState } from "react";

import { SearchBox } from "../../../features/search/SearchBox";
import { UserMenu } from "../UserMenu";
import { useToggle } from "../../../hooks/useToggle";
import { useGoLogin } from "../../../hooks/navigation/useGoLogin";
import { useUser } from "../../../features/user/hooks/useUser";
import { withActionHandler } from "../UserMenu/withActionHandler";
import { useIsLoggedIn } from "../../../features/user/hooks/useIsLoggedIn";

const UserMenuWrapper = withActionHandler(UserMenu);

export function Toolbar() {
  const { data: user } = useUser();
  const isLoggedIn = useIsLoggedIn();
  const [showSearchBox, setShowSearchBox] = useState(false);
  const goLogin = useGoLogin();
  const [showMenu, toggleShowMenu] = useToggle();

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
        {user && isLoggedIn ? (
          <Nav.Item
            className="user-avatar"
            disabled={showSearchBox}
            onSelect={toggleShowMenu}
          >
            <Avatar src={user.photoUrl} circle />
          </Nav.Item>
        ) : (
          <>
            <Nav.Item
              disabled={showSearchBox}
              className="nav-icon"
              onSelect={goLogin}
            >
              <Icon icon="sign-in" />
            </Nav.Item>
            <Nav.Item
              disabled={showSearchBox}
              className="nav-icon"
              onSelect={toggleShowMenu}
            >
              <Icon icon="bars" />
            </Nav.Item>
          </>
        )}
      </Nav>
      <UserMenuWrapper onClose={toggleShowMenu} show={showMenu} />
      {showSearchBox && <SearchBox onClose={() => setShowSearchBox(false)} />}
    </>
  );
}
