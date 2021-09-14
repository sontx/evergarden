import React, { useCallback, useEffect, useState, useRef } from "react"

import { Input, Icon } from "rsuite";
import { AuthUser } from "@evergarden/shared";
import { useUpdateUser } from "../hooks/useUpdateUser";

export const UserName = ({ user }: {user:AuthUser | undefined}) => {
  const [name, setName] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const updateUser = useUpdateUser();

  useEffect(() => {
    if (user) {
      setName(user.fullName);
    }
  }, [user, user?.fullName])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  })

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (!wrapperRef?.current?.contains(target)) {
      if (!!name) {
        if(user?.fullName !== name) {
          updateFullName();
        }
        setIsEditing(false);
        return
      }
    }

    setIsEditing(true);
  }

  const updateFullName = () => {
    updateUser.mutate({
      fullName: name,
    });
  }

  const handleOnChange = useCallback((e) => {
    setName(e);
  }, [])

  return (
    <div className="profile_name" ref={wrapperRef}>
      {isEditing ? (
        <Input
          value={name}
          onChange={handleOnChange}
        />
      ) : (
          <>
            <span>{name}</span>
            <Icon icon="pencil" size="lg" onClick={() => setIsEditing(true)}/>
          </>
        )
      }
    </div>
  );
} 