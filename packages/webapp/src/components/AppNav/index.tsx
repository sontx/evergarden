import "./index.less";
import ResponsiveNav from "@rsuite/responsive-nav";
import { Icon } from "rsuite";
import { FormattedMessage } from "react-intl";
import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentTab, setCurrentTab } from "../../features/settings/settingsSlice";
import { isMobile } from "react-device-detect";

export function AppNav() {
  const currentTab = useAppSelector(selectCurrentTab);
  const dispatch = useAppDispatch();
  const handleSelect = useCallback(
    (selectKey) => {
      dispatch(setCurrentTab(selectKey));
    },
    [dispatch],
  );
  return (
    <ResponsiveNav justified={isMobile} onSelect={handleSelect} appearance="subtle" activeKey={currentTab}>
      <ResponsiveNav.Item eventKey="updated" icon={<Icon icon="creative" />}>
        <FormattedMessage id="homeNavUpdated" />
      </ResponsiveNav.Item>
      <ResponsiveNav.Item eventKey="hot" icon={<Icon icon="trend" />}>
        <FormattedMessage id="homeNavHot" />
      </ResponsiveNav.Item>
      <ResponsiveNav.Item eventKey="following" icon={<Icon icon="star" />}>
        <FormattedMessage id="userMenuFollowing" />
      </ResponsiveNav.Item>
      <ResponsiveNav.Item eventKey="collection" icon={<Icon icon="th-list" />}>
        <FormattedMessage id="homeNavCollection" />
      </ResponsiveNav.Item>
    </ResponsiveNav>
  );
}
