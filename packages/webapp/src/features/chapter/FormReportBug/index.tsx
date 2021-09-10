import { CreateReportChapterDto, GetChapterDto } from "@evergarden/shared";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Form, FormControl, FormGroup, Schema, SelectPicker } from "rsuite";
import { EditorForm, validateModel } from "src/components/EditorForm";
import "../formReportBug.less";
import { useSendReport } from "../hooks/useSendReport";
import { EnhancedModal } from "../../../components/EnhancedModal";
import { isMobileOnly } from "react-device-detect";

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
  onClose?: () => void;
}) {
  const { chapter, onClose } = props;
  const [form, setForm] = useState<CreateReportChapterDto>({
    type: "",
    detail: "",
  });
  const { mutate: sendReport, isLoading, isSuccess } = useSendReport();
  const intl = useIntl();

  useEffect(() => {
    if (isSuccess) {
      if (onClose) {
        onClose();
      }
    }
  }, [isSuccess, onClose]);

  return (
    <EnhancedModal
      className="form-report-bug"
      mobile={isMobileOnly}
      center
      size="xs"
      show
      onHide={onClose}
      title={<FormattedMessage id="titleFormReportBug" />}
    >
      <EditorForm
        isSaving={isLoading}
        disabled={!validateModel(model, form)}
        actionLabel={intl.formatMessage({ id: "sendReportButton" })}
        handleSave={() =>
          sendReport({
            chapterId: chapter.id,
            report: {
              type: form.type,
              detail: form.detail,
            },
          })
        }
      >
        <Form
          model={model}
          fluid
          formValue={form}
          readOnly={isLoading}
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
