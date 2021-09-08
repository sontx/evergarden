import { Animation, Panel } from "rsuite";
import { useAppSelector } from "../../../app/hooks";
import { getFont } from "../../../utils/user-settings-config";
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
import { CuteLoader } from "../../../components/CuteLoader";
import { selectIsDarkMode } from "../../global/globalSlice";
import classNames from "classnames";
import { useIsLoggedIn } from "../../user/hooks/useIsLoggedIn";
import { useUserSettings } from "../../settings/hooks/useUserSettings";

const Renderer = withUserSettings(ReadingRenderer);

export function ReadingPanel({
  slug,
  chapterNo,
}: {
  slug: string;
  chapterNo: number;
}) {
  const [showNav, toggleNav, setShowNav] = useToggle();
  const { data: story } = useStory(slug);
  const { data: chapter } = useChapter(story?.id, chapterNo);
  const workingEnvRef = useRef<{ storyId?: number; chapterNo?: number }>({});
  const track = useTracker();
  const syncHistory = useSyncHistory();
  const isLoggedIn = useIsLoggedIn();
  const { data: settings } = useUserSettings();
  const darkMode = useAppSelector(selectIsDarkMode);

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
            {({ className, ...rest }, ref) => (
              <div
                ref={ref}
                {...rest}
                className={classNames(className, "reading-panel-animation")}
              >
                <Panel
                  className="reading-panel-header"
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
        <CuteLoader center dark={darkMode} />
      )}
    </div>
  );
}
