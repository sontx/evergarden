import { Icon, Uploader } from "rsuite";
import React, { useCallback } from "react";

import "./index.less";
import { EnhancedImage } from "../../features/EnhancedImage";

export function ThumbnailUploader({
  thumbnail,
  onChange,
}: {
  thumbnail: string | File | undefined | null;
  onChange: (newFile: File | undefined | null) => void;
}) {
  const handleRemove = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (onChange) {
        onChange(null);
      }
    },
    [onChange],
  );

  const fileList =
    typeof thumbnail === "object" && thumbnail !== null ? [thumbnail] : [];

  return (
    <div className="thumbnail-uploader-container">
      <Uploader
        fileList={fileList}
        fileListVisible={false}
        listType="picture"
        autoUpload={false}
        onChange={(fileList) => {
          const file = fileList[fileList.length - 1];
          if (file) {
            onChange(file.blobFile);
          }
        }}
      >
        <button>
          {thumbnail ? (
            <>
              <EnhancedImage
                noCache
                src={thumbnail}
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
