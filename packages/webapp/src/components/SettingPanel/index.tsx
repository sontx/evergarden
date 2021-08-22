import { CustomSlider } from "../CustomSlider";
import { useAppSelector } from "../../app/hooks";
import {
  FONTS,
  getFont,
  selectReadingFont,
  selectReadingFontSize,
  selectReadingLineSpacing,
} from "../../features/settings/settingsSlice";
import { SelectPicker } from "rsuite";

const SIZES = ["S", "M", "L", "XL"];

export function SettingPanel({
  handleSizeChange,
  handleFontChange,
  handleLineSpacingChange 
}: {
  handleSizeChange: (value: string) => void;
  handleFontChange: (value: string) => void;
  handleLineSpacingChange: (value: string) => void;
}) {
  const readingFont = useAppSelector(selectReadingFont);
  const readingFontSize = useAppSelector(selectReadingFontSize);
  const readingLineSpacing = useAppSelector(selectReadingLineSpacing);
  const font = getFont(readingFont);

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
