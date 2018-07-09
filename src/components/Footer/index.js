import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

class MyFooter extends React.Component {
  render() {
    return (
      <Footer style={{background: '#f3f3f3', clear: 'both'}}>
        功夫编程 KFCoding.com 2018{this.props.children}
      </Footer>
    )
  }
}

export default MyFooter;