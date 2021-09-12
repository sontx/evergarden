import {
  GetReadingHistoryDto,
  UpdateReadingHistoryDto,
} from "@evergarden/shared";

export class LocalReadingHistory {
  private static readonly key = "readingHistory";
  private static readonly max = 50;

  private static cachedData: GetReadingHistoryDto[] | undefined;
  private static timeoutId: number | undefined;

  static get(): GetReadingHistoryDto[] {
    if (!this.cachedData) {
      const history = localStorage.getItem(this.key);
      if (history) {
        const data = JSON.parse(history) as GetReadingHistoryDto[];
        this.cachedData = Array.isArray(data)
          ? data.map((item) => ({
              ...item,
              lastVisit: new Date(item.lastVisit),
              started: new Date(item.started),
            }))
          : [];
      } else {
        this.cachedData = [];
      }
    }
    return this.cachedData;
  }

  static update(updateData: UpdateReadingHistoryDto) {
    const { date = new Date().toISOString(), ...rest } = updateData;
    let history = this.get();
    const foundIndex = history.findIndex(
      (item) => item.storyId === updateData.storyId,
    );

    if (foundIndex >= 0) {
      history[foundIndex] = {
        ...history[foundIndex],
        ...rest,
        lastVisit: new Date(date),
      };
    } else {
      history = this.limitHistory(history);
      const maxId =
        history.length > 0
          ? history.reduce((previousValue, currentValue) =>
              previousValue.id < currentValue.id ? currentValue : previousValue,
            )?.id
          : undefined;
      history.push({
        id: maxId !== undefined ? maxId + 1 : 0,
        storyId: rest.storyId,
        currentChapterNo: rest.currentChapterNo || 0,
        vote: rest.vote || "none",
        isFollowing: rest.isFollowing || false,
        currentReadingPosition: rest.currentReadingPosition || 0,
        lastVisit: new Date(date),
        started: new Date(date),
      });
    }

    if (this.timeoutId !== undefined) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => {
      this.doUpdate(history);
    }, 1000);

    return history;
  }

  private static limitHistory(
    history: GetReadingHistoryDto[],
  ): GetReadingHistoryDto[] {
    if (history.length >= this.max) {
      // @ts-ignore
      const sorted = history.sort((a, b) => a.lastVisit - b.lastVisit);
      sorted.splice(0, sorted.length - this.max);
      return sorted;
    }
    return history;
  }

  private static doUpdate(history: GetReadingHistoryDto[]) {
    localStorage.setItem(this.key, JSON.stringify(history || []));
  }
}
