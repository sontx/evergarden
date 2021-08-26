import { TextEditor } from "../../components/TextEditor";
import { Form, FormControl, FormGroup, Schema } from "rsuite";
import React, { useCallback, useEffect, useState } from "react";
import { CreateChapterDto, mergeObjects } from "@evergarden/shared";
import { EditorForm, validateModel } from "../../components/EditorForm";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createChapterAsync,
  selectChapter,
  selectFetchingStatus as selectFetchingChapterStatus,
  selectStatus,
  updateChapterAsync,
} from "./chapterEditorSlice";
import {
  selectFetchingStatus as selectFetchingStoryStatus,
  selectStory,
} from "../story-editor/storyEditorSlice";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import { SingleCheckboxFormAccepter } from "../../components/EnhancedCheckbox/SingleCheckboxFormAccepter";
import { SingleCheckboxForm } from "../../components/EnhancedCheckbox/SingleCheckboxForm";

const { StringType, BooleanType } = Schema.Types;

const model = Schema.Model({
  title: StringType().maxLength(100),
  content: StringType().isRequired("This field is required"),
  published: BooleanType(),
});

export function ChapterEditor({
  mode,
  chapterNo,
}: {
  mode: "create" | "update";
  chapterNo: any;
}) {
  const [value, setValue] = useState<CreateChapterDto>({
    title: "",
    content: "",
    published: false,
  });
  const savingStatus = useAppSelector(selectStatus);
  const fetchingChapterStatus = useAppSelector(selectFetchingChapterStatus);
  const fetchingStoryStatus = useAppSelector(selectFetchingStoryStatus);
  const chapter = useAppSelector(selectChapter);
  const story = useAppSelector(selectStory);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const intl = useIntl();

  useEffect(() => {
    if (chapter && mode === "update") {
      setValue((prevState) => mergeObjects(chapter, prevState));
    }
  }, [chapter, mode]);

  useEffect(() => {
    if (savingStatus === "success") {
      if (story && chapter) {
        history.push(`/user/story/${story.url}/chapter/${chapter.chapterNo}`);
      }
    }
  }, [chapter, history, mode, savingStatus, story]);

  const handleSave = useCallback(() => {
    if (!story) {
      return;
    }

    if (mode === "update") {
      if (chapter) {
        dispatch(
          updateChapterAsync({
            storyId: story.id,
            chapterNo: chapter.chapterNo,
            chapter: {
              ...value,
            },
          }),
        );
      }
    } else {
      dispatch(
        createChapterAsync({
          storyId: story.id,
          chapter: value,
        }),
      );
    }
  }, [chapter, dispatch, mode, story, value]);
  const isValid = validateModel(model, value);

  return (
    <EditorForm
      disabled={savingStatus === "processing"}
      fetchingStatus={
        fetchingChapterStatus === "processing" ||
        fetchingStoryStatus === "processing"
          ? "processing"
          : "none"
      }
      savingStatus={savingStatus}
      actionLabel={intl.formatMessage({
        id: mode === "create" ? "formSaveButtonLabel" : "formUpdateButtonLabel",
      })}
      handleSave={isValid ? handleSave : undefined}
    >
      <Form
        readOnly={savingStatus === "processing"}
        model={model}
        fluid
        className="chapter-editor-container"
        formValue={value}
        onChange={setValue as any}
      >
        <FormGroup>
          <FormControl name="title" placeholder={`Chapter ${chapterNo}`} />
        </FormGroup>
        <FormGroup>
          <FormControl
            name="content"
            accepter={TextEditor}
            placeholder="Chapter content"
          />
        </FormGroup>
        <FormGroup>
          <FormControl name="published" accepter={SingleCheckboxFormAccepter}>
            <SingleCheckboxForm
              description={intl.formatMessage({
                id: "chapterFormPublishDescription",
              })}
            >
              {intl.formatMessage({ id: "chapterFormPublishTitle" })}
            </SingleCheckboxForm>
          </FormControl>
        </FormGroup>
      </Form>
    </EditorForm>
  );
}
