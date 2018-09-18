import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

class MyFooter extends React.Component {
  render() {
    return (
      <Footer style={{background: '#f3f3f3', clear: 'both', textAlign: 'center'}}>
        Copyright @2018 功夫编程 kfcoding.com{this.props.children}||<a href='http://www.miitbeian.gov.cn/'>沪ICP备18019397号</a>
      </Footer>
    )
  }
}

export default MyFooter;
