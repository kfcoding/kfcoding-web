import React from 'react';
import { Layout, Icon, Button, Divider, Menu, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import MyHeader from "../../components/Header";
import MyFooter from "../../components/Footer";
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

  showDeleteConfirm(book) {
    const self = this;
    confirm({
      title: `确定删除《${book.title}》？`,
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.props.store.currentUser.bookStore.removeBook(book);
        // deleteKongfu(book.id).then(res => {
        //   if (res.data.code == 200) {
        //     message.success("删除成功");
        //   }
        // })
      }
    });
  }

  render() {
    let kongfus = this.props.store.currentUser.bookStore.books.map((kf) => {
      let viewhref = '/reader/' + kf.id;
      let edithref = '/editor/' + kf.id;
      let settinghref = '/books/' + kf.id + '/settings';
      return (
        <div key={kf} style={{float: 'left', marginRight: '40px', marginBottom: '40px'}}>
          <a href='#' style={{display: 'block', width: '240px', height: '320px', marginLeft: '40px'}}>
            <Book key={kf.id} book={kf}/>
          </a>
          <div style={{paddingTop: '30px', textAlign: 'center'}}>
            <Button.Group>
              <Button type="primary" icon="eye" href={viewhref}>阅读</Button>
              <Button type="primary" icon="edit" href={edithref}>编辑</Button>
              <Button type="primary" icon="setting" href={settinghref}>设置</Button>
              <Button onClick={() => this.showDeleteConfirm(kf)} type="primary" icon="delete">
                删除
              </Button>
            </Button.Group>
          </div>
        </div>
      )
    });

    return (
      <Layout>
        <MyHeader/>
        <Content style={{padding: '50px'}}>
          <Layout style={{padding: '24px 0', background: '#fff'}}>
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
                {kongfus}
                <Link to='/book/create'>
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
        </Content>
        <MyFooter></MyFooter>
      </Layout>
    )
  }
}

export default Home