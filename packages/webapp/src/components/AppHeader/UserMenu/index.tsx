import { GridMenuItem } from "../../GridMenu/GridMenuItem";
import { Icon } from "rsuite";
import { FormattedMessage } from "react-intl";
import { GridMenu } from "../../GridMenu";
import DarkModeToggle from "react-dark-mode-toggle";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { useUser } from "../../../features/user/hooks/useUser";
import { useIsDarkMode } from "../../../features/global/hooks/useIsDarkMode";
import { useIsLoggedIn } from "../../../features/user/hooks/useIsLoggedIn";

export function UserMenu({
  onClose,
  onFollowClick,
  onHistoryClick,
  onUserStoriesClick,
  onLogoutClick,
  onAboutClick,
  onFullNameClick,
  className,
  ...rest
}: {
  onClose: () => void;
  onFollowClick: () => void;
  onHistoryClick: () => void;
  onUserStoriesClick: () => void;
  onLogoutClick: () => void;
  onAboutClick: () => void;
  onFullNameClick: () => void;
} & StandardProps) {
  const { data: user } = useUser();
  const { isLoggedIn } = useIsLoggedIn();
  const { isDarkMode, setDarkMode } = useIsDarkMode();

  return (
    <GridMenu
      cols={3}
      className={classNames("user-menu", className)}
      onClose={onClose}
      {...rest}
    >
      {user && isLoggedIn && (
        <>
          <GridMenuItem
            icon={<Icon icon="user" />}
            onClick={onFullNameClick}
          >
            {user.fullName}
          </GridMenuItem>
          <GridMenuItem
            icon={<Icon icon="address-book" />}
            onClick={onUserStoriesClick}
          >
            <FormattedMessage id="userMenuMyStories" />
          </GridMenuItem>
        </>
      )}
      <GridMenuItem icon={<Icon icon="star" />} onClick={onFollowClick}>
        <FormattedMessage id="userMenuFollowing" />
      </GridMenuItem>
      <GridMenuItem icon={<Icon icon="history" />} onClick={onHistoryClick}>
        <FormattedMessage id="userMenuHistory" />
      </GridMenuItem>
      <GridMenuItem
        icon={<Icon icon="info" />}
        className="contact"
        onClick={onAboutClick}
      >
        <FormattedMessage id="userMenuAbout" />
      </GridMenuItem>
      <GridMenuItem preventClick className="dark-theme-toggle">
        <DarkModeToggle
          onChange={setDarkMode}
          checked={isDarkMode}
          size={70}
          speed={2}
        />
      </GridMenuItem>
      {user && isLoggedIn && (
        <GridMenuItem
          icon={<Icon icon="sign-out" />}
          className="logout"
          onClick={onLogoutClick}
        >
          <FormattedMessage id="userMenuLogout" />
        </GridMenuItem>
      )}
    </GridMenu>
  );
}
