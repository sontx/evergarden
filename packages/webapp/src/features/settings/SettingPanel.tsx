import { CustomSlider } from "../../components/CustomSlider";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SelectPicker } from "rsuite";
import { useCallback } from "react";
import { selectUserSettings, setUserSettings } from "../user/userSlice";
import {
  defaultUserSettings,
  FONTS,
  getFont,
  SIZES,
} from "../../utils/user-settings-config";

export function SettingPanel() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectUserSettings) || defaultUserSettings;

  const handleFontChange = useCallback(
    (value) => {
      dispatch(setUserSettings({ readingFont: value.name }));
    },
    [dispatch],
  );
  const handleSizeChange = useCallback(
    (value: any) => {
      dispatch(setUserSettings({ readingFontSize: value }));
    },
    [dispatch],
  );
  const handleLineSpacingChange = useCallback(
    (value: any) => {
      dispatch(setUserSettings({ readingLineSpacing: value }));
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
          defaultValue={settings.readingFontSize}
          values={SIZES}
          onChange={handleSizeChange}
        />
        <span>Line spacing</span>
        <CustomSlider
          style={{ marginLeft: "4px", marginRight: "4px" }}
          defaultValue={settings.readingLineSpacing}
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
          defaultValue={getFont(settings.readingFont)}
        />
      </div>
    </>
  );
}
