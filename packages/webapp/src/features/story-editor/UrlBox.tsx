import { Icon, Input, InputGroup } from "rsuite";
import React, { useCallback, useRef, useState } from "react";
import { stringToSlug } from "@evergarden/shared";
import { useDebouncedCallback } from "use-debounce";
// @ts-ignore
import BarLoader from "react-bar-loader";
import { ProcessingStatus, trimText } from "../../utils/types";

import "./urlBox.less";
import { checkStoryUrl } from "./storyEditorAPI";

export function isValidUrl(st: string): boolean {
  return !!(st && st.length >= 4) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(st);
}

export function UrlBox({ onChange, disabled, ...rest }: any) {
  const touchedRef = useRef(false);
  const renderValueRef = useRef("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<ProcessingStatus>("none");

  const checkUrlIsExisting = useDebouncedCallback(
    (url) => {
      setStatus("processing");
      checkStoryUrl(url)
        .then((exist) => {
          setStatus(exist ? "error" : "success");
        })
        .catch(() => {
          setStatus("error");
        });
    },
    300,
    { trailing: true },
  );

  const handleChange = useCallback(
    (value, event) => {
      touchedRef.current = true;
      if (onChange) {
        onChange(value, event);
      }
      setValue(value);
    },
    [onChange],
  );

  const prevRenderValue = renderValueRef.current;
  renderValueRef.current = trimText(
    !touchedRef.current ? stringToSlug(rest.value || "") : value,
  );

  const isValid = isValidUrl(renderValueRef.current);
  if (!disabled && prevRenderValue !== renderValueRef.current && isValid) {
    checkUrlIsExisting(renderValueRef.current);
  }

  let showStatus = status;
  if (!isValid) {
    showStatus = "error";
  }

  return (
    <div className="url-box-container">
      <InputGroup>
        <Input
          {...rest}
          placeholder="Url slug"
          disabled={disabled}
          value={renderValueRef.current}
          onChange={!disabled ? handleChange : undefined}
          style={touchedRef.current ? {} : { color: "#a4a9b3" }}
        />
        {!disabled && (
          <InputGroup.Button
            onClick={() => checkUrlIsExisting(renderValueRef.current)}
          >
            {(showStatus === "none" || showStatus === "processing") && (
              <Icon icon="check" />
            )}
            {showStatus === "success" && (
              <Icon icon="check" style={{ color: "green" }} />
            )}
            {showStatus === "error" && (
              <Icon icon="check" style={{ color: "red" }} />
            )}
          </InputGroup.Button>
        )}
      </InputGroup>
      {!disabled && status === "processing" && (
        <BarLoader color="#169de0" height="1" />
      )}
    </div>
  );
}
