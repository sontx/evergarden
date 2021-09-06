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
  const { url, chapterNo } = useParams<{ url: string; chapterNo: string }>();
  const intl = useIntl();
  const gotoReading = useGoReading();
  const gotoUserChapterList = useGoUserChapterList();

  const handleBack = useCallback(() => {
    gotoUserChapterList(url);
  }, [gotoUserChapterList, url]);

  const handleView = useCallback(() => {
    gotoReading(url, parseInt(chapterNo));
  }, [chapterNo, gotoReading, url]);

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
        <UpdateChapterEditor slug={url} chapterNo={parseInt(chapterNo)} />
      ) : (
        <CreateChapterEditor slug={url} />
      )}
    </UserPage>
  );
}
