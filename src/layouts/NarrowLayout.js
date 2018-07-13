import React from 'react';
import { Layout, Divider, Button, Menu, Icon, Tabs, Card, Row, Col, Avatar } from 'antd';
import styled from 'styled-components';
import MyHeader from "../components/Header";
import MyFooter from "../components/Footer";

const { Content, Sider } = Layout;

const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
`;

class BasicLayout extends React.Component {
  render() {
    return (
      <Layout>
        <MyHeader narrow={true}/>
        <Content style={{paddingTop: 30, minHeight: 600}}>
          <Container>
          {this.props.children}
          </Container>
        </Content>
        <MyFooter narrow={true}/>
      </Layout>
    )
  }
}

export default BasicLayout;