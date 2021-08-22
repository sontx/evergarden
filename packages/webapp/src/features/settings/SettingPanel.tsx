import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCallback } from "react";
import { selectUserSettings, setUserSettings } from "../user/userSlice";
import { SettingPanel as BaseSettingPanel } from '../../components/SettingPanel'
import { useCallback } from "react";

export function SettingPanel() {
  const dispatch = useAppDispatch();

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
    <BaseSettingPanel
      handleSizeChange={handleSizeChange}
      handleFontChange={handleFontChange}
      handleLineSpacingChange={handleLineSpacingChange}
    />
  );
}
