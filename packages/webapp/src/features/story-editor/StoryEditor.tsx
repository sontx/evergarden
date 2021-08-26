import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createStoryAsync,
  selectFetchingStatus,
  selectStatus,
  selectStory,
  updateStoryAsync,
} from "./storyEditorSlice";
import React, { useEffect, useState } from "react";
import {
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Radio,
  RadioGroup,
  Schema,
} from "rsuite";
import { AuthorsPicker } from "../authors/AuthorsPicker";
import { GenresPicker } from "../genres/GenresPicker";

import "./storyEditor.less";
import { CreateStoryDto, mergeObjects, StoryStatus } from "@evergarden/shared";
import { useHistory } from "react-router-dom";
import { ThumbnailUploader } from "../../components/ThumbnailUploader";
import { EditorForm, validateModel } from "../../components/EditorForm";
import { useIntl } from "react-intl";
import { SingleCheckboxFormAccepter } from "../../components/EnhancedCheckbox/SingleCheckboxFormAccepter";
import { SingleCheckboxForm } from "../../components/EnhancedCheckbox/SingleCheckboxForm";

const { StringType, ArrayType, BooleanType } = Schema.Types;

const REQUIRED_FIELD = "This field is required";

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
  isFull: BooleanType(),
  type: StringType(),
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
  const intl = useIntl();
  const [formData, setFormData] = useState<
    Omit<CreateStoryDto, "status"> & { isFull: boolean }
  >({
    title: "",
    genres: [],
    authors: [],
    published: false,
    description: "",
    isFull: false,
    type: "translate"
  });

  const [uploadFile, setUploadFile] = useState<
    string | File | null | undefined
  >();

  useEffect(() => {
    if (story) {
      if (mode === "update") {
        setFormData((prevState) => ({
          ...mergeObjects(story, prevState),
          isFull: story.status === "full",
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          isFull: story.status === "full",
        }));
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
    }
  }, [history, mode, savingStatus, story]);

  function handleSave() {
    const { isFull, ...rest } = formData;
    const payload = {
      story: {
        ...rest,
        status: (isFull ? "full" : "ongoing") as StoryStatus,
        authors: wrapItems("name", formData.authors),
        genres: wrapItems("id", formData.genres),
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
      disabled={!validateModel(model, formData)}
      savingStatus={savingStatus}
      fetchingStatus={fetchingStatus}
      actionLabel={intl.formatMessage({
        id: mode === "create" ? "formSaveButtonLabel" : "formUpdateButtonLabel",
      })}
      handleSave={handleSave}
    >
      <Form
        readOnly={savingStatus === "processing"}
        model={model}
        fluid
        className="story-editor-container"
        formValue={formData}
        onChange={setFormData as any}
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
          <ThumbnailUploader
            disabled={savingStatus === "processing"}
            thumbnail={uploadFile}
            onChange={setUploadFile}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Type</ControlLabel>
          <FormControl name="type" accepter={RadioGroup}>
            <Radio value="translate">Translate</Radio>
            <Radio value="convert">Convert</Radio>
            <Radio value="self-composed">Self-composed</Radio>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl name="isFull" accepter={SingleCheckboxFormAccepter}>
            <SingleCheckboxForm
              description={intl.formatMessage({
                id: "storyFormFullStoryDescription",
              })}
            >
              {intl.formatMessage({ id: "storyFormFullStoryTitle" })}
            </SingleCheckboxForm>
          </FormControl>
          <FormControl name="published" accepter={SingleCheckboxFormAccepter}>
            <SingleCheckboxForm
              description={intl.formatMessage({
                id: "storyFormPublishDescription",
              })}
            >
              {intl.formatMessage({ id: "storyFormPublishTitle" })}
            </SingleCheckboxForm>
          </FormControl>
        </FormGroup>
      </Form>
    </EditorForm>
  );
}
