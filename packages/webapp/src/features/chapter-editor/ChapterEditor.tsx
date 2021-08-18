import { TextEditor } from "../../components/TextEditor";
import { Form, FormControl, FormGroup, Schema, Toggle } from "rsuite";
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
import {
  EnhancedCheckbox,
  SingleCheckboxFormAccepter,
} from "../../components/EnhancedCheckbox";
import { useIntl } from "react-intl";

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
      mode={mode}
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
            <EnhancedCheckbox
              description={intl.formatMessage({
                id: "chapterFormPublishDescription",
              })}
            >
              {intl.formatMessage({ id: "chapterFormPublishTitle" })}
            </EnhancedCheckbox>
          </FormControl>
        </FormGroup>
      </Form>
    </EditorForm>
  );
}
