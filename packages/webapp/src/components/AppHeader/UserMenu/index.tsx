import { GridMenuItem } from "../../GridMenu/GridMenuItem";
import { Icon } from "rsuite";
import { FormattedMessage } from "react-intl";
import { GridMenu } from "../../GridMenu";

import "./index.less";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import { useCallback } from "react";
import { logoutAsync } from "../../../features/auth/authSlice";
import { useHistory } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

export function UserMenu({ onClose }: { onClose: () => void }) {
  const user = useAppSelector(selectUser);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const handleLogin = useLogin();

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
    <GridMenu cols={3} className="user-menu" onClose={onClose}>
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
      <GridMenuItem icon={<Icon icon="history" />} onClick={handleShowHistory}>
        <FormattedMessage id="userMenuHistory" />
      </GridMenuItem>
      <GridMenuItem icon={<Icon icon="info" />} className="contact">
        <FormattedMessage id="userMenuAbout" />
      </GridMenuItem>
      {!user && (
        <GridMenuItem icon={<Icon icon="hand-peace-o" />} onClick={handleLogin}>
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
  );
}
