import React from 'react';
import { Layout, Icon, Rate, Steps, Menu, Divider  } from 'antd';
//import CannerEditor from 'kfeditor-slate';
import { Value } from 'slate';
import 'pages/Editor/Editor.css';
import MyHeader from 'components/Header';
import TrainPanel from 'components/TrainPanel';
import { observer, inject } from 'mobx-react';

import request from "utils/request";
import { getKongfu } from "services/kongfu";
import Sidebar from "components/Sidebar/index";
import SplitPane from 'react-split-pane';
import Kfeditor from '@kfcoding/kfeditor';
import Comment from '../Comment/Comment';

const {Content} = Layout;

@observer
class Reader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kongfu: {
        title: ''
      },
      kongfu_id: this.props.match.params.kongfu_id,
      currentPage: null,
      currentValue: null,
      meta: {
        pages: []
      },
      prefix: 'http://oss.book.kfcoding.com/' + this.props.match.params.kongfu_id,
      showLeft: true,
      codeFly: ""
    };


    this.left = React.createRef();

  }

  componentDidMount() {

    request(this.state.prefix + '/meta.json').then(res => {console.log(res)
      if (res.err) {
        res = {
          data: {
            pages: []
          }
        }
      }
      this.setState({meta: res.data}, () => {
        if (this.state.meta.pages.length) {
          this.openPage(this.state.meta.pages[0]);
        }
      });
    });

    getKongfu(this.state.kongfu_id).then(res => {
      this.setState({kongfu: res.data.result.kongfu})
    })

  }

  openPage = (page) => {
    if (this.state.currentPage == page) {
      return;
    }
    request('http://oss.book.kfcoding.com/' + this.state.kongfu_id + '/' + page.file).then(res => {
      if (res.err) {
        return;
      }
      this.state.currentPage = page;
      this.setState({currentValue: Value.fromJSON(res.data)});
    })
  }

  onMenuClick(page) {
    this.openPage(page);
  }

  getPageList = (page) => {
    if (!page.pages) {
      page.pages = [];
    }
    let children = page.pages.map(p => {
      return this.getPageList(p);
    })

    let style = {
      height: '40px',
      lineHeight: '40px',
      cursor: 'pointer',
      padding: '0 20px 0 ' + this._getDepth(page) * 20 + 'px'
    };
    if (this.state.currentPage == page) {
      style.background = '#e6f7ff';
      style.color = '#1890ff';
      style.borderRight = '4px solid #1890ff';
    }

    return (
      <div key={page.file}>
        <div className='menu' style={style} onClick={this.onMenuClick.bind(this, page)}>
          {page == this.state.editTitlePage ?
            <input autoFocus type='text' value={page.title} onKeyDown={this.saveTitle}
                   onChange={this.changeTitle.bind(this, page)} style={{border: '0', height: '30px'}}/>
            :
            <span className='title'>{page.title}</span>
          }
        </div>
        {children}
      </div>
    );
  }

  _findParent = (parent, page) => {
    for (var i in parent.pages) {
      let p = parent.pages[i];
      if (p === page) {
        return parent;
      } else {
        let prt = this._findParent(p, page);
        if (prt) {
          return prt;
        }
      }
    }
  }

  _getDepth = (page) => {
    let depth = 0;
    let parent = this._findParent(this.state.meta, page);
    while (parent) {
      depth++;
      parent = this._findParent(this.state.meta, parent);
    }
    return depth;
  }

  toggleLeft = () => {
    if (this.state.showLeft) {
      this.left.current.parentNode.style.width = 0;
      this.state.showLeft = false;
    } else {
      this.left.current.parentNode.style.width = '200px';
      this.state.showLeft = true;
    }
  }

  getNextPage = () => {
    let parent = this._findParent(this.state.meta, this.state.currentPage);
    let currentIdx = 0;
    for (let i in parent.pages) {
      if (parent.pages[i] == this.state.currentPage) {
        currentIdx = i;
        break;
      }
    }

  }

  render() {
    const {meta} = this.state;
    if (!meta) return null;

    let rpages = this.state.meta.pages.map(p => {
      return (
        <Menu
          key={p}
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
        >
          {this.getPageList(p)}
        </Menu>
      );
    })

    let cbc = {
      fly: (v) => {
        let str = "";
        v.map(itr => {
          str += itr.props.node.text + '\n'
        });
        this.trainPanel.fly(str)
      }
    }

    let editor = this.state.currentPage ? (
      <Kfeditor
        className='markdown-body'
        value={this.state.currentValue}
        style={{minHeight: '100%', width: '100%'}}
        onChange={this.onChange}
        readOnly={true}
        codeBlockConfig={cbc}
      />
    ) : null;

    let centerLayoutStyle = {
      background: '#fff',
      height: '100%',
      overflow: 'hidden'
    }


    return (
      <Layout style={{height: '100%'}}>
        <SplitPane split="vertical"
                   defaultSize={200}
                   minSize={0}
        >
          <div ref={this.left}>
            <Sidebar
              width='100%'
              title={this.state.kongfu.title}
              pages={rpages}
              addPage={this.addPage}
              readOnly={true}
            />
          </div>
          <div>
            <Layout style={centerLayoutStyle}>

              <MyHeader style={{width: '100%', paddingLeft: 20, paddingRight: 20}}>
                <Icon style={{}} onClick={this.toggleLeft} style={{color: '#fff', cursor: 'pointer', fontSize: '16px'}} type="menu-fold" />
              </MyHeader>
              <Content>
                <SplitPane defaultSize='65%'>
                  <div>
                    <div
                      style={{height: 'calc(100vh - 64px)', overflow: 'hidden', overflowY: 'scroll', position: 'relative', background: '#fff'}}>
                      {editor}
                      <div style={{textAlign: 'right', paddingRight: '40px'}}>
                        评分：<Rate/>
                      </div>
                      <div style={{width:750}}>
                        <Divider />
                        <Comment/>
                      </div>
                      {/*<Steps current={1}>*/}
                      {/*<Step title="Finished" description="This is a description." />*/}
                      {/*<Step title="Waiting" description="This is a description." />*/}
                      {/*</Steps>*/}
                    </div>
                  </div>
                  <div>
                    <TrainPanel ref={el => this.trainPanel = el}/>
                  </div>
                </SplitPane>

              </Content>
            </Layout>
          </div>
        </SplitPane>
      </Layout>
    );
  }
}

export default Reader;