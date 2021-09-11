import { ElementType, useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { setShowingFullScreenLoader } from "../../../features/global/globalSlice";
import { useGoFollowing } from "../../../hooks/navigation/useGoFollowing";
import { useGoHistory } from "../../../hooks/navigation/useGoHistory";
import { useGoUserStoryList } from "../../../hooks/navigation/useGoUserStoryList";
import { useLogout } from "../../../features/login/hooks/useLogout";
import { StandardProps } from "rsuite/es/@types/common";
import { AboutPanel } from "../../AboutPanel";
import { useToggle } from "../../../hooks/useToggle";

export function withActionHandler(Component: ElementType) {
  return ({
    onClose,
    show,
    ...rest
  }: StandardProps & { onClose: () => void; show: boolean }) => {
    const dispatch = useAppDispatch();
    const gotoFollowing = useGoFollowing();
    const gotoHistory = useGoHistory();
    const [showAbout, toggleShowAbout] = useToggle();
    const gotoUserStoryList = useGoUserStoryList();
    const { mutate: logout, isLoading } = useLogout();

    useEffect(() => {
      dispatch(setShowingFullScreenLoader(isLoading));
    }, [dispatch, isLoading]);

    return show ? (
      <Component
        onClose={onClose}
        onFollowClick={gotoFollowing}
        onHistoryClick={gotoHistory}
        onUserStoriesClick={gotoUserStoryList}
        onLogoutClick={logout}
        onAboutClick={toggleShowAbout}
        {...rest}
      />
    ) : (
      <>{showAbout && <AboutPanel onClose={toggleShowAbout} />}</>
    );
  };
}
