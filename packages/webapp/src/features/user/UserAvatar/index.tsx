import React, { useState, useRef, useEffect, useCallback } from 'react'
import Logger from "js-logger"
import { Button, Icon, Loader, Avatar } from "rsuite"
import { FormattedMessage } from "react-intl"
import { dataURItoBlob } from 'src/utils/image-utils';
import { isMobileOnly } from "react-device-detect";
import ImageCropper from '../../../components/ImageCropper'

import { useUpdateAvatar } from '../hooks/useUpdateAvatar'
import { useDeleteAvatar } from "../hooks/useDeleteAvatar"
import { AuthUser } from "@evergarden/shared";
import { EnhancedModal } from '../../../components/EnhancedModal';

export function UserAvatar({ user }: { user: AuthUser | undefined }) {
  const [show, setShow] = useState(false);
  const [uploadFile, setUploadFile] = useState<string | undefined>();
  let imgRef = useRef<HTMLImageElement | null>(null);

  const { isLoading: isDeleting, mutateAsync: mutateDelete } = useDeleteAvatar();
  const { isLoading: isUpdating, mutateAsync: mutateUpdate } = useUpdateAvatar();

  useEffect(() => {
    setUploadFile(user?.photoUrl);
  }, [user?.photoUrl])

  const onUpdateAvatar = async () => {
    const imageElement: any = imgRef?.current;

    if (uploadFile !== user?.photoUrl && !uploadFile) {
      await mutateDelete({ photoUrl: "" })
      setShow(false);
      return;
    } else if (imageElement) {
      const cropper: any = imageElement?.cropper;
      const newImage = dataURItoBlob(cropper.getCroppedCanvas().toDataURL());
      try {
        await mutateUpdate(newImage)

        setShow(false);

      } catch (error) {
        Logger.error(error);
      }

      return;
    }

    setShow(false);
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
      imgRef.current = null
    },
    [],
  );

  return (
    <>
      <Avatar className="profile_avatar" circle src={user?.photoUrl} onClick={() => setShow(true)} />
      <EnhancedModal
        title="Update Avatar"
        backdropClose
        show={show}
        center
        onHide={() => setShow(false)}
        mobile={isMobileOnly}
      >
        <div className="avatar_main">
          <div className="avatar_upload rs-btn-primary">
            <span>
              <Icon icon="plus" className="avatar_upload_icon" />
              <FormattedMessage id="uploadPhoto" />
            </span>
            <input type="file" onChange={onChange} />
          </div>
          {uploadFile ? (
            <div className="avatar_cropper">
              <span onClick={handleRemove} className="close-button">
                &times;
                </span>
              <ImageCropper
                style={{ height: 'calc(100vw - 40px)', width: "100%" }}
                image={uploadFile}
                ref={imgRef}
              />
            </div>
          ) : <div className="avatar_none" />
          }
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <Button appearance="default" onClick={() => setShow(false)}><FormattedMessage id="cancelBtn" /></Button>
          <Button appearance="primary" onClick={onUpdateAvatar} style={{ marginLeft: "20px", minWidth: "58px", maxHeight: "36px" }}>{(isDeleting || isUpdating) ? <Loader /> : <FormattedMessage id="saveBtn" />}</Button>
        </div>
      </EnhancedModal>
    </>
  );
} 