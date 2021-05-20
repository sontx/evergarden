import { ReactNode } from "react";
import { Container } from "rsuite";
import {StandardProps} from "rsuite/es/@types/common";

export function AppContainer(props: { children: ReactNode } & StandardProps) {
  const {children, ...rest} = props;
  return <Container style={{ minHeight: "100vh" }} {...rest}>{props.children}</Container>;
}
