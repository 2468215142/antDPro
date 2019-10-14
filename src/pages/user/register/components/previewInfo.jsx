import { Component } from 'react';
import { connect } from 'dva';
import { Descriptions, Form, Button, message } from 'antd';
import { setFormVerticalLayout } from '@/utils/formLayout';
import { registerInfoMap } from './const';

const { formItemLayout, tailFormItemLayout } = setFormVerticalLayout(8, 8, 8, 8, 8);

@connect(({ register, loading }) => ({
  register,
  loading: loading.effects['register/registSubmit'],
}))
class PreviewInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerInfoList: [],
    };
  }

  componentDidMount() {
    // const data = this.props.register.registerInfo;
    const { registerInfo } = this.props.register;
    const registerInfoList = [];
    Object.keys(registerInfo).forEach(item => {
      const i = {
        label: registerInfoMap[item],
        value: registerInfo[item],
      };
      registerInfoList.push(i);
    });
    this.setState({
      registerInfoList,
    });
  }

  registSubmit = () => {
    // 提交信息，进入到下一步;
    const { registerInfo } = this.props.register;
    this.props.dispatch({
      type: 'register/registSubmit',
      payload: {
        data: registerInfo,
      },
    });
  };

  review = () => {
    const { registerStep } = this.props.register;
    this.props.dispatch({
      type: 'register/updateSteps',
      payload: {
        registerStep: registerStep - 1,
      },
    });
  };

  render() {
    const { registerInfoList } = this.state;
    const { loading } = this.props;
    return (
      <div>
        <Descriptions title="预览信息">
          {registerInfoList.map((item, index) => (
            <Descriptions.Item label={item.label} key={index}>
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <Form>
          <Form.Item {...tailFormItemLayout}>
            <Button disabled={loading} onClick={() => this.review()}>
              修改
            </Button>
            &nbsp;
            <Button
              type="primary"
              disabled={loading}
              loading={loading}
              onClick={() => this.registSubmit()}
            >
              确认
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default PreviewInfo;
