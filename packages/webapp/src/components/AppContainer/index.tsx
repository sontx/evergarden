import { ReactNode } from "react";
import { Container } from "rsuite";

export function AppContainer(props: { children: ReactNode }) {
  return <Container style={{ minHeight: "100vh" }}>{props.children}</Container>;
}
