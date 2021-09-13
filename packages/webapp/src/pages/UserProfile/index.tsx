import React from "react";
import { Content } from "rsuite";

import { AppHeader } from "../../components/AppHeader";
import { AppContainer } from "../../components/AppContainer";
import { AppFooter } from "../../components/AppFooter";
import { SEO } from "../../components/SEO";

import { UserProfile } from "../../features/user/UserProfile";

export function UserProfilePage() {
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
        <UserProfile />
      </Content>
      <AppFooter />
    </AppContainer>
  );
}