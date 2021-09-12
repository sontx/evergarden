import React from "react";
import classNames from "classnames";
import { StandardProps } from "rsuite/es/@types/common";

export enum Position {
  CENTER = "CENTER",
  TO_LEFT = "TO_LEFT",
  TO_RIGHT = "TO_RIGHT",
  FROM_LEFT = "FROM_LEFT",
  FROM_RIGHT = "FROM_RIGHT",
}

export class Slider extends React.Component<
  StandardProps,
  { animating: boolean; position: Position; animatePrepare: boolean }
> {
  private node: HTMLElement | null = null;
  private _animationCallback: (() => void) | null = null;
  private _postPrepareTimeout: number | undefined;

  constructor(props: StandardProps) {
    super(props);

    this.state = {
      animating: false,
      position: Position.CENTER,
      animatePrepare: false,
    };

    this.startAnimation = this.startAnimation.bind(this);
    this.postPrepareAnimation = this.postPrepareAnimation.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
  }

  componentDidMount() {
    this.startAnimation(this.props.position, null);
    if (this.node) {
      this.node.addEventListener("transitionend", this.onTransitionEnd);
    }
  }

  componentWillUnmount() {
    if (this.node) {
      this.node.removeEventListener("transitionend", this.onTransitionEnd);
    }
  }

  componentWillReceiveProps(newProps: any) {
    if (newProps.position !== this.props.position) {
      this.startAnimation(newProps.position, newProps.animationCallback);
    }
  }

  startAnimation(position: Position, animationCallback: (() => void) | null) {
    const noAnimate = position === Position.CENTER;
    const animatingOut = [Position.TO_LEFT, Position.TO_RIGHT].includes(
      position,
    );
    const currentlyIn = [
      Position.CENTER,
      Position.FROM_LEFT,
      Position.FROM_RIGHT,
    ].includes(this.state.position);
    if (noAnimate || (currentlyIn && animatingOut)) {
      // in these cases we don't need to prepare our animation at all, we can just
      // run straight into it
      this._animationCallback = animationCallback;
      return this.setState({
        animatePrepare: false,
        position,
      });
    }

    this._animationCallback = this.postPrepareAnimation;
    // in case the transition fails, we also post-prepare after some ms (whichever
    // runs first should cancel the other)
    this._postPrepareTimeout = window.setTimeout(this.postPrepareAnimation, 0);

    this.setState({
      animating: true,
      animatePrepare: true,
      position,
    });
  }

  postPrepareAnimation() {
    clearTimeout(this._postPrepareTimeout);
    this._animationCallback = null;

    this.setState(
      { animatePrepare: false },
      () => (this._animationCallback = this.props.animationCallback),
    );
  }

  onTransitionEnd(e: any) {
    // the Slider transitions the `transform` property. Any other transitions
    // that occur on the element we can just ignore.
    if (e.propertyName !== "transform") return;

    const callback = this._animationCallback;
    // @ts-ignore
    delete this._animationCallback;

    // an animation callback is another animation, so we only set `animating` to
    // `false` when we finish the follow-up animation
    if (callback) {
      setTimeout(callback, 0);
    } else {
      this.setState({ animating: false });
    }
  }

  render() {
    return (
      <div
        ref={(node) => (this.node = node)}
        className={classNames("animatable", {
          to: [Position.TO_LEFT, Position.TO_RIGHT].includes(
            this.state.position,
          ),
          from: [Position.FROM_LEFT, Position.FROM_RIGHT].includes(
            this.state.position,
          ),
          right: [Position.TO_RIGHT, Position.FROM_RIGHT].includes(
            this.state.position,
          ),
          left: [Position.TO_LEFT, Position.FROM_LEFT].includes(
            this.state.position,
          ),
          prepare: this.state.animatePrepare,
        })}
        data-qa-loading={Boolean(
          this.props["data-qa-loading"] || this.state.animating,
        )}
      >
        <div className={this.props.className}>{this.props.children}</div>
      </div>
    );
  }
}
