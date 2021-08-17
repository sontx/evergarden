import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createStoryAsync,
  selectFetchingStatus,
  selectStatus,
  selectStory,
  updateStoryAsync,
} from "./storyEditorSlice";
import React, { useCallback, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormGroup,
  Notification,
  Schema,
  Toggle,
} from "rsuite";
import { AuthorsPicker } from "../authors/AuthorsPicker";
import { GenresPicker } from "../genres/GenresPicker";

import "./storyEditor.less";
import { CreateStoryDto, mergeObjects } from "@evergarden/shared";
import { useHistory } from "react-router-dom";
import { ThumbnailUploader } from "../../components/ThumbnailUploader";
import { EditorForm, validateModel } from "../../components/EditorForm";

const { StringType, ArrayType, BooleanType } = Schema.Types;

const REQUIRED_FIELD = "This field is required";

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

function StatusFormControl({ value, onChange, ...rest }: any) {
  const handleChange = useCallback(
    (checked) => {
      if (onChange) {
        onChange(checked ? "full" : "ongoing");
      }
    },
    [onChange],
  );

  return (
    <Toggle
      {...rest}
      onChange={handleChange}
      checked={value === "full"}
      checkedChildren={<span>Full</span>}
      unCheckedChildren={<span>Ongoing</span>}
    />
  );
}

function wrapItems(keyName: string, items?: any[]): any {
  return items
    ? items.map((item) => ({
        [keyName]: typeof item === "object" ? item[keyName] : item,
      }))
    : [];
}

const model = Schema.Model({
  title: StringType().isRequired(REQUIRED_FIELD).minLength(4).maxLength(255),
  description: StringType(),
  status: StringType()
    .isRequired(REQUIRED_FIELD)
    .pattern(/ongoing|full/s, "Status must be either ongoing or full"),
  authors: ArrayType(),
  genres: ArrayType(),
  published: BooleanType(),
});

export function StoryEditor({ mode }: { mode: "create" | "update" }) {
  const story = useAppSelector(selectStory);
  const savingStatus = useAppSelector(selectStatus);
  const fetchingStatus = useAppSelector(selectFetchingStatus);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [value, setValue] = useState<CreateStoryDto>({
    title: "",
    genres: [],
    authors: [],
    published: false,
    description: "",
    status: "ongoing",
  });

  const [uploadFile, setUploadFile] = useState<
    string | File | null | undefined
  >();

  useEffect(() => {
    if (story) {
      if (mode === "update") {
        setValue((prevState) => mergeObjects(story, prevState));
      }
      if (story.cover) {
        setUploadFile(story.cover);
      }
    }
  }, [story, mode]);

  useEffect(() => {
    if (savingStatus === "success") {
      if (story) {
        history.push(`/user/story/${story.url}`);
      }
    } else if (savingStatus === "error") {
      Notification.error({
        title: mode === "create" ? "Save failed" : "Update failed",
        description: "May be some fields were invalid, please check again.",
      });
    }
  }, [history, mode, savingStatus, story]);

  function handleSave() {
    const payload = {
      story: {
        ...value,
        authors: wrapItems("name", value.authors),
        genres: wrapItems("id", value.genres),
      },
      uploadFile: typeof uploadFile === "object" ? uploadFile : undefined,
    };
    if (mode === "update") {
      if (story) {
        dispatch(
          updateStoryAsync({
            ...payload,
            id: story.id,
          }),
        );
      }
    } else {
      dispatch(
        createStoryAsync({
          ...payload,
        }),
      );
    }
  }

  return (
    <EditorForm
      savingStatus={savingStatus}
      fetchingStatus={fetchingStatus}
      mode={mode}
      handleSave={validateModel(model, value) ? handleSave : undefined}
    >
      <Form
        model={model}
        fluid
        className="story-editor-container"
        formValue={value}
        onChange={setValue as any}
      >
        <FormGroup>
          <FormControl name="title" placeholder="Title" />
        </FormGroup>
        <FormGroup>
          <FormControl name="authors" accepter={AuthorsPicker} />
        </FormGroup>
        <FormGroup>
          <FormControl name="genres" accepter={GenresPicker} />
        </FormGroup>
        <FormGroup>
          <FormControl
            name="description"
            rows={5}
            componentClass="textarea"
            placeholder="Description"
          />
        </FormGroup>
        <FormGroup>
          <ThumbnailUploader thumbnail={uploadFile} onChange={setUploadFile} />
        </FormGroup>
        <FormGroup className="form-group-inline">
          <FormControl name="status" accepter={StatusFormControl} />
          <FormControl name="published" accepter={PublishedFormControl} />
        </FormGroup>
      </Form>
    </EditorForm>
  );
}
