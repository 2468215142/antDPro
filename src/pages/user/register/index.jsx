import { Component } from 'react';
import { connect } from 'dva';
// antd
import { Steps } from 'antd';
// 引入自定义工具
import { formLayout } from '@/utils/layoutFrom';
import { Rows, Cols } from '@/components/Grid/index';
import RegisterForm from './components/registerForm';
import PreviewInfo from './components/previewInfo';
import RegistComplate from './components/registComplate';

// 样式
import styles from './style.less';

const { Step } = Steps;
const steps = [
  {
    title: '基本信息',
    component: <RegisterForm />,
  },
  {
    title: '确认信息',
    component: <PreviewInfo />,
  },
  {
    title: '完成',
    component: <RegistComplate />,
  },
];

@connect(({ register }) => ({
  userRegister: register,
  registSteps: register.registerStep,
}))
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.dispatch({
      type: 'register/updateSteps',
      payload: {
        registerStep: 0,
      },
    });
  }

  render() {
    const { registSteps } = this.props;
    const step = registSteps >= steps.length ? steps.length - 1 : registSteps;
    return (
      <div className={styles.main}>
        <Rows className={styles.registContainer} type="flex" align="middle" justify="center">
          <Cols grid={formLayout(20, 18, 16, 14, 12, 10)}>
            <div>
              <Steps current={step}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title}></Step>
                ))}
              </Steps>
              <div className={styles.stepsContent}>{steps[step].component}</div>
            </div>
            <br />
          </Cols>
        </Rows>
      </div>
    );
  }
}

export default Register;
