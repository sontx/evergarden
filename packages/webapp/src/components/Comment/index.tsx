import { GetStoryDto } from "@evergarden/shared";
// @ts-ignore
import { Comments } from "react-facebook";
import { useIsDarkMode } from "../../features/global/hooks/useIsDarkMode";
import { isMobileOnly } from "react-device-detect";

export function Comment({ story }: { story: GetStoryDto }) {
  const { isDarkMode } = useIsDarkMode();
  return (
    <Comments
      href={`${window.location.origin}/${story.slug}`}
      mobile={isMobileOnly}
      numPosts={10}
      width="100%"
      colorScheme={isDarkMode ? "dark" : "light"}
    />
  );
}
