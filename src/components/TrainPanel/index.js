import React from 'react';
import { Tabs, Icon, Menu, Dropdown, Button } from 'antd';
import Term from 'components/Term';
import { createTerminal, createCloudware } from "services/kongfu";
import './style.css';
import Cloudware from "./Cloudware";
import Ide from './Ide';
import Fullscreen from "react-full-screen";
import {createWorkSpace, keepWorkSpace} from "../../services/workspace";

const TabPane = Tabs.TabPane;

class TrainPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      panes: [],
      terminalIdx: 1,
      activeKey: '1',
      isFull: false,
    }

    this.terms = {}
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  add = (type) => {
    const panes = this.state.panes;
    let idx = this.state.terminalIdx++;
    const activeKey = idx + '';
    if (type == 'ide') {
      panes.push({
        title: 'WebIDE-' + idx,
        content: <Ide/>,
        key: idx + ''
      })
      this.setState({panes, activeKey})
      return;
    }
    if (type == 'daocloud.io/shaoling/kfcoding-rstudio-latest:master') {
      panes.push({
        title: 'Rstudio-' + idx,
        content: <Cloudware ws={'ws://cloudware-2.cloudware.kfcoding.com'} pod={'123'}/>,
        key: idx + ''
      })
      this.setState({panes, activeKey});
      return;
      // createWorkSpace(type).then(res => {
      //   console.log(res)
      //   panes.push({
      //     title: 'Rstudio-' + idx,
      //     content: <Cloudware ws={'ws://' + res.data.result.webSocketAddress} pod={res.data.result.podResult.metadata.name}/>,
      //     key: idx + ''
      //   })
      //   this.setState({panes, activeKey})
      // })
      return;
    }
    // 如果是创建terminal
    let workspace = {};
    workspace.image = type;
    workspace.type = 'terminal';

    createWorkSpace(workspace).then(res => {
      console.log(res);//return;
      let name = type;
      if (type == 'registry-vpc.cn-shanghai.aliyuncs.com/kfcoding/workspace-envs:ubuntu') {
        name = 'Linux环境';
      } else if (type == 'registry-vpc.cn-shanghai.aliyuncs.com/kfcoding/workspace-envs:nginx') {
        name = 'Nginx服务器'
      } else if (type == 'registry-vpc.cn-shanghai.aliyuncs.com/kfcoding/workspace-envs:node') {
        name = 'Nodejs环境'
      } else if (type == 'registry-vpc.cn-shanghai.aliyuncs.com/kfcoding/workspace-envs:git') {
        name = 'Git'
      } else if (type == 'registry-vpc.cn-shanghai.aliyuncs.com/kfcoding/workspace-envs:python3') {
        name = "Python3"
      }
      panes.push({
        title: name + '-' + idx,
        content: <Term ref={el => this.terms[activeKey] = el} ws={res.data.result.workspace.wsaddr} style={{height: '100%'}}/>,
        key: idx + ''
      })
      this.setState({panes, activeKey});
      setInterval(() => {
        keepWorkSpace(res.data.result.containerName, 'terminal');
      }, 1000 * 60)

    })

  }

  fly(v) {
    console.log(v)
    if (v) {
      if (this.terms[this.state.activeKey] && this.terms[this.state.activeKey].pasteCode)
        this.terms[this.state.activeKey].pasteCode(v);
    }
  }

  remove = (targetKey) => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({panes, activeKey});
  }

  onChangeTab = (activeKey) => {
    this.setState({activeKey})
  }

  onExtraClick = ({key}) => {
    this.add(key)
  }

  goFull = () => {
    this.setState({ isFull: true });
  }

  render() {
    const menu = (
      <Menu onClick={this.onExtraClick}>
        <Menu.Item key='ide'>WebIDE</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="registry-vpc.cn-shanghai.aliyuncs.com/kfcoding/workspace-envs:ubuntu">
          Linux环境
        </Menu.Item>
        <Menu.Item key="registry-vpc.cn-shanghai.aliyuncs.com/kfcoding/workspace-envs:node">Nodejs环境</Menu.Item>
        <Menu.Item key="registry-vpc.cn-shanghai.aliyuncs.com/kfcoding/workspace-envs:nginx">Nginx服务器</Menu.Item>
        <Menu.Item key='registry-vpc.cn-shanghai.aliyuncs.com/kfcoding/workspace-envs:git'>Git环境</Menu.Item>
        <Menu.Item key='registry-vpc.cn-shanghai.aliyuncs.com/kfcoding/workspace-envs:python3'>Python3环境</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='daocloud.io/shaoling/kfcoding-rstudio-latest:master'>Rstudio(GUI)</Menu.Item>
      </Menu>
    );

    let extra = (
      <div>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" style={{fontSize: '20px', marginRight: 10}} href="#">
            <Icon type="plus-square-o"/>
          </a>
        </Dropdown>
        <Icon type="arrows-alt" onClick={this.goFull} size="small"/> 
      </div>      
    )
    return (
      <div style={{background: '#000', height: 'calc(100vh - 64px)'}}>
        <Fullscreen
          enabled={this.state.isFull}
          onChange={isFull => this.setState({isFull})}
        >
          <Tabs
            hideAdd
            onChange={this.onChangeTab}
            activeKey={this.state.activeKey}
            defaultActiveKey="1"
            type="editable-card"
            onEdit={this.onEdit}
            tabBarExtraContent={extra}
            style={{height: '100vh'}}
            className="full-screenable-node trainpanel"
          >
            {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} style={{height: '100%'}}>{pane.content}</TabPane>)}
          </Tabs>
        </Fullscreen>
      </div>
    )
  }
}

export default TrainPanel;