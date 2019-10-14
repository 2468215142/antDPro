import { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Select,
  Button,
  message,
} from 'antd';
import { setFormVerticalLayout } from '@/utils/formLayout';

const { formItemLayout, tailFormItemLayout } = setFormVerticalLayout(8, 8, 8, 8, 8);
const { Option } = Select;

@connect(({ register }) => ({
  register,
}))
class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      defaultValue: {},
      registerStep: 0,
    };
  }

  componentDidMount() {
    const { defaultValue, registerInfo, registerStep } = this.props.register;
    const value = {
      name: registerInfo.name || defaultValue.name,
      email: registerInfo.email || defaultValue.email,
      password: registerInfo.password || defaultValue.password,
      phone: registerInfo.phone || defaultValue.phone,
    };
    this.setState({
      defaultValue: value,
      registerStep,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        message.error('请检查页面内容是否正确');
        return;
      }
      const { registerStep } = this.state;
      const data = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        prefix: values.prefix,
      };
      // 提交信息，进入到下一步
      this.props.dispatch({
        type: 'register/updateInfo',
        payload: {
          registerStep: registerStep + 1,
          registerInfo: { ...data },
        },
      });
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不相等!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { defaultValue } = this.state;
    const { name, email, password, phone } = defaultValue;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>,
    );

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item
          label={
            <span>
              昵称&nbsp;
              <Tooltip title="想要别人怎么称呼您？">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('name', {
            initialValue: name,
            rules: [{ required: true, message: '请输入昵称！', whitespace: true }],
          })(<Input allowClear />)}
        </Form.Item>
        <Form.Item label="邮箱">
          {getFieldDecorator('email', {
            initialValue: email,
            rules: [
              {
                type: 'email',
                message: '请检查邮箱格式！',
              },
              {
                required: true,
                message: '请输入邮箱！',
              },
            ],
          })(<Input allowClear />)}
        </Form.Item>
        <Form.Item label="密码" hasFeedback>
          {getFieldDecorator('password', {
            initialValue: password,
            rules: [
              {
                required: true,
                message: '请输入密码！',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password allowClear />)}
        </Form.Item>
        <Form.Item label="确认密码" hasFeedback>
          {getFieldDecorator('confirm', {
            initialValue: password,
            rules: [
              {
                required: true,
                message: '请确认密码！',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} allowClear />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('phone', {
            initialValue: phone,
            rules: [{ required: true, message: '请输入手机号！' }],
          })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            下一步
          </Button>
        </Form.Item>
        <Link to="/user/login">已有账户？去登陆</Link>
      </Form>
    );
  }
}
const RegisterContaienr = Form.create({ name: 'register' })(RegisterForm);

export default RegisterContaienr;
