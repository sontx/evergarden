import { CustomSlider } from "../../components/CustomSlider";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectReadingFont,
  selectReadingFontSize,
  selectReadingLineSpacing,
  setReadingFont,
  setReadingFontSize,
  setReadingLineSpacing,
} from "./settingsSlice";
import { SelectPicker } from "rsuite";
import { ReactNode, useCallback } from "react";

const SIZES = ["S", "M", "L", "XL"];
const FONTS: { value: { family: string; name: string }; label: ReactNode }[] = [
  {
    label: "Roboto",
    value: {
      family: "Roboto",
      name: "Roboto",
    },
  },
  {
    label: "Noto",
    value: {
      family: '"Noto Serif", serif',
      name: "Noto+Serif",
    },
  },
  {
    label: "Quicksand",
    value: {
      family: '"Quicksand", serif',
      name: "Quicksand",
    },
  },
  {
    label: "Asap",
    value: {
      family: '"Asap", serif',
      name: "Asap",
    },
  },
  {
    label: "Farsan",
    value: {
      family: '"Farsan", serif',
      name: "Farsan",
    },
  },
  {
    label: "Open Sans",
    value: {
      family: '"Open Sans", serif',
      name: "Open+Sans",
    },
  },
  {
    label: "Cabin",
    value: {
      family: '"Cabin Condensed", serif',
      name: "Cabin+Condensed",
    },
  },
  {
    label: "Lora",
    value: {
      family: '"Lora", serif',
      name: "Lora",
    },
  },
];

export function SettingPanel() {
  const readingFont = useAppSelector(selectReadingFont);
  const readingFontSize = useAppSelector(selectReadingFontSize);
  const readingLineSpacing = useAppSelector(selectReadingLineSpacing);
  const dispatch = useAppDispatch();
  const font =
    FONTS.find((font) => font.value.family === readingFont.family) || FONTS[0];
  const handleFontChange = useCallback(
    (value) => {
      dispatch(setReadingFont(value));
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
          defaultValue={font.value}
        />
      </div>
    </>
  );
}
