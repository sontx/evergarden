import React, { useState, useRef, useEffect, useCallback } from 'react'
import Logger from "js-logger"
import { Button, Avatar, Icon, Drawer, Loader } from "rsuite"
import { FormattedMessage } from "react-intl"
import { dataURItoBlob } from 'src/utils/images';

import { ImageCropper } from '../../components/ImageCropper'
import "./index.less"
import { selectUser } from "./userSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  updateAvatarAsync,
  deleteAvatarAsync,
} from "./userSlice"

import "./index.less"

import "cropperjs/dist/cropper.css";

export function UserAvatar() {
  const [show, setShow] = useState(false);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [uploadFile, setUploadFile] = useState<string | undefined>();
  let imgRef = useRef<HTMLImageElement | null >(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setUploadFile(user?.photoUrl)
  }, [])

  const updateAvatar = async () => {
    const imageElement: any = imgRef?.current;
    const cropper: any = imageElement?.cropper;
    const newImage = dataURItoBlob(cropper.getCroppedCanvas().toDataURL());

    try {
      setProcessing(true);
      if (newImage) {
        await dispatch(updateAvatarAsync(newImage));
      } else if (uploadFile !== user?.photoUrl && !uploadFile) {
        await dispatch(deleteAvatarAsync());
      }

      setProcessing(false);
      setShow(false);

    } catch (error) {
      Logger.error(error);
    }
  }

  const onChange = (e: any) => {
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadFile(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleRemove = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      setUploadFile("")
      imgRef = {
        current: null,
      }
    },
    [],
  );

  return (
    <>
      <Avatar className="profile_avatar" src={user?.photoUrl} onClick={() => setShow(true)} />
      <Drawer show={show} onHide={() => setShow(false)} size="xs" placement="top" style={{ height: 'auto' }}>
        <Drawer.Header style={{ textAlign: 'center', fontSize: "21px", fontWeight: "bold" }}>
          <FormattedMessage id="updateAvatar" />
        </Drawer.Header>
        <Drawer.Body style={{ height: 'auto' }}>
          <div className="avatar_main">
            <div className="avatar_upload">
              <span>
                <Icon icon="plus" className="avatar_upload_icon" />
                <FormattedMessage id="uploadPhoto" />
              </span>
              <input type="file" onChange={onChange} />
            </div>
            {uploadFile ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span onClick={handleRemove} className="close-button">
                    <Icon icon="close" size="lg" />
                  </span>
                </div>
                <ImageCropper
                  style={{ height: 'calc(100vw - 40px)', width: "100%" }}
                  image={uploadFile}
                  cropperRef={imgRef}
                />
              </>
            ) : <div className="avatar_none" />
            }
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <Button appearance="default" onClick={() => setShow(false)}><FormattedMessage id="cancelBtn" /></Button>
            <Button appearance="primary" onClick={updateAvatar} style={{ marginLeft: "20px", minWidth: '58px' }}>{processing ? <Loader /> : <FormattedMessage id="saveBtn" />}</Button>
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  )
}