import React from 'react';
import { Layout, Dropdown, Avatar, Icon, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import './style.css';
import HeaderRight from "./HeaderRight";

const {Header} = Layout;

const menu = (
  <Menu>
    <Menu.Item>
      <Link to='/home/workspaces'><Icon type="desktop"/> Workspace</Link>
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
  constructor() {
    super()
  }

  render() {
    return (
      <Header className='header' style={this.props.style}>
        <div className='logo' style={{color: '#fff', fontSize: '24px', marginRight: '30px', float: 'left'}}>
          {this.props.children}
          <Link to="/" style={{color: '#fff'}}><img
            src="//static.cloudwarehub.com/logo-min.png?x-oss-process=style/logo" style={{width: '80px'}}/> 功夫编程</Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['']}
          style={{lineHeight: '64px', float: 'left'}}
        >
          <Menu.Item key="1"><Link to='/library'>功夫图书馆</Link></Menu.Item>
        </Menu>
        <HeaderRight/>

      </Header>
    )
  }
}

export default MyHeader;