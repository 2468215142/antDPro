import { Component } from 'react';
import { Row } from 'antd';

export class Rows extends Component {
  render() {
    return (
      <>
        <Row {...this.props}></Row>
      </>
    );
  }
}
