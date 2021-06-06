import { Fab } from "react-tiny-fab";
import { Icon, Loader } from "rsuite";
import React, { ReactNode } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectShowSearchBox } from "../../features/settings/settingsSlice";
import { ProcessingStatus } from "../../utils/types";

export function validateModel(model: any, value: any) {
  const result = model.check(value);
  for (const key of Object.keys(result)) {
    if (result[key].hasError) {
      return false;
    }
  }
  return true;
}

function LoadingPanel({ title }: { title: string }) {
  return (
    <div>
      <div style={{ zIndex: 10000 }} className="rs-modal-backdrop fade in" />
      <Loader style={{ zIndex: 10001 }} center vertical content={title} />
    </div>
  );
}

export function EditorForm({
  savingStatus,
  fetchingStatus,
  handleSave,
  mode,
  children,
}: {
  savingStatus: ProcessingStatus;
  fetchingStatus?: ProcessingStatus;
  handleSave?: () => void;
  mode: "create" | "update";
  children: ReactNode;
}) {
  const showSearchBox = useAppSelector(selectShowSearchBox);

  return (
    <>
      {children}
      {!showSearchBox && (
        <Fab
          event="click"
          onClick={handleSave}
          mainButtonStyles={{
            width: "60px",
            height: "60px",
            background: handleSave ? "#34c3ff" : "#a4a9b3",
          }}
          style={{ bottom: "40px", right: "20px", margin: 0 }}
          icon={<Icon icon="save" />}
        />
      )}

      {savingStatus === "processing" ? (
        <LoadingPanel title={mode === "update" ? "Updating..." : "Saving..."} />
      ) : (
        fetchingStatus === "processing" && <LoadingPanel title="Fetching..." />
      )}
    </>
  );
}
