import { Animation, AutoComplete, Icon, InputGroup } from "rsuite";
import { useDebouncedCallback } from "use-debounce";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clear,
  searchStoriesAsync,
  selectStatus,
  selectStories,
} from "../searchSlice";
import React, { useCallback, useEffect, useState } from "react";
// @ts-ignore
import BarLoader from "react-bar-loader";
import { trimText } from "../../../utils/types";

import defaultThumbnail from "../../../images/logo.png";

import classNames from "classnames";
import { EnhancedImage } from "../../../components/EnhancedImage";
import { useIntl } from "react-intl";
import TextTruncate from "react-text-truncate";
import { Backdrop } from "../../../components/Backdrop";
import { useOverlay } from "../../../hooks/useOverlay";
import { useNoBodyScrolling } from "../../../hooks/useNoBodyScrolling";
import { selectIsFloatingHeader } from "../../global/globalSlice";
import { useGoStory } from "../../../hooks/navigation/useGoStory";

export function SearchBox({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const stories = useAppSelector(selectStories);
  const status = useAppSelector(selectStatus);
  const [searchText, setSearchText] = useState("");
  const isFloatingHeader = useAppSelector(selectIsFloatingHeader);
  const intl = useIntl();
  const gotoStory = useGoStory();

  useNoBodyScrolling();
  useOverlay();

  useEffect(() => {
    dispatch(clear());
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
      onClose();
      gotoStory(item.origin.url);
    },
    [gotoStory, onClose],
  );

  const handleClearSearchText = useCallback(() => {
    setSearchText("");
    dispatch(clear());
  }, [dispatch]);

  return (
    <Animation.Bounce in={true}>
      {({ className, ...rest }, ref) => (
        <div
          className={classNames(className, "searchbox-container", {
            "searchbox-container--float": isFloatingHeader,
          })}
          {...rest}
          ref={ref}
        >
          <InputGroup inside>
            <AutoComplete
              autoFocus
              value={searchText}
              placeholder={intl.formatMessage({ id: "globalSearchHint" })}
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
                      <EnhancedImage
                        src={data.origin.thumbnail || defaultThumbnail}
                        defaultSrc={defaultThumbnail}
                      />
                    </div>
                    <div>
                      <div>
                        <TextTruncate text={data.origin.title} line={1} />
                      </div>
                      <div className="subtitle">
                        <TextTruncate
                          text={data.origin.description || "Coming soon ;)"}
                          line={2}
                        />
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
          <Backdrop onClick={onClose} className="searchbox-backdrop" />
        </div>
      )}
    </Animation.Bounce>
  );
}
