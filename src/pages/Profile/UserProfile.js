import React from 'react';
import { Layout, Divider, Button, Menu, Icon, Row, Col, Card, Tabs } from 'antd';
import Book from "components/Book";
import { getMyKongfu, getUser } from "services/users";
import { createKongfu, getUserKongfu } from "services/kongfu";
import { Link } from 'react-router-dom';
import logo from 'assets/logo-min.png';

const {Content, Sider} = Layout;
const ButtonGroup = Button.Group;
const {SubMenu} = Menu;

class UserProfile extends React.Component {
  state = {
    user_id: this.props.match.params.user_id,
    user: {
      name: '',
      email: '',
      avatarUrl: ''
    },
    loading: false,
    visible: false,
    kongfus: [],
    isRefresh: false
  }

  componentWillMount() {
    getUserKongfu(this.state.user_id).then(res => {
      this.setState({kongfus: res.data.result.courses})
    })
    getUser(this.state.user_id).then(res => {
      this.setState({user: res.data.result.user})
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = () => {
    this.setState({visible: false});
  }
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      var user = JSON.parse(localStorage.getItem('user'));
      values['author'] = user.name;
      values['userId'] = user.id
      console.log('Received values of form: ', values);
      createKongfu(values).then(res => {
        getMyKongfu().then(res => {
          this.setState({kongfus: res.data.result.courses})
          this.setState({visible: false})
        })
      })
    })
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  render() {
    const {visible, loading} = this.state;

    let kongfus = this.state.kongfus.map((kf) => {
      return (
        <div key={kf.id} style={{float: 'left', marginRight: '40px', marginBottom: '40px'}}>
          <Link to={`/books/${kf.id}`} style={{display: 'block', width: '240px', height: '320px'}}>
            <Book key={kf.id} book={kf}/>
          </Link>

        </div>
      )
    })

    return (


          <Row style={{marginTop: 30}} gutter={40}>
            <Col span={4} offset={3}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={this.state.user.avatarUrl || logo} />}
              >
                <Card.Meta
                  title={this.state.user.name}
                  description={this.state.user.email}
                />
              </Card>
            </Col>
            <Col span={14}>

              <div style={{background: '#fff', padding: 24, minHeight: 280, overflow: 'auto'}}>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab={<span><Icon type="book" />编程秘籍</span>} key="1">
                    {kongfus}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={<span><Icon type="star" />收藏室</span>} key="2">
                    暂无收藏
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={<span><Icon type="calendar" />动 态</span>} key="3">
                    暂无动态
                  </Tabs.TabPane>
                </Tabs>

              </div>
            </Col>
          </Row>

    );
  }
}

export default (UserProfile);