import { ChapterHeader } from "../../../components/ChapterHeader";
import { GetChapterDto } from "@evergarden/shared";
import { useEffect, useRef } from "react";
import { subscribeVerticalScrollDirection } from "../../../utils/subscribe-vertical-scroll-direction";
import { DOMHelper } from "rsuite";

export function ReadingFooter({ chapter }: { chapter: GetChapterDto }) {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeVerticalScrollDirection(({ isDown, touchedTop }) => {
      if (footerRef.current) {
        if (isDown || touchedTop) {
          DOMHelper.removeClass(footerRef.current, "reading-footer--show");
        } else {
          DOMHelper.addClass(footerRef.current, "reading-footer--show");
        }
      }
    });
  }, []);

  return (
    <div className="reading-footer" ref={footerRef}>
      <ChapterHeader chapter={chapter} />
    </div>
  );
}
