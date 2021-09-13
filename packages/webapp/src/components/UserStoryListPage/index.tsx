import React, { ElementType, ReactNode, useCallback, useState } from "react";
import { Icon, Input, InputGroup } from "rsuite";

import { UserPage } from "../UserPage";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";

export type SortType = "new" | "recent";

export interface UserListItemsChildrenProps {
  filter?: string;
  sort?: SortType;
}

export function UserStoryListPage({
  children: Children,
  title,
  action,
  className,
  ...rest
}: {
  children: ElementType<UserListItemsChildrenProps>;
  title: string;
  action?: ReactNode;
} & StandardProps) {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<SortType>("new");

  const handleClearFilter = useCallback(() => {
    setFilter("");
  }, []);

  const toggleSort = useCallback(() => {
    setSort((prev) => (prev === "recent" ? "new" : "recent"));
  }, []);

  return (
    <UserPage
      title={title}
      action={action}
      showBackTop
      className={classNames("user-story-list-page", className)}
      {...rest}
    >
      <div className="toolbar">
        <InputGroup className="filter-input">
          <InputGroup.Button onClick={toggleSort}>
            <Icon icon={sort === "new" ? "creative" : "clock-o"} />
          </InputGroup.Button>
          <Input
            value={filter}
            onChange={setFilter}
            placeholder="Filter story..."
          />
          {filter && (
            <InputGroup.Button
              className="clear-button"
              onClick={handleClearFilter}
            >
              <Icon icon="close" style={{ color: "red" }} />
            </InputGroup.Button>
          )}
        </InputGroup>
      </div>
      <Children filter={filter} sort={sort} />
    </UserPage>
  );
}
