import { TagPicker } from "rsuite";
// @ts-ignore
import BarLoader from "react-bar-loader";
import React, { useCallback, useState } from "react";

import { GetAuthorDto } from "@evergarden/shared";
import { useDebounce } from "use-debounce";
import { useSearchAuthors } from "../hooks/useSearchAuthors";

export function AuthorsPicker({ onChange, value, ...rest }: any) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce((query || "").trim(), 300);
  const { data: authors, isLoading } = useSearchAuthors(debouncedQuery);

  const handleChange = useCallback(
    (newValue) => {
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange],
  );

  const mergedAuthors: GetAuthorDto[] = (value || ([] as any[])).map(
    (item: any) =>
      typeof item !== "object"
        ? {
            name: item,
            id: "",
          }
        : item,
  );

  for (const author of authors || []) {
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
        creatable
        value={((value || []) as any[]).map((item) =>
          typeof item === "object" ? item.name : item,
        )}
        placeholder="Authors"
        menuClassName="authors-picker-menu"
        style={{ width: "100%" }}
        data={mergedAuthors}
        labelKey="name"
        valueKey="name"
        onSearch={setQuery}
      />
      {isLoading && <BarLoader className="bar-loader" height="1" />}
    </div>
  );
}
