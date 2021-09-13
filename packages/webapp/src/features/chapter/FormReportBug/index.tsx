import { GetChapterDto, CreateReportChapterDto } from "@evergarden/shared";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { SelectPicker, Form, Schema, FormGroup, FormControl } from "rsuite";
import { EditorForm, validateModel } from "src/components/EditorForm";
import "./index.less";
import { useSendReport } from "./../hooks/useSendReport";
import { EnhancedModal } from "../../../components/EnhancedModal";

const { StringType } = Schema.Types;

export const TYPES: { value: string; label: string }[] = [
  {
    value: "wrongContent",
    label: "wrongContent",
  },
  {
    value: "spellingMistake",
    label: "spellingMistake",
  },
  {
    value: "wrongChapter",
    label: "wrongChapter",
  },
  {
    value: "wrongTranslation",
    label: "wrongTranslation",
  },
  {
    value: "chaptersAreNotDisplayed",
    label: "chaptersAreNotDisplayed",
  },
  {
    value: "containsSensitiveVulgarLanguage",
    label: "containsSensitiveVulgarLanguage",
  },
];

const model = Schema.Model({
  type: StringType().isRequired("This field is required"),
  detail: StringType(),
});

export function FormReportBug(props: {
  chapter: GetChapterDto;
  show?: boolean;
  onClose?: () => void;
}) {
  const { chapter, show, onClose } = props;
  const [form, setForm] = useState<CreateReportChapterDto>({
    type: "",
    detail: "",
  });
  const { isLoading: isSaving, mutate, isSuccess } = useSendReport(
    chapter.id,
    form,
  );
  const intl = useIntl();

  useEffect(() => {
    if (isSuccess && onClose) {
      onClose();
    }
  }, [isSuccess, onClose]);

  return (
    <EnhancedModal
      className="form-report-bug"
      size="xs"
      show={show}
      onHide={onClose}
      title={intl.formatMessage({ id: "titleFormReportBug" })}
    >
      <EditorForm
        disabled={!validateModel(model, form)}
        isSaving={isSaving}
        actionLabel={intl.formatMessage({ id: "formSaveButtonLabel" })}
        handleSave={() =>
          mutate({
            chapterId: chapter.id,
            report: {
              type: form.type,
              detail: form.detail,
            },
          })
        }
      >
        <Form
          readOnly={isSaving}
          model={model}
          fluid
          formValue={form}
          onChange={setForm as any}
        >
          <FormGroup>
            <FormControl
              name="type"
              placeholder={intl.formatMessage({ id: "chooseType" })}
              searchable={false}
              cleanable={false}
              block
              data={TYPES.map((i) => {
                return {
                  ...i,
                  label: intl.formatMessage({ id: i.label }),
                };
              })}
              accepter={SelectPicker}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              name="detail"
              rows={5}
              componentClass="textarea"
              placeholder={intl.formatMessage({
                id: "details",
              })}
            />
          </FormGroup>
        </Form>
      </EditorForm>
    </EnhancedModal>
  );
}
