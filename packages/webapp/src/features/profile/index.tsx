// @ts-nocheck
import React, { useCallback, useState, useEffect, useRef } from 'react'

import { Button, Avatar, Uploader, Icon, Drawer } from "rsuite"
import { FormattedMessage } from "react-intl"
import "./index.less"
import { selectUser } from "../auth/authSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { EnhancedImage } from "../EnhancedImage"
import {
  updateFullNameAsync,
  updateAvatarAsync,
  deleteAvatarAsync,
} from "../auth/authSlice"

export function UserProfile({
  show,
  onHide
}: {
  show?: boolean;
  onHide?: () => void
}) {
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const [uploadFile, setUploadFile] = useState<string | File | null | undefined>()
  const fullNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setUploadFile(user.photoUrl)
    }
  }, [user])

  const handleRemove = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      setUploadFile(undefined)
    },
    [setUploadFile],
  );

  const updateFullName = () => {
    const name = fullNameRef?.current?.value
    dispatch(updateFullNameAsync(name))
  }

  const updateAvatar = () => {
    if(user.photoUrl !== uploadFile) {
      if(uploadFile) {
        dispatch(updateAvatarAsync(uploadFile)).then(res => {
          if(res.meta && res.meta.requestStatus === "fulfilled") {
            onHide()
          }
        })
        return
      }

      dispatch(deleteAvatarAsync()).then(res => {
        if(res.meta && res.meta.requestStatus === "fulfilled") {
          onHide()
        }
      })
    }
    onHide()
  }

  return (
    <Drawer show={show} onHide={onHide} size="xs" placement="top" style={{ marginTop: '55px', height: '210px' }}>
      <Drawer.Header />
      <Drawer.Body>
        <div className="profile">
          <div className="profile--avatar">
            <Uploader
              listType="picture"
              className="avatar--upload"
              fileListVisible={false}
              listType="picture"
              autoUpload={false}
              onChange={(fileList) => {
                const file = fileList[fileList.length - 1]
                if (file) {
                  setUploadFile(file.blobFile);
                }
              }}
            >
              <button style={{width: "80px", height: "80px"}}>
                <Icon icon='camera-retro' size="lg" />
              </button>
            </Uploader>
            {uploadFile ? (
              <EnhancedImage
                noCache
                src={uploadFile}
                width="100%"
                height="100%"
                alt="Thumbnail image"
                className="avatar--picture"
              /> ) : (
              <Avatar className="avatar--picture">
                <Icon icon="user" />
              </Avatar>
            )}
            {uploadFile && (
              <span onClick={handleRemove} className="close-button avatar--remove">
                <Icon icon="close" />
              </span>
            )}
          </div>
          <div>
          <p className="profile--form--label">
            <FormattedMessage id="profileName" />
          </p>
          <input className="rs-input" defaultValue={user?.fullName} ref={fullNameRef} onBlur={updateFullName}/>
          </div>
         
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: '30px' }}>
          <Button onClick={() => updateAvatar()} appearance="subtle">
            <FormattedMessage id="profileDone" />
          </Button>
        </div>
      </Drawer.Body>
    </Drawer>
  )
}