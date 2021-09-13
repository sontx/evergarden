import React, { ElementType } from "react";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Story } from "./pages/Story";
import { Reading } from "./pages/Reading";
import { Following } from "./pages/Following";
import { History } from "./pages/History";
import { UserStoriesPage } from "./pages/UserStories";
import { StoryEditorPage } from "./pages/StoryEditor";
import { UserChaptersPage } from "./pages/UserChapters";
import { ChapterEditorPage } from "./pages/ChapterEditor";
import { ErrorPage } from "./pages/ErrorPage";

export type RouteConfig = {
  path?: string;
  exact?: boolean;
  Component: ElementType;
  authRequired?: boolean;
  level: number;
};

export const routes: RouteConfig[] = [
  {
    path: "/",
    exact: true,
    Component: Home,
    level: 0,
  },
  {
    path: "/login",
    exact: true,
    Component: Login,
    level: 2,
  },
  {
    path: "/story/:url",
    exact: true,
    Component: Story,
    level: 10,
  },
  {
    path: "/reading/:url/:chapterNo",
    exact: true,
    Component: Reading,
    level: 11,
  },
  {
    path: "/following",
    exact: true,
    Component: Following,
    level: 7,
  },
  {
    path: "/history",
    exact: true,
    Component: History,
    level: 7,
  },
  {
    path: "/user/story",
    exact: true,
    Component: UserStoriesPage,
    authRequired: true,
    level: 7,
  },
  {
    path: "/user/story/new",
    exact: true,
    Component: StoryEditorPage,
    authRequired: true,
    level: 7,
  },
  {
    path: "/user/story/:url",
    exact: true,
    Component: StoryEditorPage,
    authRequired: true,
    level: 7,
  },
  {
    path: "/user/story/:url/chapter",
    exact: true,
    Component: UserChaptersPage,
    authRequired: true,
    level: 8,
  },
  {
    path: "/user/story/:url/chapter/new",
    exact: true,
    Component: ChapterEditorPage,
    authRequired: true,
    level: 9,
  },
  {
    path: "/user/story/:url/chapter/:chapterNo",
    exact: true,
    Component: ChapterEditorPage,
    authRequired: true,
    level: 9,
  },
  {
    Component: () => <ErrorPage code={404} />,
    level: 1,
  },
];
