import { Component } from 'react';
import { Col } from 'antd';

export class Cols extends Component {
  render() {
    const { grid, xs, sm, md, lg, xl, xxl } = this.props;
    const Xs = grid.xs || xs || 24;
    const Sm = grid.sm || sm || 24;
    const Md = grid.md || md || 24;
    const Lg = grid.lg || lg || 24;
    const Xl = grid.xl || xl || 24;
    const Xxl = grid.xxl || xxl || 24;

    return (
      <>
        <Col {...this.props} xs={Xs} sm={Sm} md={Md} lg={Lg} xl={Xl} xxl={Xxl}></Col>
      </>
    );
  }
}
