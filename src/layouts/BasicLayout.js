import React from 'react';
import { Layout, Divider, Button, Menu, Icon, Tabs, Card, Row, Col, Avatar } from 'antd';
import MyHeader from "../components/Header";
import MyFooter from "../components/Footer";

const { Content, Sider } = Layout;

class BasicLayout extends React.Component {
  render() {
    return (
      <Layout>
        <MyHeader/>
        <Content>
          {this.props.children}
        </Content>
        <MyFooter/>
      </Layout>
    )
  }
}

export default BasicLayout;