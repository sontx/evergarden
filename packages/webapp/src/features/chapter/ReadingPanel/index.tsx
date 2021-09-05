import { Animation, Loader, Panel } from "rsuite";
import { useAppSelector } from "../../../app/hooks";
import { selectIsLoggedIn, selectUserSettings } from "../../user/userSlice";
import {
  defaultUserSettings,
  getFont,
} from "../../../utils/user-settings-config";
import { ReadingHeader } from "../ReadingHeader";
import { ReadingRenderer } from "../../../components/ReadingRenderer";
import { useToggle } from "../../../hooks/useToggle";
import { useChapter } from "../hooks/useChapter";
import { useStory } from "../../story/hooks/useStory";
import { ReadingFooter } from "../ReadingFooter";
import { TopNavigation } from "../TopNavitation";
import { BottomNavigation } from "../BottomNavigation";
import { useEffect, useRef } from "react";
import { withUserSettings } from "../../../components/ReadingRenderer/withUserSettings";
import { useTracker } from "../hooks/useTracker";
import { useSyncHistory } from "../hooks/useSyncHistory";
import { usePrefetchNextChapter } from "../hooks/usePrefetchNextChapter";

const Renderer = withUserSettings(ReadingRenderer);

export function ReadingPanel({
  slug,
  chapterNo,
}: {
  slug: string;
  chapterNo: number;
}) {
  const settings = useAppSelector(selectUserSettings) || defaultUserSettings;
  const [showNav, toggleNav, setShowNav] = useToggle();
  const { data: story } = useStory(slug);
  const { data: chapter } = useChapter(story?.id, chapterNo);
  const workingEnvRef = useRef<{ storyId?: number; chapterNo?: number }>({});
  const track = useTracker();
  const syncHistory = useSyncHistory();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  usePrefetchNextChapter(story, chapter);

  useEffect(() => {
    const env = workingEnvRef.current;
    if (
      story &&
      chapter &&
      (env.storyId !== story.id || env.chapterNo !== chapter.chapterNo)
    ) {
      track(story.id);
      if (isLoggedIn) {
        syncHistory({ story, chapter });
      }
      workingEnvRef.current = {
        storyId: story.id,
        chapterNo: chapter.chapterNo,
      };
      setShowNav(false);
    }
  }, [story, chapter, setShowNav, track, syncHistory, isLoggedIn]);

  return (
    <div className="reading-panel">
      {story && chapter ? (
        <>
          <Animation.Bounce in>
            {(animationProps, ref) => (
              <div ref={ref} {...animationProps}>
                <Panel
                  style={{ fontFamily: getFont(settings.readingFont).family }}
                  header={chapter && <ReadingHeader chapter={chapter} />}
                >
                  <Renderer
                    onClick={toggleNav}
                    content={chapter.content}
                    settings={settings}
                  />
                </Panel>
              </div>
            )}
          </Animation.Bounce>
          {!showNav && <ReadingFooter chapter={chapter} />}
          <Animation.Fade in={showNav} unmountOnExit>
            {(props1, ref1) => (
              <div {...props1} ref={ref1}>
                <TopNavigation chapter={chapter} story={story} />
                <BottomNavigation chapter={chapter} story={story} />
              </div>
            )}
          </Animation.Fade>
        </>
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
}
