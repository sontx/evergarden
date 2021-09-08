import { CustomSlider } from "../../../components/CustomSlider";
import { SelectPicker } from "rsuite";
import { useCallback } from "react";
import { FONTS, getFont, SIZES } from "../../../utils/user-settings-config";
import { useUserSettings } from "../hooks/useUserSettings";
import { useUpdateUserSettings } from "../hooks/useUpdateUserSettings";

export function SettingsPanel() {
  const { data: settings } = useUserSettings();
  const { mutate: updateSettings } = useUpdateUserSettings();

  const handleFontChange = useCallback(
    (value) => {
      updateSettings({ readingFont: value.name });
    },
    [updateSettings],
  );
  const handleSizeChange = useCallback(
    (value: any) => {
      updateSettings({ readingFontSize: value });
    },
    [updateSettings],
  );
  const handleLineSpacingChange = useCallback(
    (value: any) => {
      updateSettings({ readingLineSpacing: value });
    },
    [updateSettings],
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
