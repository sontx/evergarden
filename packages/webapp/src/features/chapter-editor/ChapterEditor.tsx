import {TextEditor} from "../../components/TextEditor";
import {
  Form,
  FormControl,
  FormGroup,
  Notification,
  Schema,
  Toggle
} from "rsuite";
import React, {useCallback, useEffect, useState} from "react";
import {CreateChapterDto, mergeObjects} from "@evergarden/shared";
import {EditorForm, validateModel} from "../../components/EditorForm";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
  createChapterAsync,
  selectChapter,
  selectStatus,
  updateChapterAsync,
} from "./chapterEditorSlice";
import {selectStory} from "../story-editor/storyEditorSlice";
import {useHistory} from "react-router-dom";

const { StringType, ArrayType, BooleanType } = Schema.Types;

function PublishedFormControl({ value, ...rest }: any) {
  return (
    <Toggle
      {...rest}
      checked={!!value}
      checkedChildren={<span>Published</span>}
      unCheckedChildren={<span>Unpublished</span>}
    />
  );
}

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
  const chapter = useAppSelector(selectChapter);
  const story = useAppSelector(selectStory);
  const dispatch = useAppDispatch();
  const history = useHistory();

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
    } else if (savingStatus === "error") {
      Notification.error({
        title: mode === "create" ? "Save failed" : "Update failed",
        description: "May be some fields were invalid, please check again.",
      });
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
            chapter: {
              ...value,
              id: chapter.id,
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
      savingStatus={savingStatus}
      mode={mode}
      handleSave={isValid ? handleSave : undefined}
    >
      <Form
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
          <FormControl name="published" accepter={PublishedFormControl} />
        </FormGroup>
        <FormGroup>
          <FormControl
            name="content"
            accepter={TextEditor}
            placeholder="Chapter content"
          />
        </FormGroup>
      </Form>
    </EditorForm>
  );
}
