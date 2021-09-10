import React, { useEffect, useMemo, useState } from "react";
import {
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  RadioGroup,
  Schema,
} from "rsuite";
import { AuthorsPicker } from "../../authors/AuthorPicker";
import { GenresPicker } from "../../genres/GenresPicker";

import {
  CreateStoryDto,
  GetStoryDto,
  mergeObjects,
  StoryStatus,
  UpdateStoryDto,
} from "@evergarden/shared";
import { ThumbnailUploader } from "../../../components/ThumbnailUploader";
import { EditorForm, validateModel } from "../../../components/EditorForm";
import { FormattedMessage, useIntl } from "react-intl";
import { SingleCheckboxFormAccepter } from "../../../components/EnhancedCheckbox/SingleCheckboxFormAccepter";
import { SingleCheckboxForm } from "../../../components/EnhancedCheckbox/SingleCheckboxForm";
import { EnhancedRadio } from "../../../components/EnhancedRadio";

const { StringType, ArrayType, BooleanType } = Schema.Types;

export class CreateStoryData extends CreateStoryDto {
  cover?: File | null;
}
export class UpdateStoryData extends UpdateStoryDto {
  id = 0;
  cover?: File | null;
}

function normalizeItems(keyName: string, items?: any[]): any {
  return items
    ? items.map((item) => ({
        [keyName]: typeof item === "object" ? item[keyName] : item,
      }))
    : [];
}

export function StoryEditor({
  editStory,
  isSaving,
  isFetching,
  onCreate,
  onUpdate,
}: {
  editStory?: GetStoryDto;
  isSaving?: boolean;
  isFetching?: boolean;
  onUpdate?: (updateData: UpdateStoryData) => void;
  onCreate?: (createData: CreateStoryData) => void;
}) {
  type FormType = Omit<CreateStoryDto, "status"> & { isFull: boolean };
  const [formData, setFormData] = useState<FormType>({
    title: "",
    genres: [],
    authors: [],
    published: false,
    description: "",
    isFull: false,
    type: "translate",
  });
  const intl = useIntl();
  const model = useMemo(
    () =>
      Schema.Model({
        title: StringType()
          .isRequired(intl.formatMessage({ id: "requiredFieldMessage" }))
          .minLength(4)
          .maxLength(255),
        description: StringType(),
        isFull: BooleanType(),
        type: StringType(),
        authors: ArrayType(),
        genres: ArrayType(),
        published: BooleanType(),
      }),
    [intl],
  );

  type CoverType = string | File | null | undefined;
  const [coverFile, setCoverFile] = useState<CoverType>();

  useEffect(() => {
    if (editStory) {
      setFormData((prevState) => ({
        ...mergeObjects(editStory, prevState),
        isFull: editStory.status === "full",
      }));

      if (editStory.cover) {
        setCoverFile(editStory.cover);
      }
    }
  }, [editStory]);

  function handleSave() {
    const { isFull, ...rest } = formData;
    const payload = {
      ...rest,
      status: (isFull ? "full" : "ongoing") as StoryStatus,
      authors: normalizeItems("name", formData.authors),
      genres: normalizeItems("id", formData.genres),
      cover: typeof coverFile === "object" ? coverFile : undefined,
    };
    if (editStory) {
      if (onUpdate) {
        onUpdate({
          id: editStory.id,
          ...payload,
        });
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
          id={!editStory ? "formSaveButtonLabel" : "formUpdateButtonLabel"}
        />
      }
      handleSave={handleSave}
    >
      <Form
        readOnly={isSaving}
        model={model}
        fluid
        className="story-editor"
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
            disabled={isSaving}
            thumbnail={coverFile}
            onChange={setCoverFile}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>
            <FormattedMessage id="storyType" />
          </ControlLabel>
          <FormControl name="type" accepter={RadioGroup}>
            <EnhancedRadio
              value="translate"
              description={
                <FormattedMessage id="storyTypeTranslateDescription" />
              }
            >
              <FormattedMessage id="storyTypeTranslate" />
            </EnhancedRadio>
            <EnhancedRadio
              value="convert"
              description={
                <FormattedMessage id="storyTypeConvertDescription" />
              }
            >
              <FormattedMessage id="storyTypeConvert" />
            </EnhancedRadio>
            <EnhancedRadio
              value="self-composed"
              description={
                <FormattedMessage id="storyTypeSelfComposedDescription" />
              }
            >
              <FormattedMessage id="storyTypeSelfComposed" />
            </EnhancedRadio>
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl name="isFull" accepter={SingleCheckboxFormAccepter}>
            <SingleCheckboxForm
              description={
                <FormattedMessage id="storyFormFullStoryDescription" />
              }
            >
              <FormattedMessage id="storyFormFullStoryTitle" />
            </SingleCheckboxForm>
          </FormControl>
          <FormControl name="published" accepter={SingleCheckboxFormAccepter}>
            <SingleCheckboxForm
              description={
                <FormattedMessage id="storyFormPublishDescription" />
              }
            >
              <FormattedMessage id="storyFormPublishTitle" />
            </SingleCheckboxForm>
          </FormControl>
        </FormGroup>
      </Form>
    </EditorForm>
  );
}
