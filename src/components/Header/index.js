import React from 'react';
import { Layout, Dropdown, Avatar, Icon, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import styled, {css} from 'styled-components';
import './style.css';
import HeaderRight from "./HeaderRight";

const {Header} = Layout;

const Container = styled.div`
  ${props => props.narrow && css`
    width: 1000px;
    margin: 0 auto;
  `}
`;

@inject('store')
@observer
class MyHeader extends React.Component {
  constructor() {
    super()
  }

  render() {
    const {narrow} = this.props;
    return (
      <Header className='header' style={this.props.style}>
        <Container narrow={narrow}>
          <div className='logo' style={{color: '#fff', fontSize: '24px', marginRight: '30px', float: 'left'}}>
            {this.props.children}
            <Link to="/" style={{color: '#fff'}}><img
              src="//static.cloudwarehub.com/logo-min.png?x-oss-process=style/logo"
              style={{width: '80px'}}/> 功夫编程</Link>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['']}
            style={{lineHeight: '64px', float: 'left'}}
          >
            <Menu.Item key="1"><Link to='/library'>功夫图书馆</Link></Menu.Item>
            <Menu.Item key="2"><Link to='/courses'>高校版</Link></Menu.Item>
          </Menu>
          <HeaderRight/>
        </Container>
      </Header>
    )
  }
}

export default MyHeader;