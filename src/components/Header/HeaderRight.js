import React from 'react';
import { observer, inject } from 'mobx-react';
import { Layout, Dropdown, Avatar, Icon, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';

const menu = (
  <Menu>
    <Menu.Item>
      <Link to='/users/setting'><Icon type="user"/> 个人信息</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to='/home/workspaces'><Icon type="desktop"/> 训练场(Workspace)</Link>
    </Menu.Item>
    <Menu.Divider/>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="//"><Icon type="poweroff"/> 退出</a>
    </Menu.Item>
  </Menu>
);

const createMenu = (
  <Menu>
    <Menu.Item>
      <Link to='/books/create'><Icon type="plus" />创建编程秘籍</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to='/home/workspaces/create'><Icon type="plus"/>创建训练场(Workspace)</Link>
    </Menu.Item>
  </Menu>
)

@inject('store')
@observer
class HeaderRight extends React.Component {
  render() {
    return (
      this.props.store.currentUser.id != '' ?
        <span style={{float: 'right'}}>

            <Dropdown overlay={createMenu} style={{float: 'right'}}>
              <Icon className='create-btn' type="plus-circle"
                    style={{fontSize: 24, color: 'white', marginTop: '20px', marginRight: 30}}/>
            </Dropdown>
              <Dropdown overlay={menu}>
              <div style={{float: 'right'}}>
              <Link to='/home'>
                <Avatar
                  src={this.props.store.currentUser.avatarUrl || '//static.cloudwarehub.com/logo-min.png?x-oss-process=style/logo'}></Avatar>
                <span style={{color: '#fff', padding: '0 15px'}}>{this.props.store.currentUser.name}</span>
                {/*<Icon type="down" style={{color: '#fff'}}/>*/}
              </Link>
            </div>
              </Dropdown>

          </span>
        :
        <span style={{float: 'right'}}>
            <Link to='/signin'><Button type='primary' icon='user' onClick={this.login}>登录／注册</Button></Link>
        </span>

    )
  }
}

export default HeaderRight;