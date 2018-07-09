import React from 'react';
import { Layout, Icon, Button, Divider, Menu, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import Book from "../../components/Book";

const {Content, Sider} = Layout;
const {SubMenu} = Menu;
const confirm = Modal.confirm;

@inject('store')
@observer
class Home extends React.Component {
  componentDidMount() {
    this.props.store.currentUser.bookStore.loadBooks();
  }

  render() {
    let books = this.props.store.currentUser.bookStore.books.map((kf) => {
      return (
        <div key={kf.id} style={{float: 'left', marginRight: '40px', marginBottom: '40px'}}>
          <Link to={`/books/${kf.id}`} style={{display: 'block', width: '240px', height: '320px', marginLeft: '40px'}}>
            <Book key={kf.id} book={kf}/>
          </Link>
        </div>
      )
    });

    return (
          <Layout style={{margin: 50, background: '#fff'}}>
            <Sider width={200} style={{background: '#fff'}}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{height: '100%'}}
              >
                <SubMenu key="sub1" title={<span><Icon type="wallet"/>藏经阁</span>}>
                  <Menu.Item key="1">
                    <Link to="/home">
                      我创建的秘籍
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/home/workspaces">
                      我的Workspace
                    </Link>
                  </Menu.Item>
                  {/*<Menu.Item key="2">我收藏的秘籍</Menu.Item>*/}
                </SubMenu>

              </Menu>
            </Sider>
            <Content>
              <div style={{background: '#fff', padding: 24, minHeight: 280, overflow: 'auto'}}>
                <Divider orientation="left" style={{fontSize: '28px'}}>藏经阁</Divider>
                {books}
                <Link to='/books/create'>
                  <div className='container'>
                    <div className='book'>
                      <div className='front'>
                        <div className='addCover' style={{backgroundColor: '#525485'}}>
                          <h2>
                            <span>{this.props.store.currentUser.name}</span>
                            <span>添加秘籍</span>
                          </h2>
                        </div>
                      </div>

                      <div className='left' style={{backgroundColor: '#525485'}}>
                        <h2>
                          <span>作者</span>
                          <span>名称</span>
                        </h2>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </Content>
          </Layout>
    )
  }
}

export default Home