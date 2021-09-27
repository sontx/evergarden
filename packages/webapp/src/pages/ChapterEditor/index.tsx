import { useParams } from "react-router-dom";
import { UserPage } from "../../components/UserPage";
import React, { useCallback } from "react";
import { Icon, IconButton } from "rsuite";
import { useGoReading } from "../../hooks/navigation/useGoReading";
import { useGoUserChapterList } from "../../hooks/navigation/useGoUserChapterList";
import { useIntl } from "react-intl";
import { UpdateChapterEditor } from "../../features/chapter-editor/UpdateChapterEditor";
import { CreateChapterEditor } from "../../features/chapter-editor/CreateChapterEditor";

export function ChapterEditorPage() {
  const { slug, chapterNo } = useParams<{ slug: string; chapterNo: string }>();
  const intl = useIntl();
  const gotoReading = useGoReading();
  const gotoUserChapterList = useGoUserChapterList();

  const handleBack = useCallback(() => {
    gotoUserChapterList(slug);
  }, [gotoUserChapterList, slug]);

  const handleView = useCallback(() => {
    gotoReading(slug, parseInt(chapterNo));
  }, [chapterNo, gotoReading, slug]);

  const isUpdate = !!chapterNo;

  return (
    <UserPage
      title={intl.formatMessage({
        id: isUpdate ? "pageTitleUpdateChapter" : "pageTitleCreateChapter",
      })}
      action={
        <>
          {isUpdate && (
            <IconButton
              onClick={handleView}
              appearance="link"
              size="sm"
              icon={<Icon icon="eye" />}
            />
          )}
          <IconButton
            icon={<Icon icon="close" />}
            onClick={handleBack}
            appearance="link"
            size="sm"
          />
        </>
      }
    >
      {isUpdate ? (
        <UpdateChapterEditor slug={slug} chapterNo={parseInt(chapterNo)} />
      ) : (
        <CreateChapterEditor slug={slug} />
      )}
    </UserPage>
  );
}
