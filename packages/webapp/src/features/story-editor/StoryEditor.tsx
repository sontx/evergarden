import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createStoryAsync,
  selectStatus,
  selectStory,
  updateStoryAsync,
} from "./storyEditorSlice";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  Icon,
  Loader,
  Notification,
  Radio,
  RadioGroup,
  Schema,
  Toggle,
} from "rsuite";
import { AuthorsPicker } from "../authors/AuthorsPicker";
import { GenresPicker } from "../genres/GenresPicker";

import "./storyEditor.less";
import { CreateStoryDto, mergeObjects } from "@evergarden/shared";
import { isValidUrl, UrlBox } from "./UrlBox";
import { Fab } from "react-tiny-fab";

const { StringType, ArrayType, BooleanType } = Schema.Types;

const REQUIRED_FIELD = "This field is required";

function wrapItems(items?: any[]): any {
  return items ? items.map((item) => ({ name: item })) : [];
}

const model = Schema.Model({
  url: StringType("Please enter a valid url slug").addRule((value, data) => {
    return !value || isValidUrl(value);
  }),
  title: StringType().isRequired(REQUIRED_FIELD).minLength(4).maxLength(255),
  description: StringType(),
  status: StringType()
    .isRequired(REQUIRED_FIELD)
    .pattern(/ongoing|full/s, "Status must be either ongoing or full"),
  authors: ArrayType(),
  genres: ArrayType(),
  published: BooleanType(),
});

export function StoryEditor() {
  const saveModeRef = useRef(true);
  const story = useAppSelector(selectStory);
  const savingStatus = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<CreateStoryDto>({
    url: "",
    title: "",
    genres: [],
    authors: [],
    published: false,
    description: "",
    status: "ongoing",
    thumbnail: "",
  });

  useEffect(() => {
    if (story) {
      saveModeRef.current = false;
      setValue((prevState) => mergeObjects(story, prevState));
    }
  }, [story]);

  useEffect(() => {
    if (savingStatus === "success") {
      if (story) {
        Notification.success({
          title: saveModeRef.current
            ? "Saved successfully"
            : "Updated successfully",
          description: story.title,
        });
      }
    } else if (savingStatus === "error") {
      Notification.error({
        title: saveModeRef.current ? "Save failed" : "Update failed",
        description: "May be some fields were invalid, please check again.",
      });
    }
  }, [savingStatus, story]);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  const isValid = (() => {
    const result = model.check(value as any) as any;
    for (const key of Object.keys(result)) {
      if (result[key].hasError) {
        return false;
      }
    }
    return true;
  })();

  function handleSave() {
    const temp: CreateStoryDto = {
      ...value,
      authors: wrapItems(value.authors),
      genres: wrapItems(value.genres),
    };
    if (!saveModeRef.current) {
      if (story) {
        dispatch(
          updateStoryAsync({
            story: temp,
            id: story.id,
          }),
        );
      }
    } else {
      dispatch(
        createStoryAsync({
          ...temp,
          url: value.url ? value.url : undefined,
        }),
      );
    }
  }

  console.log(value);

  return (
    <>
      <Form
        model={model}
        fluid
        className="story-editor-container"
        formValue={value}
        onChange={handleChange}
      >
        <FormGroup>
          <ControlLabel>Url slug</ControlLabel>
          <FormControl name="url" accepter={UrlBox} value={value.title} />
          <HelpBlock>Generated</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl name="title" />
          <HelpBlock>Required</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Authors</ControlLabel>
          <FormControl name="authors" accepter={AuthorsPicker} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Genres</ControlLabel>
          <FormControl name="genres" accepter={GenresPicker} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl name="description" rows={5} componentClass="textarea" />
        </FormGroup>
        <FormGroup className="group-inline">
          <ControlLabel>Status</ControlLabel>
          <FormControl name="status" accepter={RadioGroup} inline>
            <Radio value={"ongoing"}>Ongoing</Radio>
            <Radio value={"full"}>Full</Radio>
          </FormControl>
        </FormGroup>
        <FormGroup className="group-inline">
          <ControlLabel>Published</ControlLabel>
          <FormControl name="published" accepter={Toggle} />
        </FormGroup>
      </Form>

      <Fab
        event="click"
        onClick={isValid ? handleSave : undefined}
        mainButtonStyles={{
          width: "60px",
          height: "60px",
          background: isValid ? "#34c3ff" : "#a4a9b3",
        }}
        style={{ bottom: "40px", right: "20px", margin: 0 }}
        icon={<Icon icon="save" />}
      />

      {savingStatus === "processing" && (
        <div>
          <div
            style={{ zIndex: 10000 }}
            className="rs-modal-backdrop fade in"
          />
          <Loader
            style={{ zIndex: 10001 }}
            center
            vertical
            content={story ? "Updating..." : "Saving..."}
          />
        </div>
      )}
    </>
  );
}
