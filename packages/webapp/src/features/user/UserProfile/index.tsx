import React from 'react'

import { UserAvatar } from "../UserAvatar"
import { UserName } from "../UserName"
import {  SettingsPanel } from "../../settings/SettingsPanel"

import { useUser } from '../hooks/useUser'

export const UserProfile = () => {
  const { data: user } = useUser()

  return (
    <>
      <div className="profile">
        <UserAvatar user={user}/>
        <UserName user={user}/>
      </div>
      <SettingsPanel />
    </>
  );
}