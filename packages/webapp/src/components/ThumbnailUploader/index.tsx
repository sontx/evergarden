import { Alert, Icon, IconButton, Loader, Uploader } from "rsuite";
import React, { useCallback, useEffect, useState } from "react";

import "./index.less";
import { FileType } from "rsuite/es/Uploader";
import { GetStoryDto } from "@evergarden/shared";

function previewFile(file: any, callback: (data: any) => void) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

export function ThumbnailUploader({
  story,
  onChange,
}: {
  story?: GetStoryDto;
  onChange: (newTempFileName: string | undefined) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(story && story.cover);

  useEffect(() => {
    if (story) {
      setPreview(story.cover);
    }
  }, [story]);

  const handleRemove = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setPreview(undefined);
      if (onChange) {
        onChange(undefined);
      }
    },
    [onChange],
  );

  return (
    <div className="thumbnail-uploader-container">
      <Uploader
        fileListVisible={false}
        listType="picture"
        action="/api/storage/thumbnail"
        onUpload={(file) => {
          setUploading(true);
          previewFile(file.blobFile, (value) => {
            setPreview(value);
          });
        }}
        onSuccess={(response: any, file: FileType) => {
          setUploading(false);
          if (onChange) {
            onChange(response.tempFileName);
          }
        }}
        onError={() => {
          setPreview(undefined);
          setUploading(false);
          Alert.error("Upload failed");
        }}
      >
        <button>
          {uploading && <Loader backdrop center />}
          {preview ? (
            <>
              <img
                src={preview}
                width="100%"
                height="100%"
                alt="Thumbnail image"
              />
              <span onClick={handleRemove} className="close-button">
                <Icon icon="close" />
              </span>
            </>
          ) : (
            <>
              <Icon icon="image" size="lg" />
              <div className="upload-text">Upload story's cover</div>
            </>
          )}
        </button>
      </Uploader>
    </div>
  );
}
