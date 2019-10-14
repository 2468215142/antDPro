import { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

import styles from './style.less';
@connect(({}) => ({}))
class Name extends Component {
  render() {
    return (
      <PageHeaderWrapper>
        <div>Name</div>
      </PageHeaderWrapper>
    );
  }
}

export default Name;
