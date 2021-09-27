import { Animation, AutoComplete, Icon, InputGroup } from "rsuite";
import { useDebounce } from "use-debounce";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import React, { useCallback, useEffect, useState } from "react";
// @ts-ignore
import BarLoader from "react-bar-loader";

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
import { useSearchStory } from "../hooks/useSearchStory";

export function SearchBox({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();
  const [debouncedQuery] = useDebounce((query || "").trim(), 300);
  const { data: stories, isLoading } = useSearchStory(debouncedQuery);
  const isFloatingHeader = useAppSelector(selectIsFloatingHeader);
  const intl = useIntl();
  const gotoStory = useGoStory();

  useNoBodyScrolling();
  useOverlay();

  useEffect(() => {
    setQuery("");
  }, [dispatch]);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleSelect = useCallback(
    (item) => {
      onClose();
      gotoStory(item.origin.slug);
    },
    [gotoStory, onClose],
  );

  const handleClearSearchText = useCallback(() => {
    setQuery("");
  }, []);

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
              value={query}
              placeholder={intl.formatMessage({ id: "globalSearchHint" })}
              menuClassName="searchbox-menu"
              onChange={handleChange}
              onSelect={handleSelect}
              filterBy={() => true}
              data={(!!query ? stories || [] : []).map((story) => ({
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
            {query ? (
              <InputGroup.Button onClick={handleClearSearchText}>
                <Icon icon="close" style={{ color: "red" }} />
              </InputGroup.Button>
            ) : (
              <InputGroup.Addon>
                <Icon icon="search" />
              </InputGroup.Addon>
            )}
          </InputGroup>
          {isLoading && <BarLoader className="bar-loader" height="1" />}
          <Backdrop onClick={onClose} className="searchbox-backdrop" />
        </div>
      )}
    </Animation.Bounce>
  );
}
