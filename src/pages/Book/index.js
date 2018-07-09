import React from 'react';
import { Layout, Button, Menu, Icon, Tabs, Card, Row, Col, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { getKongfu } from "services/kongfu";
import Book from "components/Book";
import { getUser } from "services/users";
import request from "../../utils/request";
import './style.css';
import KongfuSettings from "../Home/KongfuSettings";

const {Content, Sider} = Layout;
const ButtonGroup = Button.Group;

@inject('store')
@observer
class Kongfu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kongfu_id: this.props.match.params.kongfu_id,
      prefix: 'http://oss.book.kfcoding.com/' + this.props.match.params.kongfu_id,
      kongfu: {
        title: ''
      },
      author: {
        name: '',
        avatarUrl: ''
      },
      meta: null
    }
  }

  componentDidMount() {
    getKongfu(this.state.kongfu_id).then(res => {
      this.setState({kongfu: res.data.result.kongfu});
      // getUser(res.data.result.kongfu.userId).then(ures => {
      //   this.setState({author: ures.data.result.user})
      // })
    });
    request(this.state.prefix + '/meta.json').then(res => {
      console.log(res)
      this.setState({meta: res.data});
    })
  }

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({[type]: key});
  }

  renderCatalog(page) {
    if (page.pages && page.pages.length) {
      return (
        <dl key={page.file}>
          <dt>{page.title}</dt>
          {page.pages.map(p => this.renderCatalog(p))}
        </dl>
      )
    } else {
      return <dd key={page.file}>{page.title}</dd>
    }
  }

  render() {
    const {store} = this.props;
    return (
      <div>
        <Row style={{background: '#fafbfc', minHeight: 100, paddingTop: 20, borderBottom: '1px solid #e1e4e8'}}>
          <Col span={18} offset={3} style={{fontSize: 16, fontWeight: 'bold', position: 'relative'}}>
            <Icon style={{marginRight: 10}} type='book'/>
            <Link to={`/users/${this.state.kongfu.userId}`}>{this.state.kongfu.author}</Link> / <Link
            to={`/books/${this.state.kongfu.id}`}>{this.state.kongfu.title}</Link>
            {this.state.author.id === store.currentUser.id &&
            <Link to={'/editor/' + this.state.kongfu.id} style={{position: 'absolute', right: 120}}>
              <Button icon="edit">编 辑</Button>
            </Link>
            }

            <Link to={'/reader/' + this.state.kongfu.id} style={{position: 'absolute', right: 0}}>
              <Button type="primary" icon="eye">开始阅读</Button>
            </Link>
          </Col>
        </Row>
        <Row style={{marginTop: -44}}>
          <Col span={18} offset={3}>
            <Tabs>
              <Tabs.TabPane tab={<span><Icon type="bars"/>目 录</span>} key="1">
                <Card title={this.state.kongfu.title}>
                  <blockquote>简介：{this.state.kongfu.brief}</blockquote>
                  <div className='catalog'>
                    {this.state.meta && this.renderCatalog(this.state.meta)}
                  </div>
                  <div style={{paddingTop: '30px'}}>
                    <ButtonGroup>
                      <Link to={'/reader/' + this.state.kongfu.id}>
                        <Button type="primary" icon="eye">开始阅读</Button>
                      </Link>
                    </ButtonGroup>
                  </div>
                </Card>
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span><Icon type="message"/>讨 论</span>} key="2">
                <Card title='讨论'>
                  暂无讨论
                </Card>
              </Tabs.TabPane>
              {this.state.author.id === store.currentUser.id &&
              <Tabs.TabPane tab={<span><Icon type="setting"/>设 置</span>} key="3">
                <Card title='设置'>
                  <KongfuSettings book={this.state.kongfu}/>
                </Card>
              </Tabs.TabPane>
              }


            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Kongfu;