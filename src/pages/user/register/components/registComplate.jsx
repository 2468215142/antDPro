import { Component } from 'react';
import Link from 'umi/link';
import { Result, Button } from 'antd';

class RegistComplate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Result
          status="success"
          title="注册成功!"
          subTitle="let'us have fun"
          extra={
            <Button type="link" block href="/user/login">
              注册成功，前去登陆
            </Button>
          }
        />
      </div>
    );
  }
}

export default RegistComplate;
