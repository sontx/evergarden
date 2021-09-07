import { TagPicker } from "rsuite";
// @ts-ignore
import BarLoader from "react-bar-loader";
import React from "react";
import { useGenres } from "../hooks/useGenres";

export function GenresPicker({ value, ...rest }: any) {
  const { data: genres } = useGenres();

  return (
    <div>
      <TagPicker
        placement="auto"
        {...rest}
        value={((value || []) as any[]).map((item) =>
          typeof item === "object" ? item.id : item,
        )}
        creatable={false}
        placeholder="Genres"
        menuClassName="genres-picker-menu"
        style={{ width: "100%" }}
        data={genres}
        labelKey="name"
        valueKey="id"
      />
      {!genres && <BarLoader className="bar-loader" height="1" />}
    </div>
  );
}
