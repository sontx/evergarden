import { CustomSlider } from "../../components/CustomSlider";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  FONTS,
  getFont,
  selectReadingFont,
  selectReadingFontSize,
  selectReadingLineSpacing,
  setReadingFont,
  setReadingFontSize,
  setReadingLineSpacing,
} from "./settingsSlice";
import { SelectPicker } from "rsuite";
import { useCallback } from "react";

const SIZES = ["S", "M", "L", "XL"];

export function SettingPanel() {
  const readingFont = useAppSelector(selectReadingFont);
  const readingFontSize = useAppSelector(selectReadingFontSize);
  const readingLineSpacing = useAppSelector(selectReadingLineSpacing);
  const dispatch = useAppDispatch();
  const font = getFont(readingFont);
  const handleFontChange = useCallback(
    (value) => {
      dispatch(setReadingFont(value.name));
    },
    [dispatch],
  );
  const handleSizeChange = useCallback(
    (value: string) => {
      dispatch(setReadingFontSize(value));
    },
    [dispatch],
  );
  const handleLineSpacingChange = useCallback(
    (value: string) => {
      dispatch(setReadingLineSpacing(value));
    },
    [dispatch],
  );

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "min-content auto",
          alignItems: "center",
          gridGap: "20px",
          whiteSpace: "nowrap",
        }}
      >
        <span>Size</span>
        <CustomSlider
          style={{ marginLeft: "4px", marginRight: "4px" }}
          defaultValue={readingFontSize}
          values={SIZES}
          onChange={handleSizeChange}
        />
        <span>Line spacing</span>
        <CustomSlider
          style={{ marginLeft: "4px", marginRight: "4px" }}
          defaultValue={readingLineSpacing}
          values={SIZES}
          onChange={handleLineSpacingChange}
        />
        <span>Font</span>
        <SelectPicker
          onChange={handleFontChange}
          cleanable={false}
          searchable={false}
          placement="auto"
          block
          data={FONTS}
          defaultValue={font}
        />
      </div>
    </>
  );
}
