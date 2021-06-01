import React, { ElementType, useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { AppContainer } from "../AppContainer";
import { SEO } from "../SEO";
import { AppHeader } from "../AppHeader";
import {
  ButtonGroup,
  Content,
  Icon,
  IconButton,
  Input,
  InputGroup,
} from "rsuite";
import { AppFooter } from "../AppFooter";

import "./index.less";

export type SortType = "none" | "new" | "recent" | "a-z" | "z-a";
export interface UserListItemsChildrenProps {
  filter?: string;
  sort?: SortType;
}

export function UserListItemsPage({
  children: Children,
  title,
}: {
  children: ElementType<UserListItemsChildrenProps>;
  title: string;
}) {
  const intl = useIntl();
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<SortType>("none");

  const handleClearFilter = useCallback(() => {
    setFilter("");
  }, []);

  return (
    <AppContainer>
      <SEO title={intl.formatMessage({ id: "pageTitleHome" })} />
      <AppHeader />
      <Content style={{ padding: "10px" }}>
        <h5 className="user-list-items-page-title">{title}</h5>
        <div className="user-list-items-page-toolbar">
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
              <InputGroup.Button>
                <Icon icon="filter" />
              </InputGroup.Button>
            )}
          </InputGroup>
        </div>
        <Children filter={filter} sort={sort} />
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
