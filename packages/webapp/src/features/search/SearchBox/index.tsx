import { Animation, AutoComplete, DOMHelper, Icon, InputGroup } from "rsuite";
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
import "./index.less";
import {
  selectShowSearchBox,
  setShowSearchBox,
} from "../../settings/settingsSlice";
import { openStoryByUrl } from "../../story/storySlice";
import { useHistory } from "react-router-dom";
import { Backdrop } from "../../../components/Backdrop";

export function SearchBox() {
  const dispatch = useAppDispatch();
  const stories = useAppSelector(selectStories);
  const status = useAppSelector(selectStatus);
  const showSearchBox = useAppSelector(selectShowSearchBox);
  const [searchText, setSearchText] = useState("");
  const intl = useIntl();
  const history = useHistory();

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
      dispatch(setShowSearchBox(false));
      dispatch(openStoryByUrl(history, item.origin.url));
    },
    [dispatch, history],
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
    <>
      {showSearchBox && (
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
                  placeholder={intl.formatMessage({ id: "globalSearchHint" })}
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
                          <EnhancedImage
                            src={data.origin.thumbnail || defaultThumbnail}
                            defaultSrc={defaultThumbnail}
                          />
                        </div>
                        <div>
                          <div>
                            <TextTruncate text={data.origin.title} line={1} />
                          </div>
                          <div className="searchbox-menu-item--sub">
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
              {status === "processing" && (
                <BarLoader color="#169de0" height="1" />
              )}
              <Backdrop onClick={() => dispatch(setShowSearchBox(false))} />
            </div>
          )}
        </Animation.Bounce>
      )}
    </>
  );
}
