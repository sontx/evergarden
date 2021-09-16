import React, { ElementType } from "react";
import { Route, Switch } from "react-router-dom";
import { Position, Slider } from "./Slider";
import {
  DEFAULT_DIRECTION,
  Direction,
  DirectionHandler,
} from "./direction/direction-handler";
import { ChapterToChapterHandler } from "./direction/chapter-to-chapter.handler";
import { GeneralPagesHandler } from "./direction/general-pages.handler";

class SlideOut extends React.Component<any, any> {
  private static direction: Direction = DEFAULT_DIRECTION;
  private static handlers: DirectionHandler[] = [
    new ChapterToChapterHandler(),
    new GeneralPagesHandler(),
  ];

  constructor(props: any) {
    super(props);

    this.state = {
      childPosition: Position.CENTER,
      curChild: props.children,
      curUniqId: props.uniqId,
      prevChild: null,
      prevUniqId: null,
      animationCallback: null,
    };
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const prevUniqId = prevProps.uniqKey || prevProps.children.type;
    const uniqId = this.props.uniqKey || (this.props.children as any)?.type;
    if (prevUniqId !== uniqId) {
      for (const handler of SlideOut.handlers) {
        const direction = handler.handle(prevUniqId, uniqId);
        if (direction) {
          if (direction === "cancel") {
            this.setState({
              childPosition: SlideOut.direction.from,
              curChild: this.props.children,
              curUniqId: uniqId,
              prevChild: null,
              prevUniqId: null,
              animationCallback: null,
            });
            return;
          }
          SlideOut.direction = direction;
          break;
        }
      }

      this.setState({
        childPosition: SlideOut.direction.to,
        curChild: this.props.children,
        curUniqId: uniqId,
        prevChild: prevProps.children,
        prevUniqId,
        animationCallback: this.swapChildren,
      });
    }
  }

  swapChildren = () => {
    this.setState({
      childPosition: SlideOut.direction.from,
      prevChild: null,
      prevUniqId: null,
      animationCallback: null,
    });
  };

  render() {
    return (
      <Slider
        position={this.state.childPosition}
        animationCallback={this.state.animationCallback}
      >
        {this.state.prevChild || this.state.curChild}
      </Slider>
    );
  }
}

const animateSwitch = (
  CustomSwitch: ElementType,
  AnimatorComponent: ElementType,
) => ({ updateStep, children }: any) => (
  <Route
    render={({ location }) => (
      <AnimatorComponent uniqKey={location.pathname} updateStep={updateStep}>
        <CustomSwitch location={location}>{children}</CustomSwitch>
      </AnimatorComponent>
    )}
  />
);

export const AnimatedSwitch = animateSwitch(Switch, SlideOut);
