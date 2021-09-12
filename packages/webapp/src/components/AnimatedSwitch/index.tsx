import React, { ElementType } from "react";
import { Route, Switch } from "react-router-dom";
import { Position, Slider } from "./Slider";

class SlideOut extends React.Component<any, any> {
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
      this.setState({
        childPosition: Position.TO_LEFT,
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
      childPosition: Position.FROM_RIGHT,
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
