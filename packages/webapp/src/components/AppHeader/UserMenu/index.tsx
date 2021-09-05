import { GridMenuItem } from "../../GridMenu/GridMenuItem";
import { Icon } from "rsuite";
import { FormattedMessage } from "react-intl";
import { GridMenu } from "../../GridMenu";
import DarkModeToggle from "react-dark-mode-toggle";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import { useCallback } from "react";
import { logoutAsync } from "../../../features/auth/authSlice";
import {
  selectIsDarkMode,
  setDarkMode,
} from "../../../features/global/globalSlice";
import { useGoFollowing } from "../../../hooks/navigation/useGoFollowing";
import { useGoHistory } from "../../../hooks/navigation/useGoHistory";
import { useGoUserStoryList } from "../../../hooks/navigation/useGoUserStoryList";

export function UserMenu({ onClose }: { onClose: () => void }) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const gotoFollowing = useGoFollowing();
  const gotoHistory = useGoHistory();
  const gotoUserStoryList = useGoUserStoryList();

  const handleLogout = useCallback(() => {
    dispatch(logoutAsync());
  }, [dispatch]);

  return (
    <GridMenu cols={3} className="user-menu" onClose={onClose}>
      {user && (
        <>
          <GridMenuItem icon={<Icon icon="user" />}>
            {user.fullName}
          </GridMenuItem>
          <GridMenuItem icon={<Icon icon="star" />} onClick={gotoFollowing}>
            <FormattedMessage id="userMenuFollowing" />
          </GridMenuItem>
          <GridMenuItem
            icon={<Icon icon="address-book" />}
            onClick={gotoUserStoryList}
          >
            <FormattedMessage id="userMenuMyStories" />
          </GridMenuItem>
        </>
      )}
      <GridMenuItem icon={<Icon icon="history" />} onClick={gotoHistory}>
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
          onClick={handleLogout}
        >
          <FormattedMessage id="userMenuLogout" />
        </GridMenuItem>
      )}
    </GridMenu>
  );
}
