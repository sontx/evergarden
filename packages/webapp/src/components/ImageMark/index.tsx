import { ReactNode } from "react";
import { Property } from "csstype";

export function ImageMark({
  children,
  backgroundColor,
  color,
  spotlight,
}: {
  children: ReactNode;
  backgroundColor: Property.BackgroundColor;
  color?: Property.Color;
  spotlight?: boolean;
}) {
  return (
    <span
      style={{
        fontSize: 10,
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "hidden",
        width: 40,
        height: 40,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          backgroundColor: backgroundColor,
          fontSize: 10,
          position: "absolute",
          right: "-16px",
          bottom: 0,
          left: 0,
          paddingTop: 1,
          transform: "rotate(-45deg)",
          transformOrigin: "left bottom",
          color: color ? color : "unset",
          textTransform: "uppercase",
          fontWeight: spotlight ? "bold" : "unset",
        }}
      >
        {children}
      </span>
    </span>
  );
}
