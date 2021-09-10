import React, { useEffect, useState } from "react";

type HTMLImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export function EnhancedImage({
  src,
  noCache,
  defaultSrc,
  alt,
  ...rest
}: Omit<HTMLImageProps, "src"> & {
  src: string | File | undefined;
  defaultSrc?: string;
  noCache?: boolean;
}) {
  const [dataSrc, setDataSrc] = useState<string | undefined>();

  useEffect(() => {
    if (typeof src === "object") {
      let isActive = true;
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isActive) {
          setDataSrc(reader.result as string);
        }
      };
      reader.readAsDataURL(src);
      return () => {
        isActive = false;
      };
    } else {
      const url =
        noCache && !!src
          ? src.indexOf("?") > 0
            ? `${src}&__nocache=${new Date().getTime()}`
            : `${src}?__nocache=${new Date().getTime()}`
          : src;
      setDataSrc(url);
    }
  }, [src, noCache]);

  return (
    <img
      {...rest}
      src={dataSrc}
      onError={() => {
        if (defaultSrc) {
          setDataSrc(defaultSrc);
        }
      }}
      alt={alt}
    />
  );
}
