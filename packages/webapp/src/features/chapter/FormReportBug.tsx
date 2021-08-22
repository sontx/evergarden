import {
  GetChapterDto,
  GetStoryDto,
  mergeObjects,
  ReportChapterDto,
} from "@evergarden/shared";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Button,
  SelectPicker,
  Input,
  Form,
  Schema,
  FormGroup,
  FormControl,
} from "rsuite";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { EditorForm, validateModel } from "src/components/EditorForm";
import { reportChapterAsync, selectStatus } from "./chapterSlice";
import "./formReportBug.less";

const { StringType, BooleanType } = Schema.Types;

export const TYPES: { value: string; label: string }[] = [
  {
    value: "wrongContent",
    label: "Wrong content",
  },
  {
    value: "spellingMistake",
    label: "Spelling mistake",
  },
  {
    value: "wrongChapter",
    label: "Wrong chapter",
  },
  {
    value: "wrongTranslation",
    label: "Wrong translation",
  },
  {
    value: "chaptersAreNotDisplayed",
    label: "Chapters are not displayed",
  },
  {
    value: "containsSensitiveVulgarLanguage",
    label: "Contains sensitive, vulgar language",
  },
];

const model = Schema.Model({
  type: StringType().isRequired("This field is required"),
  detail: StringType(),
});

export function FormReportBug(props: {
  story: GetStoryDto | undefined;
  chapter: GetChapterDto | undefined;
  show?: boolean;
  onClose?: () => void;
}) {
  const { story, chapter, show, onClose } = props;
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<ReportChapterDto>({
    type: "",
    detail: "",
  });
  const savingStatus = useAppSelector(selectStatus);

  const handleSubmit = useCallback(() => {
    if (story && chapter) {
      dispatch(
        reportChapterAsync({
          storyId: story.id,
          chapterId: chapter.id,
          report: {
            type: form.type || "",
            detail: form.detail || "",
          },
        }),
      );
    }
  }, [form]);

  const isValid = validateModel(model, form);

  return (
    <Modal
      className="report-bug-container"
      size="xs"
      show={show}
      onHide={onClose}
    >
      <Modal.Header>
        <Modal.Title>How can we improve in chapter?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditorForm
          disabled={!validateModel(model, form)}
          savingStatus={savingStatus}
          mode="create"
          handleSave={isValid ? handleSubmit : undefined}
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
                placeholder="Choose type"
                searchable={false}
                cleanable={false}
                block
                data={TYPES}
                accepter={SelectPicker}
              />
            </FormGroup>
            <FormGroup>
              <FormControl
                name="detail"
                rows={5}
                componentClass="textarea"
                placeholder="Details ..."
              />
            </FormGroup>
          </Form>
        </EditorForm>
      </Modal.Body>
    </Modal>
  );
}
