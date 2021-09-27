import { toInt, PaginationResult } from "@evergarden/shared";

export class Pageable {
  static from(page: any, skip: any, limit: any) {
    return new Pageable(toInt(page), toInt(skip), toInt(limit));
  }

  get skip() {
    const value = isFinite(this.rawSkip) ? this.rawSkip : this.page * this.limit;
    return Math.max(isFinite(value) ? value : 0, 0);
  }

  get needPaging() {
    return this.rawPage !== undefined;
  }

  get page() {
    return this.rawPage !== undefined ? Math.max(this.rawPage, 0) : 0;
  }

  get limit() {
    return Math.min(Math.max(this.rawLimit, 1), 100);
  }

  constructor(
    private readonly rawPage: number | undefined,
    private readonly rawSkip: number | undefined,
    private readonly rawLimit: number,
  ) {}

  toPaginationResult<TInput, TOutput>(
    result: [TInput[], number],
    mapFn: (raw: TInput) => TOutput,
  ): PaginationResult<TOutput> {
    return {
      items: result[0].map(mapFn),
      meta: {
        currentPage: this.page,
        itemsPerPage: this.limit,
        totalItems: result[1],
        itemCount: result[0].length,
        totalPages: Math.ceil(result[1] / this.limit),
      },
    };
  }
}
