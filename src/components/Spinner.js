import React from "react";
import { css } from "@emotion/core";
import DotLoader from "react-spinners/DotLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
`;

export default class Spinner extends React.Component {
  /**
   * Constructor to initialize Spinner object
   * @param {object} props 
   */
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  /**
   * Function to render the page again
   */
  render() {
    return (
      <div className="dn-sweet-loading">
        <DotLoader css={override} color={'red'} size={150} loading={this.state.loading} />
        <h2 style={{ 'color': 'white' }}>Please wait for a few seconds...</h2>
      </div>
    );
  }
}