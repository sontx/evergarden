import React from "react";
import { Content } from "rsuite";

import { SettingPanel } from "../../features/settings/SettingPanel";
import { UserAvatar } from "../../features/user/UserAvatar";
import { UserName } from "../../features/user/UserName";

import { AppHeader } from "../../components/AppHeader";
import { AppContainer } from "../../components/AppContainer";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";

export function UserProfile() {
  return (
    <AppContainer
      style={{minHeight: "100vh"}}>
      <SEO title='profile' />
      <AppHeader />
      <Content
        style={{
          padding: "10px",
        }}
      >
        <div className="profile">
        <UserAvatar/>
        <UserName />

        </div>
      <SettingPanel />
      </Content>
      
      <AppFooter />
    </AppContainer>
  );
}
