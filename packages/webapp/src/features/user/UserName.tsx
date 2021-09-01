import React, { useCallback, useEffect, useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectUser } from "./userSlice"

import { Input, Icon } from "rsuite"
import {
  updateUserAsync,
} from "./userSlice"

export const UserName = () => {
  const [name, setName] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      setName(user.fullName);
    }
  }, [user])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  })

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (!wrapperRef?.current?.contains(target)) {
      if(user?.fullName !== name) {
        updateFullName()
      }
      setIsEditing(false)
      return
    }

    setIsEditing(true)
  }

  const updateFullName = () => {
    dispatch(updateUserAsync({ fullName: name }));
  }

  const handleOnChange = useCallback((e) => {
    setName(e)
  }, [name])

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
  )
}