import React from 'react';
import { List, Avatar, Button, Spin } from 'antd';

import reqwest from 'reqwest';
import Kfeditor from '@kfcoding/kfeditor';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

class Comment extends React.Component {
  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    data: [],
  }

  componentDidMount() {
    this.getData((res) => {
      this.setState({
        loading: false,
        data: res.results,
      });
    });
  }

  getData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  }

  render() {
    const { data } = this.state;
    let editor = this.state.currentPage ? (
      <Kfeditor
        value={this.state.currentValue}
        onChange={this.onContentChange}
        style={{minHeight: '100%', background: '#fff', width: '100%'}}
        placeholder='请开始你的表演！'
      />
    ) : null;

    return (
      <List
        className="demo-loadmore-list"
        split={false}
        itemLayout="horizontal"
        dataSource={data}
        footer={
          <div>style={{overflow: 'hidden', overflowY: 'scroll', position: 'relative', background: '#fff'}}>
            {editor}
          </div>
        }
        renderItem={item => (
          <List.Item actions={[<a>回复</a>,<a>编辑</a>,<a>删除</a>]}>
            <List.Item.Meta
              avatar={<Avatar src="/favicon.ico" />}
              title={<a href="https://ant.design">{item.name.last}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
            {/*<div style={{width:700,paddingTop:6, paddingLeft:16, paddingBottom:6, color:"#8C8C8C", backgroundColor:"#F9F9F9"}}>
              回复 <a>@Carrie</a>
            </div>*/}
            <div style={{color:"#CCC"}}>一个月前</div>

          </List.Item>
        )}
      />
    );
  }
}

export default Comment;