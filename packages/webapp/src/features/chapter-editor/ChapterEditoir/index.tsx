import { TextEditor } from "../../../components/TextEditor";
import { Form, FormControl, FormGroup, Schema } from "rsuite";
import React, { useEffect, useMemo, useState } from "react";
import {
  CreateChapterDto,
  GetChapterDto,
  mergeObjects,
  UpdateChapterDto,
} from "@evergarden/shared";
import { EditorForm, validateModel } from "../../../components/EditorForm";
import { FormattedMessage, useIntl } from "react-intl";
import { SingleCheckboxFormAccepter } from "../../../components/EnhancedCheckbox/SingleCheckboxFormAccepter";
import { SingleCheckboxForm } from "../../../components/EnhancedCheckbox/SingleCheckboxForm";

const { StringType, BooleanType } = Schema.Types;

export function ChapterEditor({
  editChapter,
  isSaving,
  isFetching,
  onCreate,
  onUpdate,
}: {
  editChapter?: GetChapterDto;
  isSaving?: boolean;
  isFetching?: boolean;
  onCreate?: (data: CreateChapterDto) => void;
  onUpdate?: (chapterNo: number, data: UpdateChapterDto) => void;
}) {
  const [formData, setFormData] = useState<CreateChapterDto>({
    title: "",
    content: "",
    published: false,
  });
  const intl = useIntl();
  const model = useMemo(
    () =>
      Schema.Model({
        title: StringType().maxLength(100),
        content: StringType().isRequired(
          intl.formatMessage({ id: "requiredFieldMessage" }),
        ),
        published: BooleanType(),
      }),
    [intl],
  );

  useEffect(() => {
    if (editChapter) {
      setFormData((prevState) => mergeObjects(editChapter, prevState));
    }
  }, [editChapter]);

  function handleSave() {
    const payload = {
      title: formData.title,
      content: formData.content,
      published: formData.published,
    };

    if (editChapter) {
      if (onUpdate) {
        onUpdate(editChapter.chapterNo, payload);
      }
    } else {
      if (onCreate) {
        onCreate(payload);
      }
    }
  }

  return (
    <EditorForm
      disabled={!validateModel(model, formData)}
      isSaving={isSaving}
      isFetching={isFetching}
      actionLabel={
        <FormattedMessage
          id={!editChapter ? "formSaveButtonLabel" : "formUpdateButtonLabel"}
        />
      }
      handleSave={handleSave}
    >
      <Form
        readOnly={isSaving}
        model={model}
        fluid
        className="chapter-editor"
        formValue={formData}
        onChange={setFormData as any}
      >
        <FormGroup>
          <FormControl
            name="title"
            placeholder={intl.formatMessage(
              { id: "chapterTitle" },
              { chapterNo: editChapter?.chapterNo },
            )}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            name="content"
            accepter={TextEditor}
            placeholder={intl.formatMessage({ id: "editChapterContentHint" })}
          />
        </FormGroup>
        <FormGroup>
          <FormControl name="published" accepter={SingleCheckboxFormAccepter}>
            <SingleCheckboxForm
              description={
                <FormattedMessage id="chapterFormPublishDescription" />
              }
            >
              <FormattedMessage id="chapterFormPublishTitle" />
            </SingleCheckboxForm>
          </FormControl>
        </FormGroup>
      </Form>
    </EditorForm>
  );
}
