import { ChapterList, ChapterListBaseProps } from "../ChapterList";
import { Panel, PanelProps } from "rsuite";
import { FormattedMessage } from "react-intl";
import { useChapters } from "../hooks/useChapters";
import { GetStoryDto } from "@evergarden/shared";
import { useCallback } from "react";
import { scrollIntoHighlightedChapter } from "../ChapterList/utils";

type ChapterRangeProps = ChapterListBaseProps &
  PanelProps & {
    story?: GetStoryDto;
    from: number;
    to: number;
    enabled: boolean;
  };

export function ChapterRange({
  from,
  to,
  story,
  renderMeta,
  onClick,
  sort,
  enabled,
  highlighted,
  unreadFrom,
  ...rest
}: ChapterRangeProps) {
  const { data: chapters } = useChapters(story?.id, from, to, {
    enabled: enabled && !!story,
  });

  const handleRef = useCallback((node) => {
    if (!scrollIntoHighlightedChapter(node as HTMLElement)) {
      (node as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <Panel
      onEntered={handleRef}
      className="chapter-range"
      header={
        <FormattedMessage
          id="chaptersRangeTitle"
          values={{
            from: sort === "asc" ? from : to,
            to: sort === "asc" ? to : from,
          }}
        />
      }
      {...rest}
    >
      <ChapterList
        skeletonFrom={from}
        skeletonTo={to}
        chapters={chapters}
        renderMeta={renderMeta}
        onClick={onClick}
        sort={sort}
        highlighted={highlighted}
        unreadFrom={unreadFrom}
      />
    </Panel>
  );
}
