import { Button, Loader } from "rsuite";
import React, { ReactNode } from "react";
import { ProcessingStatus } from "../../utils/types";
import { useIntl } from "react-intl";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";

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
  isSaving,
  isFetching,
  handleSave,
  actionLabel,
  children,
  disabled,
  className,
  ...rest
}: {
  savingStatus?: ProcessingStatus;
  fetchingStatus?: ProcessingStatus;
  isSaving?: boolean;
  isFetching?: boolean;
  handleSave?: () => void;
  actionLabel: ReactNode;
  children: ReactNode;
  disabled?: boolean;
} & StandardProps) {
  const intl = useIntl();
  return (
    <div className={classNames(className, "editor-form")} {...rest}>
      {children}
      <Button
        disabled={disabled}
        size="sm"
        style={{ marginTop: "36px" }}
        onClick={handleSave}
        block
        appearance="primary"
        loading={isSaving}
      >
        {actionLabel}
      </Button>
      {isFetching && (
        <LoadingPanel
          title={intl.formatMessage({ id: "processFetchingLabel" })}
        />
      )}
    </div>
  );
}
