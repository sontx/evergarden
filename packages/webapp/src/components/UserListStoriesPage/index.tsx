import React, { ElementType, useCallback, useState } from "react";
import { ButtonGroup, Icon, IconButton, Input, InputGroup } from "rsuite";

import "./index.less";
import { UserPage } from "../UserPage";

export type SortType = "none" | "new" | "recent" | "a-z" | "z-a";
export interface UserListItemsChildrenProps {
  filter?: string;
  sort?: SortType;
}

export function UserListStoriesPage({
  children: Children,
  title,
}: {
  children: ElementType<UserListItemsChildrenProps>;
  title: string;
}) {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<SortType>("none");

  const handleClearFilter = useCallback(() => {
    setFilter("");
  }, []);

  return (
    <UserPage title={title}>
      <div className="user-list-stories-page-toolbar">
        <ButtonGroup>
          <IconButton
            appearance={sort === "new" ? "primary" : "default"}
            onClick={() => setSort("new")}
            size="sm"
            icon={<Icon icon="creative" />}
          />
          <IconButton
            appearance={sort === "recent" ? "primary" : "default"}
            onClick={() => setSort("recent")}
            size="sm"
            icon={<Icon icon="clock-o" />}
          />
          <IconButton
            appearance={sort === "a-z" ? "primary" : "default"}
            onClick={() => setSort("a-z")}
            size="sm"
            icon={<Icon icon="sort-alpha-asc" />}
          />
          <IconButton
            appearance={sort === "z-a" ? "primary" : "default"}
            onClick={() => setSort("z-a")}
            size="sm"
            icon={<Icon icon="sort-alpha-desc" />}
          />
        </ButtonGroup>
        <InputGroup className="filter-input" inside size="sm">
          <Input
            value={filter}
            onChange={setFilter}
            placeholder="Filter story..."
          />
          {filter ? (
            <InputGroup.Button onClick={handleClearFilter}>
              <Icon icon="close" style={{ color: "red" }} />
            </InputGroup.Button>
          ) : (
            <InputGroup.Addon>
              <Icon icon="filter" />
            </InputGroup.Addon>
          )}
        </InputGroup>
      </div>
      <Children filter={filter} sort={sort} />
    </UserPage>
  );
}
