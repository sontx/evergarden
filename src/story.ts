export interface RawStory {
  title: string;
  thumbnail: string;
  description: string;
  authors: string;
  genres: string;
  status: string;
  chapters: RawChapter[];
  url?: string;
}

export interface RawChapter {
  fullTitle: string;
  url: string;
  content: string;
}

export interface Link {
  link: string;
  title: string;
}
