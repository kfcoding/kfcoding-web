import React from 'react';
import { message, Modal, Layout, Divider, Button, Menu, Icon, Card, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import MyHeader from "components/Header";
import MyFooter from "components/Footer";
import { getWorkspaceByUser, createWorkSpace, deleteWorkspace } from "services/workspace";

const {Content, Sider} = Layout;
const ButtonGroup = Button.Group;
const {SubMenu} = Menu;
const confirm = Modal.confirm;
const {Meta} = Card;

@inject('store')
@observer
class MyWorkspace extends React.Component {

  state = {
    loading: false,
    visible: false,
    workspaces: [],
    isRefresh: false,
    deleteVisible: false,
  }

  showDeleteConfirm(wsp) {
    const self = this;
    confirm({
      title: '确定删除该工作空间？',
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.props.store.currentUser.workspaceStore.removeWorkspace(wsp);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  componentWillMount() {
    this.props.store.currentUser.loadWorkspaces();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = () => {
    this.setState({visible: false});
  }

  OpenClick = (kf) => {
    window.location.href = 'http://workspace.kfcoding.com/' + kf.id;
  }

  render() {

    let workspaces = this.props.store.currentUser.workspaceStore.workspaces.map((kf) => {
      return (
        <div style={{float: 'left', marginRight: '40px', marginBottom: '40px'}}>
          <Card
            hoverable
            style={{width: 240}}
            actions={[<a href={'http://workspace.kfcoding.com/' + kf.id} target='_blank'><Icon type="caret-right"/></a>, <Icon type="delete" onClick={() => this.showDeleteConfirm(kf)}/>]}
          >
            <Meta
              avatar={<Avatar icon="folder"/>}
              title={kf.title}
              // description={kf.gitUrl}
              onClick={() => {
                this.OpenClick(kf)
              }}
              style={{marginRight: 0}}
            />
          </Card>
        </div>
      )
    })

    return (
        <Content style={{margin: '50px'}}>
          <Layout style={{background: '#fff'}}>
            <Sider width={200} style={{background: '#fff'}}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['2']}
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
                    <Link to="/myWorkspace">
                      我创建的Workspace
                    </Link>
                  </Menu.Item>
                  {/*<Menu.Item key="2">我收藏的秘籍</Menu.Item>*/}
                </SubMenu>

              </Menu>
            </Sider>
            <Content>
              <div style={{background: '#fff', padding: 24, minHeight: 280, overflow: 'auto'}}>
                <Divider orientation="left" style={{fontSize: '28px'}}>Workspace</Divider>
                <div style={{marginBottom: 30}}>
                  <Link to='/home/workspaces/create'><Button type="primary" icon="plus">创建Workspace</Button></Link>
                </div>
                {workspaces}
              </div>
            </Content>
          </Layout>
        </Content>
    );
  }
}

export default (MyWorkspace);