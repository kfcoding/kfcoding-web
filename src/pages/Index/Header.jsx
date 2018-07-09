import React from 'react';
import { Layout, Button, Menu, Icon, Dropdown, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { currentUser, getUser } from "../../services/users";
import { openWindow } from "../../utils/openWindow";

const { Header } = Layout;

const createMenu = (
  <Menu>
    <Menu.Item>
      <Link to='/books/create'><Icon type="plus" />创建新功夫</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to='/home/workspaces/create'><Icon type="plus"/>创建Workspace</Link>
    </Menu.Item>
  </Menu>
)

@inject('store')
@observer
class MyHeader extends React.Component {
    login = () => {
    openWindow(
      'https://github.com/login/oauth/authorize?client_id=1eb243e826a117b3e138&',
      '登录',
      600,
      600
    );
    window.addEventListener('message', (m) => {
      localStorage.setItem('token', m.data.token);
      currentUser().then(res => {
        console.log(res)
        localStorage.setItem('uid', res.data.result.user.id);
        localStorage.setItem('user', JSON.stringify(res.data.result.user));
        window.location.replace('/home');

      });
    })
  }
  render() {
    return (
      <Header className='header ant-layout-indexHeader' style={this.props.style}>
        {this.props.children}
        <span style={{color: '#fff', fontSize: '24px'}}>
          <a href="/index" style={{color: '#fff'}}><img src="//static.cloudwarehub.com/logo-min.png?x-oss-process=style/logo" style={{width: '80px'}}/> 功夫编程</a>
        </span>
        {this.props.store.currentUser.id == '' ?
          <span style={{float: 'right'}}>
            <Button type='primary' icon='github' size='large' onClick={this.login}>Github登录</Button>
          </span>
          :
          <span style={{float: 'right'}}>

            <Dropdown overlay={createMenu} style={{float: 'right'}}>
              <Icon className='create-btn' type="plus-circle" style={{fontSize: 24, color: 'white', marginTop: '20px', marginRight: 30}}/>
            </Dropdown>
            {/*<Dropdown overlay={menu}>*/}
            <div style={{float: 'right'}}>
              <Link to='/home'>
                <Avatar src={this.props.store.currentUser.avatarUrl || '//static.cloudwarehub.com/logo-min.png?x-oss-process=style/logo'}></Avatar>
                <span style={{color: '#fff', padding: '0 15px'}}>{this.props.store.currentUser.name}</span>
                {/*<Icon type="down" style={{color: '#fff'}}/>*/}
              </Link>
            </div>
            {/*</Dropdown>*/}

          </span>
        }

      </Header>
    )
  }
}

export default MyHeader;
