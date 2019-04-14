import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import cuid from "cuid";

import { RootStore } from "../Store";
import ROUTES from "../utils/ROUTES";
import { bindActionCreators, Dispatch } from "redux";
import { RootAction } from "../utils/ACTIONS";
import { connect } from "react-redux";
import CONSTS from "../utils/consts";
import { ENTITY_TYPES } from "../strings/strings";
import { postEntity, clearPostRequest } from "../features/postEntity";
import { Status, EntityForUpload } from "../utils/types";

const Content = styled.div`
  display: block;
  border: grey 1px dotted;
  padding: 12px;
`;

const Label = styled.label`
  display: block;
`;

type OwnProps = {
  add: boolean;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

const editorId = cuid.slug();

const mapStateToProps = (state: RootStore, props: OwnProps) => {
  const add = props.add;
  // Get the POST request state from the Redux Store
  const data = state.requests.data[editorId];
  const status = state.requests.status[editorId];
  const error = state.requests.errors[editorId];

  return {
    data,
    add,
    editorId,
    status,
    error
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      postEntity,
      clearPostRequest
    },
    dispatch
  );

type State = {
  name: string;
  type: number;
  linkWikipedia?: string;
  linkCrunchbase?: string;
  linkTwitter?: string;
  linkFacebook?: string;
  linkYoutube?: string;
  linkWebsite?: string;
};

class RelationsScreen extends React.Component<Props> {
  readonly state: State = {
    name: "",
    type: CONSTS.ENTITY_TYPES.PHYSICAL_PERSON,
    linkWikipedia: "",
    linkCrunchbase: "",
    linkTwitter: "",
    linkFacebook: "",
    linkYoutube: "",
    linkWebsite: ""
  };

  onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ type: +event.target.value });
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!this.state.name || this.state.name.length < 3) return;

    const entity: EntityForUpload = {
      name: this.state.name,
      type: this.state.type
    };
    this.props.postEntity(entity, this.props.editorId);
  };

  clearPostRequest = (_event: React.MouseEvent<HTMLAnchorElement>) => {
    this.props.clearPostRequest(this.props.editorId);
  };

  onCancelClick = () => {
    this.props.history.goBack();
  };

  render() {
    const { status, error } = this.props;

    // Render loading status and error.
    if (status === Status.Ok)
      return (
        <Content>
          <p>Saved!</p>
          <Link
            onClick={this.clearPostRequest}
            to={`/${ROUTES.entity}/${this.props.data._key}`}
          >
            Ok
          </Link>
        </Content>
      );

    return (
      <Content>
        <form onSubmit={this.onSubmit}>
          <div>
            <Label>
              Name
              <input
                type="text"
                maxLength={200}
                value={this.state.name}
                onChange={this.onNameChange}
              />
            </Label>
            <select value={this.state.type} onChange={this.onTypeChange}>
              {Object.keys(CONSTS.ENTITY_TYPES).map(key => (
                <option key={key} value={CONSTS.ENTITY_TYPES[key]}>
                  {ENTITY_TYPES[key]}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Save</button>
          {status === Status.Requested ? <p>Saving...</p> : null}
          {status === Status.Error ? <p>Error: {error.eMessage}</p> : null}
        </form>
      </Content>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RelationsScreen)
);
