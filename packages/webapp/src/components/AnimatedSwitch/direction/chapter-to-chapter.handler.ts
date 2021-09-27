import {
  BACK_DIRECTION,
  Direction,
  DirectionHandler,
  NEXT_DIRECTION,
} from "./direction-handler";
import { matchPath } from "react-router-dom";

function extractParams(
  pathname: string,
): { slug: string; chapterNo: number } | null {
  const match = matchPath<{ slug: string; chapterNo: string }>(pathname, {
    path: "/reading/:slug/:chapterNo",
    exact: true,
  });
  return match
    ? {
        slug: match.params?.slug,
        chapterNo: parseInt(match.params?.chapterNo || ""),
      }
    : null;
}

export class ChapterToChapterHandler implements DirectionHandler {
  handle(prev: string, next: string): Direction | false {
    const prevParams = extractParams(prev);
    const nextParams = extractParams(next);
    if (
      prevParams &&
      nextParams &&
      prevParams.slug === nextParams.slug &&
      prevParams.chapterNo !== nextParams.chapterNo
    ) {
      return prevParams.chapterNo > nextParams.chapterNo
        ? BACK_DIRECTION
        : NEXT_DIRECTION;
    }
    return false;
  }
}
