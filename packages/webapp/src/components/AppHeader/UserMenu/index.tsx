import { GridMenuItem } from "../../GridMenu/GridMenuItem";
import { Icon } from "rsuite";
import { FormattedMessage } from "react-intl";
import { GridMenu } from "../../GridMenu";
import DarkModeToggle from "react-dark-mode-toggle";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectIsDarkMode,
  setDarkMode,
} from "../../../features/global/globalSlice";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { useUser } from "../../../features/user/hooks/useUser";

export function UserMenu({
  onClose,
  onFollowClick,
  onHistoryClick,
  onUserStoriesClick,
  onLogoutClick,
  className,
  ...rest
}: {
  onClose: () => void;
  onFollowClick: () => void;
  onHistoryClick: () => void;
  onUserStoriesClick: () => void;
  onLogoutClick: () => void;
} & StandardProps) {
  const { data: user } = useUser();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectIsDarkMode);

  return (
    <GridMenu
      cols={3}
      className={classNames("user-menu", className)}
      onClose={onClose}
      {...rest}
    >
      {user && (
        <>
          <GridMenuItem icon={<Icon icon="user" />}>
            {user.fullName}
          </GridMenuItem>
          <GridMenuItem icon={<Icon icon="star" />} onClick={onFollowClick}>
            <FormattedMessage id="userMenuFollowing" />
          </GridMenuItem>
          <GridMenuItem
            icon={<Icon icon="address-book" />}
            onClick={onUserStoriesClick}
          >
            <FormattedMessage id="userMenuMyStories" />
          </GridMenuItem>
        </>
      )}
      <GridMenuItem icon={<Icon icon="history" />} onClick={onHistoryClick}>
        <FormattedMessage id="userMenuHistory" />
      </GridMenuItem>
      <GridMenuItem icon={<Icon icon="info" />} className="contact">
        <FormattedMessage id="userMenuAbout" />
      </GridMenuItem>
      <GridMenuItem preventClick className="dark-theme-toggle">
        <DarkModeToggle
          onChange={(darkMode) => dispatch(setDarkMode(darkMode))}
          checked={isDarkMode}
          size={70}
          speed={2}
        />
      </GridMenuItem>
      {user && (
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
