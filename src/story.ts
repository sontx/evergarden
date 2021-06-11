export interface Story {
  title: string;
  thumbnail: string;
  description: string;
  authors: string;
  genres: string;
  status: string;
  chapters: Chapter[];
  url?: string;
}

export interface Chapter {
  fullTitle: string;
  url: string;
  content: string;
}

export interface Link {
  link: string;
  title: string;
}
