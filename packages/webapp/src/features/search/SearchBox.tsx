import { Animation, AutoComplete, DOMHelper, Icon, InputGroup } from "rsuite";
import { useDebouncedCallback } from "use-debounce";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  clear,
  searchStoriesAsync,
  selectStatus,
  selectStories,
} from "./searchSlice";
import React, { useCallback, useEffect, useState } from "react";
// @ts-ignore
import BarLoader from "react-bar-loader";
import { trimText } from "../../utils/types";

import "./searchBox.less";

import defaultThumbnail from "../../images/logo.png";
import { StorySearchBody } from "@evergarden/shared";
import classNames from "classnames";

export function SearchBox({
  onSelectStory,
  onClose,
}: {
  onClose?: () => void;
  onSelectStory: (story: StorySearchBody) => void;
}) {
  const dispatch = useAppDispatch();
  const stories = useAppSelector(selectStories);
  const status = useAppSelector(selectStatus);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(clear());
    return () => {
      DOMHelper.removeClass(document.body, "noscroll");
    };
  }, [dispatch]);

  const callSearchDebounce = useDebouncedCallback((text) => {
    dispatch(searchStoriesAsync(text));
  }, 300);

  const handleChange = useCallback(
    (text) => {
      setSearchText(text);
      const searchText = trimText(text);
      if (searchText) {
        callSearchDebounce(searchText);
      } else {
        dispatch(clear());
      }
    },
    [callSearchDebounce, dispatch],
  );

  const handleSelect = useCallback(
    (item) => {
      onSelectStory(item.origin);
    },
    [onSelectStory],
  );

  const handleShow = useCallback(() => {
    DOMHelper.addClass(document.body, "noscroll");
  }, []);

  const handleHide = useCallback(() => {
    DOMHelper.removeClass(document.body, "noscroll");
  }, []);

  const handleClearSearchText = useCallback(() => {
    setSearchText("");
    dispatch(clear());
  }, [dispatch]);

  return (
    <Animation.Bounce in={true}>
      {({ className, ...rest }, ref) => (
        <div
          className={classNames("searchbox-container", className)}
          {...rest}
          ref={ref}
        >
          <InputGroup inside>
            <AutoComplete
              autoFocus
              value={searchText}
              placeholder="Search story..."
              onExit={handleHide}
              onEnter={handleShow}
              menuClassName="searchbox-menu"
              onChange={handleChange}
              onSelect={handleSelect}
              filterBy={() => true}
              data={stories.map((story) => ({
                label: story.title,
                value: story.title,
                origin: story,
              }))}
              renderItem={(item) => {
                const data = item as any;
                return (
                  <div className="searchbox-menu-item">
                    <div>
                      <img src={data.origin.thumbnail || defaultThumbnail} />
                    </div>
                    <div>
                      <div>{data.origin.title}</div>
                      <div className="searchbox-menu-item--sub">
                        {data.origin.description || "Coming soon ;)"}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            {searchText ? (
              <InputGroup.Button onClick={handleClearSearchText}>
                <Icon icon="close" style={{ color: "red" }} />
              </InputGroup.Button>
            ) : (
              <InputGroup.Addon>
                <Icon icon="search" />
              </InputGroup.Addon>
            )}
          </InputGroup>
          {status === "processing" && <BarLoader color="#169de0" height="1" />}
          <div onClick={onClose} className="rs-modal-backdrop backdrop" />
        </div>
      )}
    </Animation.Bounce>
  );
}
