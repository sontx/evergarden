import React from 'react'

import Cropper from "react-cropper"
import "cropperjs/dist/cropper.css";

export function ImageCropper({ style, image, cropperRef } : {
  style?: object,
  image: string,
  cropperRef: {
    current: HTMLImageElement | null
  }
}){
  return (
    <Cropper
      style={style}
      zoomTo={0.5}
      initialAspectRatio={1}
      src={image}
      viewMode={1}
      minCropBoxHeight={10}
      minCropBoxWidth={10}
      background={false}
      responsive={true}
      autoCropArea={1}
      checkOrientation={false}
      guides={true}
      ref={cropperRef}
    />
  )
}