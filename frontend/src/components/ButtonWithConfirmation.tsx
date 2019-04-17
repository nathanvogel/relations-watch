import * as React from "react";
import Button from "./Button";

interface Props {
  textCancel: string;
  onAction?: () => void;
}

class ButtonWithConfirmation extends React.Component<Props> {
  readonly state = {
    confirming: false
  };

  static defaultProps = {
    textCancel: "Cancel"
  };

  onClick = () => {
    if (!this.state.confirming) this.setState({ confirming: true });
    else if (this.props.onAction) {
      this.props.onAction();
      this.setState({ confirming: false });
    }
  };

  onCancelClick = () => {
    this.setState({ confirming: false });
  };

  onConfirm = () => {};

  render() {
    const { textCancel, children } = this.props;
    return (
      <div>
        {this.state.confirming && (
          <React.Fragment>
            <Button onClick={this.onCancelClick}>{textCancel}</Button>{" "}
          </React.Fragment>
        )}
        <Button onClick={this.onClick}>{children}</Button>
      </div>
    );
  }
}

export default ButtonWithConfirmation;
