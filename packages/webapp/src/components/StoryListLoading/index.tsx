import { List } from "rsuite";
import { StoryItemLoading } from "../StoryItemLoading";
import { randomInt } from "../../utils/types";

export function StoryListLoading({ max, min }: { max: number; min: number }) {
  return (
    <List>
      {Array.from(Array(randomInt(min, max)).keys()).map((index) => (
        <List.Item key={index}>
          <StoryItemLoading />
        </List.Item>
      ))}
    </List>
  );
}
