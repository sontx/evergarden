import React, { ElementType, ReactNode, useCallback, useState } from "react";
import { Icon, IconButton, Input, InputGroup } from "rsuite";

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
        <IconButton
          onClick={toggleSort}
          icon={<Icon icon={sort === "new" ? "creative" : "clock-o"} />}
        />
        <InputGroup className="filter-input" inside>
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
