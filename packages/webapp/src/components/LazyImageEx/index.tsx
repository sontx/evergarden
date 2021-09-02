import { LazyImage, LazyImageProps } from "react-lazy-images";

export function LazyImageEx({
  alt,
  src,
  defaultSrc,
  ...rest
}: Partial<LazyImageProps> & { defaultSrc?: string }) {
  return (
    <LazyImage
      {...rest}
      alt={alt}
      src={src || defaultSrc || ""}
      actual={({ imageProps }) => <img {...imageProps} alt={alt} />}
      placeholder={({ ref }) => (
        <div className="lazy-image-placeholder" ref={ref} />
      )}
      loading={() => <img src={defaultSrc} alt={alt} />}
      error={() => <img src={defaultSrc} alt={alt} />}
    />
  );
}
