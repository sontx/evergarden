import { Button, Loader } from "rsuite";
import React, { ReactNode } from "react";
import { ProcessingStatus } from "../../utils/types";
import { useIntl } from "react-intl";

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
  actionLabel,
  children,
  disabled,
}: {
  savingStatus: ProcessingStatus;
  fetchingStatus?: ProcessingStatus;
  handleSave?: () => void;
  actionLabel: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  const intl = useIntl();
  return (
    <>
      {children}
      <Button
        disabled={disabled}
        size="sm"
        style={{ marginTop: "36px" }}
        onClick={handleSave}
        block
        appearance="primary"
        loading={savingStatus === "processing"}
      >
        {actionLabel}
      </Button>
      {fetchingStatus === "processing" && (
        <LoadingPanel
          title={intl.formatMessage({ id: "processFetchingLabel" })}
        />
      )}
    </>
  );
}
