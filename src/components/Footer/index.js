import React from 'react';
import { Layout } from 'antd';
import styled, {css} from 'styled-components';

const { Footer } = Layout;

const Container = styled.div`
  ${props => props.narrow && css`
    width: 1000px;
    margin: 0 auto;
  `}
`;

class MyFooter extends React.Component {
  render() {
    return (
      <Footer style={{background: '#f3f3f3', clear: 'both', marginTop: 30}}>
        <Container>
          Copyright @2018 功夫编程 kfcoding.com{this.props.children}||<a href='http://www.miitbeian.gov.cn/'>沪ICP备18019397号</a>
        </Container>
      </Footer>
    )
  }
}

export default MyFooter;