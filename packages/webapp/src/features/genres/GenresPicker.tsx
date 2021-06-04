import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAllGenresAsync, selectGenres, selectStatus } from "./genresSlice";
import { TagPicker } from "rsuite";
// @ts-ignore
import BarLoader from "react-bar-loader";
import React, { useEffect, useState } from "react";

import "./genresPicker.less";

export function GenresPicker({ value, ...rest }: any) {
  const status = useAppSelector(selectStatus);
  const genres = useAppSelector(selectGenres);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!genres) {
      dispatch(fetchAllGenresAsync());
    }
  }, [dispatch, genres]);

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
        data={genres as any}
        labelKey="name"
        valueKey="id"
      />
      {status === "processing" && <BarLoader color="#169de0" height="1" />}
    </div>
  );
}
