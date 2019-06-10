import * as React from "react";
import IconButton from "./IconButton";

interface Props {
  textCancel: string;
  onAction?: () => void;
}

class ButtonWithConfirmation extends React.Component<Props> {
  readonly state = {
    confirming: false,
  };

  static defaultProps = {
    textCancel: "Cancel",
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

  render() {
    const { textCancel, children } = this.props;
    return (
      <React.Fragment>
        {this.state.confirming && (
          <IconButton withText type="button" onClick={this.onCancelClick}>
            {textCancel}
          </IconButton>
        )}
        <IconButton withText type="button" onClick={this.onClick}>
          {children}
        </IconButton>
      </React.Fragment>
    );
  }
}

export default ButtonWithConfirmation;
