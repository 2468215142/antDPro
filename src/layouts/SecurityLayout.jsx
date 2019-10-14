import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import PageLoading from '@/components/PageLoading';

@connect(({ user }) => ({
  user: user.currentUser,
}))
class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;

    if ((!currentUser._id && loading) || !isReady) {
      return <PageLoading />;
    }
    // if (!currentUser._id) {
    //   return <Redirect to="/user/login"></Redirect>;
    // }
    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
