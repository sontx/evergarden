import { Animation, Panel } from "rsuite";
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
import classNames from "classnames";
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
  const { data: settings } = useUserSettings();

  usePrefetchNextChapter(story, chapter);

  useEffect(() => {
    const env = workingEnvRef.current;
    if (
      story &&
      chapter &&
      (env.storyId !== story.id || env.chapterNo !== chapter.chapterNo)
    ) {
      track(story.id);
      syncHistory({ story, chapter });
      workingEnvRef.current = {
        storyId: story.id,
        chapterNo: chapter.chapterNo,
      };
      setShowNav(false);
    }
  }, [story, chapter, setShowNav, track, syncHistory]);

  return (
    <div className="reading-panel">
      {story && chapter ? (
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
      ) : (
        <div onClick={toggleNav} style={{ width: "100%", height: "100%" }}>
          <CuteLoader center />
        </div>
      )}
      {!showNav && chapter && <ReadingFooter chapter={chapter} />}
      <Animation.Fade in={showNav} unmountOnExit>
        {(props1, ref1) => (
          <div {...props1} ref={ref1}>
            <TopNavigation
              slug={slug}
              chapterNo={chapterNo}
              chapter={chapter}
              story={story}
            />
            <BottomNavigation
              slug={slug}
              chapterNo={chapterNo}
              chapter={chapter}
              story={story}
            />
          </div>
        )}
      </Animation.Fade>
    </div>
  );
}
