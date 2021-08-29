import { GetChapterDto, CreateReportChapterDto } from "@evergarden/shared";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import {
  Modal,
  SelectPicker,
  Form,
  Schema,
  FormGroup,
  FormControl,
} from "rsuite";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { EditorForm, validateModel } from "src/components/EditorForm";
import { reportChapterAsync, selectStatusReport } from "./chapterSlice";
import "./formReportBug.less";

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
  chapter: GetChapterDto | undefined;
  show?: boolean;
  onClose?: () => void;
}) {
  const { chapter, show, onClose } = props;
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<CreateReportChapterDto>({
    type: "",
    detail: "",
  });
  const savingStatus = useAppSelector(selectStatusReport);
  const intl = useIntl();

  const handleSubmit = useCallback(() => {
    if (chapter) {
      dispatch(
        reportChapterAsync({
          chapterId: chapter.id,
          report: {
            type: form.type,
            detail: form.detail || "",
          },
        }),
      ).then(() => {
        if (onClose) {
          onClose();
        }
      });
    }
  }, [form, chapter]);

  const isValid = validateModel(model, form);

  return (
    <Modal
      className="report-bug-container"
      size="xs"
      show={show}
      onHide={onClose}
    >
      <Modal.Header>
        <Modal.Title>
          {intl.formatMessage({ id: "titleFormReportBug" })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditorForm
          disabled={!validateModel(model, form)}
          savingStatus={savingStatus}
          actionLabel={intl.formatMessage({ id: "formSaveButtonLabel" })}
          handleSave={isValid && form?.type ? handleSubmit : undefined}
        >
          <Form
            readOnly={savingStatus === "processing"}
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
      </Modal.Body>
    </Modal>
  );
}
