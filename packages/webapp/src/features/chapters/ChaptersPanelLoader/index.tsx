import { List, Placeholder } from "rsuite";
import { randomInt } from "../../../utils/types";
import { memo } from "react";
import { StandardProps } from "rsuite/es/@types/common";

const { Graph } = Placeholder;

const RangeLoader = memo(function ({
  hasChildren,
  ...rest
}: { hasChildren?: boolean } & StandardProps) {
  return (
    <div {...rest}>
      <Graph height={27} active />
      {hasChildren && (
        <List size="sm" style={{ margin: "10px 5px 0 5px" }}>
          {Array.from(Array(7).keys()).map((index) => (
            <List.Item key={index}>
              <Graph
                height={10}
                active
                style={{ width: `${randomInt(20, 50)}vw` }}
              />
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );
});

export const ChaptersPanelLoader = memo(function () {
  return (
    <div>
      <RangeLoader hasChildren />
      <RangeLoader style={{ marginTop: "10px" }} />
      <RangeLoader style={{ marginTop: "10px" }} />
    </div>
  );
});
