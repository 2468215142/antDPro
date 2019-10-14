import { Component } from 'react';
import { Table, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
// import { userMap } from "./const";

import styles from './style.less';
import { formTime } from '@/utils/formTime';

import UpdateContaienr from './components/updateForm';

@connect(({ loading, userManage }) => ({
  userList: userManage.userList,
  showUpdate: userManage.showUpdate,
  loading: !!loading.effects['userManage/getUserList'] || !!loading.effects['userManage/deleteUser'],
}))

class UserManage extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/getUserList',
      payload: {},
    });
  }

  deleteUser = item => {
    const { dispatch } = this.props;
    const data = {
      _id: item._id,
    };
    dispatch(
      {
        type: 'userManage/deleteUser',
        payload: { data },
      },
)
  };

  updateUser = item => {
    const data = { ...item };
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/showUpdate',
      payload: {
        data,
      },
    });
  };

  cancelUpdate = () => {
      this.props.dispatch({
        type: 'userManage/hideUpdate',
      });
  }

  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: recoder => <span>{formTime(recoder, 'YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: recoder => <span>{formTime(recoder, 'YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (recoder, item) => (
          <div key={item._id}>
            <Button
              onClick={() => {
                this.deleteUser(item);
              }}
            >
              删除
            </Button>
            <Button
              onClick={() => {
                this.updateUser(item);
              }}
            >
              更新
            </Button>
          </div>
        ),
      },
    ];
    const { userList, loading, showUpdate } = this.props;
    return (
      <PageHeaderWrapper>
        <div className={styles.main}>
          <Table
            rowKey={(item, index) => index}
            bordered
            dataSource={userList}
            columns={columns}
            loading={loading}
          />
        </div>
        <Modal
          title="跟新用户信息"
          visible={showUpdate}
          onCancel={this.cancelUpdate}
          footer={null}
        >
          <UpdateContaienr />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default UserManage;
