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
  updateSettingsAsync,
} from "./settingsSlice";
import { SelectPicker } from "rsuite";
import { useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { UpdateUserSettingsDto } from "@evergarden/shared";
import { selectUser } from "../auth/authSlice";

const SIZES = ["S", "M", "L", "XL"];

export function SettingPanel() {
  const readingFont = useAppSelector(selectReadingFont);
  const readingFontSize = useAppSelector(selectReadingFontSize);
  const readingLineSpacing = useAppSelector(selectReadingLineSpacing);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const font = getFont(readingFont);

  const syncSettingsDebounce = useDebouncedCallback(
    (settings: UpdateUserSettingsDto, dispatch: any, user: any) => {
      if (user) {
        dispatch(updateSettingsAsync(settings));
      }
    },
    5000,
    { trailing: true },
  );

  const triggerSyncSettings = useCallback(
    (settings: Partial<UpdateUserSettingsDto>) => {
      syncSettingsDebounce(
        {
          readingFont: readingFont,
          readingFontSize: readingFontSize,
          readingLineSpacing: readingLineSpacing,
          ...settings,
        },
        dispatch,
        user,
      );
    },
    [
      dispatch,
      readingFont,
      readingFontSize,
      readingLineSpacing,
      syncSettingsDebounce,
      user,
    ],
  );

  useEffect(() => {
    return () => {
      if (syncSettingsDebounce.isPending()) {
        syncSettingsDebounce.flush();
      }
    };
  }, [syncSettingsDebounce]);

  const handleFontChange = useCallback(
    (value) => {
      dispatch(setReadingFont(value.name));
      triggerSyncSettings({ readingFont: value });
    },
    [dispatch, triggerSyncSettings],
  );
  const handleSizeChange = useCallback(
    (value: string) => {
      dispatch(setReadingFontSize(value));
      triggerSyncSettings({ readingFontSize: value });
    },
    [dispatch, triggerSyncSettings],
  );
  const handleLineSpacingChange = useCallback(
    (value: string) => {
      dispatch(setReadingLineSpacing(value));
      triggerSyncSettings({ readingLineSpacing: value });
    },
    [dispatch, triggerSyncSettings],
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
