import { ElementType, useMemo } from "react";
import { ReadingRendererProps } from "./index";
import { GetUserSettingsDto, SizeType } from "@evergarden/shared";
import { getFont } from "../../utils/user-settings-config";
import classNames from "classnames";

export function withUserSettings(Component: ElementType<ReadingRendererProps>) {
  return ({
    settings,
    style,
    className,
    ...rest
  }: ReadingRendererProps & { settings: GetUserSettingsDto }) => {
    const fontSize = useMemo(() => {
      const config: { [x in SizeType]: string } = {
        S: "1em",
        M: "1.25em",
        L: "1.75em",
        XL: "2em",
      };
      return config[settings.readingFontSize] || "1.25em";
    }, [settings.readingFontSize]);

    const lineSpacingClass = useMemo(() => {
      const config: { [x in SizeType]: string } = {
        S: "line-spacing--s",
        M: "line-spacing--m",
        L: "line-spacing--l",
        XL: "line-spacing--xl",
      };
      return config[settings.readingLineSpacing] || "1em";
    }, [settings.readingLineSpacing]);

    const font = getFont(settings.readingFont);

    return (
      <Component
        {...rest}
        className={classNames(className, lineSpacingClass)}
        style={{
          ...(style || {}),
          fontSize,
          fontFamily: font.family,
        }}
      />
    );
  };
}
