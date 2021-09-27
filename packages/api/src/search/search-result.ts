export interface SearchResult<T> {
  hits: {
    total: number;
    hits: Array<{
      _source: T;
    }>;
  };
}
