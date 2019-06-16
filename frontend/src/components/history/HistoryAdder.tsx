import React from "react";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import AddIcon from "@material-ui/icons/MoveToInbox";
import { RootStore } from "../../Store";
import { getDisplayedEntities } from "../../features/displayedEntitiesSelector";
import { selectEntities } from "../../features/entitySelectionActions";
import IconButton from "../buttons/IconButton";
import { connect } from "react-redux";

const mapStateToProps = (state: RootStore) => ({
  displayedEntities: getDisplayedEntities(state),
});
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ selectEntities }, dispatch);
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class HistoryAdder extends React.PureComponent<Props> {
  onAddDisplayedClick = () => {
    const { displayedEntities } = this.props;
    this.props.selectEntities(Object.keys(displayedEntities));
  };

  render() {
    const { displayedEntities } = this.props;
    // Check if we have enough keys for it to be worth it.
    let entityCount = 0;
    for (let _ in displayedEntities) {
      entityCount += 1;
      // No need to go further for now
      if (entityCount > 1) break;
    }
    if (entityCount < 2) {
      return null;
    }

    return (
      <IconButton withText onClick={this.onAddDisplayedClick}>
        <AddIcon />
        Mark all as seen
      </IconButton>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryAdder);
