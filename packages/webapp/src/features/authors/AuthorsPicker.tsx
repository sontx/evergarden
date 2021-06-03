import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { searchAuthorAsync, selectAuthors, selectStatus } from "./authorsSlice";
import { TagPicker } from "rsuite";
// @ts-ignore
import BarLoader from "react-bar-loader";
import React, { useCallback, useState } from "react";

import "./authorsPicker.less";
import { GetAuthorDto } from "@evergarden/shared";
import { useDebouncedCallback } from "use-debounce";

export function AuthorsPicker({ onChange, ...rest }: any) {
  const status = useAppSelector(selectStatus);
  const authors = useAppSelector(selectAuthors);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<string[]>([]);

  const searchDebounce = useDebouncedCallback(
    (word: string) => {
      dispatch(searchAuthorAsync(word));
    },
    300,
    { trailing: true },
  );

  const handleSearch = useCallback(
    (word) => {
      if (word) {
        searchDebounce(word);
      }
    },
    [searchDebounce],
  );

  const handleChange = useCallback((newValue) => {
    if (onChange) {
      onChange(newValue);
    }
    setValue(newValue);
  }, []);

  const handleClean = useCallback(() => {
    setValue([]);
  }, []);

  const mergedAuthors: GetAuthorDto[] = value.map((item) => ({
    name: item,
    id: "",
  }));
  for (const author of authors) {
    const found = mergedAuthors.find((item) => item.name === author.name);
    if (!found) {
      mergedAuthors.push(author);
    }
  }

  return (
    <div>
      <TagPicker
        {...rest}
        placement="auto"
        onChange={handleChange}
        onClean={handleClean}
        creatable
        value={value}
        placeholder="Authors..."
        menuClassName="authors-picker-menu"
        style={{ width: "100%" }}
        data={mergedAuthors}
        labelKey="name"
        valueKey="name"
        onSearch={handleSearch}
      />
      {status === "processing" && <BarLoader color="#169de0" height="1" />}
    </div>
  );
}
