import { Component } from 'react';
import styles from './index.less';

class Footer extends Component {
  render() {
    return (
      <footer>
        <div className={styles.footerContainer}>页脚部分</div>
      </footer>
    );
  }
}

export default Footer;
