import React, { forwardRef } from 'react'

import Cropper from "react-cropper"
import "cropperjs/dist/cropper.css";

export const ImageCropper = forwardRef<HTMLImageElement, {
  style?: object,
  image?: string,
}>(
  (props, ref) => (
    <Cropper
      style={props.style}
      zoomTo={0.5}
      initialAspectRatio={1}
      src={props.image}
      viewMode={1}
      minCropBoxHeight={10}
      minCropBoxWidth={10}
      background={false}
      responsive={true}
      autoCropArea={1}
      checkOrientation={false}
      guides={true}
      ref={ref}
    />
  )
);
