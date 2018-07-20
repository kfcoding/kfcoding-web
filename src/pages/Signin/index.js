import React from 'react';
import { Layout, Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import MyHeader from "components/Header";
import MyFooter from "components/Footer";
import pic from '../../assets/pic.png';
import { emailSignin, currentUser } from "../../services/users";
import { openWindow } from "../../utils/openWindow";
import md5 from 'md5';

const FormItem = Form.Item;
const {Content, Sider} = Layout;

const BasicForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      email: Form.createFormField({
        ...props.email,
        value: props.email.value,
      }),
      password: Form.createFormField({
        ...props.password,
        value: props.password.value,
      })
    };
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})((props) => {
    const {getFieldDecorator} = props.form;
    return (
      <Form className="login-form">
        <FormItem label='邮箱'>
          {getFieldDecorator('email', {
            rules: [{required: true, message: 'Please input your email address!'}],
          })(
            <Input prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Email"/>
          )}
        </FormItem>
        <FormItem label='密码'>
          {getFieldDecorator('password', {
            rules: [{required: true, message: 'Please input your Password!'}],
          })(
            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                   placeholder="Password"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住密码</Checkbox>
          )}
          {/*<span style={{float: 'right'}}>*/}
            {/*<a className="login-form-forgot" href="">忘记密码</a>*/}
          {/*</span>*/}
        </FormItem>
      </Form>
    );
  }
);

@inject('store')
@observer
class WrappedSignin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        email: {value: ''},
        password: {value: ''}
      }
    };
  }

  handleSubmit = () => {
    let data = {
      credenceName: this.state.fields.email.value,
      credenceCode: md5(this.state.fields.password.value),
      authType: 'password'
    };

    this.props.store.signIn(data, (data) => {
      if (data.err) {
        message.error('账号或者密码错误');
      } else {
        this.props.history.push('/home')
      }
    });
  }

  handleFormChange = (changedFields) => {
    this.setState(({fields}) => ({
      fields: {...fields, ...changedFields},
    }));
  }

  thirdPartyLogin = () => {
    openWindow(
      'https://github.com/login/oauth/authorize?client_id=1eb243e826a117b3e138&',
      '登录',
      600,
      600
    );
    var listen = (m) => {console.log(m);
      if (m.date.token) {
        localStorage.setItem('token', m.data.token);
      }
      //this.props.store.loadCurrentUser();
      this.props.history.push('/home');
      window.removeEventListener('message', listen);
    }
    window.addEventListener('message', listen)
  }

  render() {
    return (
      <Layout>
        <MyHeader/>
        <Content style={{padding: '50px'}}>
          <Layout style={{padding: '24px 0', background: '#fff'}}>
            <Sider width={400} style={{background: '#fff', paddingLeft: '20px'}}>
              <div className="img-wrapper" key="image">
                <img style={{width: '100%', height: '100%'}} src={pic}/>
              </div>
            </Sider>
            <Content>
              <div style={{background: '#fff', padding: 24, paddingRight: 300, minHeight: 280, overflow: 'auto'}}>
                <BasicForm {...this.state.fields} onChange={this.handleFormChange}/>
                <FormItem>
                  <Button type="primary" onClick={this.handleSubmit} className="login-form-button">
                    登录
                  </Button>
                  <span style={{marginLeft: 40}}>
                      <Link to="/signup">还没账号，马上注册！</Link>
                    </span>

                  <span style={{float: 'right'}}>
                    其他登录方式：<Icon onClick={this.thirdPartyLogin} type='github' style={{fontSize: 24, cursor: 'pointer'}}/>
                  </span>
                </FormItem>
              </div>
            </Content>
          </Layout>
        </Content>
        <MyFooter/>
      </Layout>
    );
  }
}

WrappedSignin.propTypes = {
  // store: PropTypes.object.isRequired
}

export default withRouter(WrappedSignin);
