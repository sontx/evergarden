import {
  BACK_DIRECTION,
  Direction,
  DirectionHandler,
  NEXT_DIRECTION,
} from "./direction-handler";
import { RouteConfig, routes } from "../../../routes";
import { matchPath } from "react-router-dom";

function isMatch(pathname: string, config: RouteConfig) {
  const match = matchPath(pathname, {
    exact: config.exact,
    path: config.path,
  });
  return !!match;
}

export class GeneralPagesHandler implements DirectionHandler {
  handle(prev: string, next: string): Direction | false | "cancel" {
    const prevConfig = routes.find((route) => isMatch(prev, route));
    const nextConfig = routes.find((route) => isMatch(next, route));

    if (prevConfig && nextConfig) {
      if (nextConfig.level < 0) {
        return "cancel";
      }
      return prevConfig.level > nextConfig.level
        ? BACK_DIRECTION
        : NEXT_DIRECTION;
    }
    return false;
  }
}
