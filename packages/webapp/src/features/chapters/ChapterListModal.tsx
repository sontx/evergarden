import {
  Icon,
  IconButton,
  Input,
  InputGroup,
  List,
  Loader,
  Message,
  Modal,
} from "rsuite";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import "./chapterListModel.less";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchChaptersAsync,
  selectChapters,
  selectErrorMessage,
} from "./chaptersSlice";
import { selectStory } from "../story/storySlice";
import { selectChapter, selectStatus } from "../chapter/chapterSlice";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { GetChapterDto } from "@evergarden/shared";
import classNames from "classnames";
import { useDebouncedCallback } from "use-debounce";

export function ChapterListModal(props: {
  show?: boolean;
  onClose?: () => void;
}) {
  const { show, onClose } = props;
  const [isDesc, setDesc] = useState(true);
  const chapters = useAppSelector(selectChapters);
  const story = useAppSelector(selectStory);
  const status = useAppSelector(selectStatus);
  const errorMessage = useAppSelector(selectErrorMessage);
  const chapter = useAppSelector(selectChapter);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const dontMatchId =
      story && chapters && chapters[0] && chapters[0].storyId !== story.id;
    const dontHaveChapters = !chapters || chapters.length === 0;
    if (story && (dontMatchId || dontHaveChapters)) {
      dispatch(
        fetchChaptersAsync({ storyId: story.id, page: 0, limit: 99999999 }),
      );
    }
  }, [chapters, dispatch, story]);

  const [showChapters, setShowChapters] = useState<
    (GetChapterDto & { bestMatch?: boolean })[]
  >([...chapters]);

  useEffect(() => {
    setShowChapters(chapters);
  }, [chapters]);

  const handleSearch = useDebouncedCallback(
    (value: string, originalChapters: GetChapterDto[], isDesc: boolean) => {
      const sort = (chapter1: GetChapterDto, chapter2: GetChapterDto) => {
        return isDesc
          ? chapter2.chapterNo - chapter1.chapterNo
          : chapter1.chapterNo - chapter2.chapterNo;
      };

      value = value && value.trim().toLowerCase();
      if (!value) {
        setShowChapters([...originalChapters].sort(sort));
      }

      const equalChapterNos: (GetChapterDto & {bestMatch?: boolean})[] = [];
      const containsChapterNos: GetChapterDto[] = [];
      const containsChapterTitles: GetChapterDto[] = [];
      for (const chapter of originalChapters) {
        const chapterNo = `${chapter.chapterNo}`;
        if (chapterNo === value) {
          equalChapterNos.push({ ...chapter, bestMatch: true });
        } else if (chapterNo.includes(value)) {
          containsChapterNos.push(chapter);
        } else if (
          chapter.title &&
          chapter.title.toLowerCase().includes(value)
        ) {
          containsChapterTitles.push(chapter);
        }
      }
      const result = [
        ...equalChapterNos.sort(sort),
        ...containsChapterNos.sort(sort),
        ...containsChapterTitles.sort(sort),
      ];
      setShowChapters(result);
    },
    300,
  );

  const handleTyping = useCallback(
    (value) => {
      handleSearch(value, chapters, isDesc);
    },
    [handleSearch, chapters, isDesc],
  );

  const handleSortClick = useCallback(() => {
    setDesc((prev) => !prev);
  }, []);

  useEffect(() => {
    const element = document.getElementById(
      "search-text-box",
    ) as HTMLInputElement;
    if (element) {
      handleSearch(element.value, chapters, isDesc);
    }
  }, [isDesc, chapters, handleSearch]);

  return (
    <Modal
      className="chapter-list-modal-container"
      full
      show={show}
      onHide={onClose}
    >
      <Modal.Header
        closeButton={false}
        style={{ paddingRight: 0, display: "flex" }}
      >
        <InputGroup>
          <InputGroup.Button onClick={handleSortClick}>
            <Icon icon={isDesc ? "sort-numeric-desc" : "sort-numeric-asc"} />
          </InputGroup.Button>
          <Input
            id="search-text-box"
            placeholder="Search chapter number"
            onChange={handleTyping}
          />
        </InputGroup>
        <div style={{ padding: "8px 0 8px 15px" }} onClick={onClose}>
          <Icon icon="close" />
        </div>
      </Modal.Header>
      <Modal.Body>
        {status === "processing" && <Loader center />}
        {status === "success" && chapters && (
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => (
              <FixedSizeList
                innerElementType={(listProps) => (
                  <List {...listProps} hover size="sm" />
                )}
                layout="vertical"
                height={height}
                itemCount={showChapters.length}
                itemData={showChapters}
                itemSize={53}
                width={width}
                itemKey={(index, data) => data[index].id}
              >
                {(
                  itemProps: ListChildComponentProps<
                    (GetChapterDto & { bestMatch?: boolean })[]
                  >,
                ) => {
                  const data = itemProps.data[itemProps.index];
                  const sub = data.title
                    ? `${data.title} | ${moment(data.updated).fromNow()}`
                    : moment(data.updated).fromNow();
                  return (
                    data && (
                      <List.Item style={itemProps.style}>
                        <div>
                          <div
                            className={classNames({
                              "chapter-title--current":
                                chapter && chapter.id === data.id,
                            })}
                          >
                            <FormattedMessage
                              id="chapterTitle"
                              values={{ chapterNo: data.chapterNo }}
                            />
                            {data.bestMatch && <Icon icon="star" className="best-match"/>}
                          </div>
                          <div className="chapter-sub" title={sub}>
                            {sub}
                          </div>
                        </div>
                        <Icon icon="right" />
                      </List.Item>
                    )
                  );
                }}
              </FixedSizeList>
            )}
          </AutoSizer>
        )}
        {status === "error" && (
          <Message type="error" description={errorMessage} />
        )}
      </Modal.Body>
    </Modal>
  );
}
