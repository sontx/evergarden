import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useEffect, useRef, useState } from "react";

import "./index.less";
import { StandardProps } from "rsuite/es/@types/common";

export function TextEditor({
  value,
  onChange,
  disabled,
  name,
  placeholder,
  onBlur,
}: {
  value?: string;
  onChange?: (text: string) => void;
  disabled?: boolean;
} & StandardProps) {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const contentElement = containerRef.current
        .getElementsByTagName("textarea")
        .item(0);
      if (contentElement) {
        contentElement.name = name;
        contentElement.placeholder = placeholder;
        contentElement.onblur = onBlur;
      }
    }
  }, [name, onBlur, placeholder]);

  return (
    <div className="text-editor-container" ref={containerRef}>
      <ReactMde
        readOnly={disabled}
        value={value || ""}
        onChange={onChange || (() => undefined)}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
        }
        childProps={{
          writeButton: {
            tabIndex: -1,
          },
        }}
      />
    </div>
  );
}
