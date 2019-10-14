import { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { connect } from 'dva';

import styles from './style.less';
import Visualization from './components/visualization';

@connect(() => ({}))
class MusicVisualization extends Component {
  render() {
    return (
      <PageHeaderWrapper>
        <div className={styles.main}>MusicVisualization</div>
        <Visualization />
      </PageHeaderWrapper>
    );
  }
}

export default MusicVisualization;
