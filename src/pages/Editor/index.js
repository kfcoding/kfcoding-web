import React from 'react';
import { Layout, Menu, Dropdown, Icon, Popover, Select, Upload } from 'antd';
import request from "utils/request";
import { getOssToken, getKongfu } from "services/kongfu";
import { Value } from 'slate';
import styles from './Editor.css';
import MyHeader from 'components/Header';
import TrainPanel from "components/TrainPanel/index";
import Sidebar from "components/Sidebar/index";
import SplitPane from 'react-split-pane';
import Kfeditor from '@kfcoding/kfeditor';

const {Content} = Layout;

const Alioss = require('ali-oss');

const initialValue = ({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [{
              text: ''
            }],
          },
        ],
      },
    ],
  },
});


class KongfuEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      kongfu_id: this.props.match.params.kongfu_id,
      sts: '',
      ossclient: null,
      currentPage: null,
      currentValue: null,
      meta: null,
      dirty: false,
      editTitlePage: null,
      kongfu: {
        title: ''
      },
      showLeft: true,
      codeFly: ''
    };

    this.saveTimer();
    this.left = React.createRef();
  }

  componentWillUnmount() {
    this._saveCurrentPage()
  }

  componentWillMount() {
    let kongfu_id = this.state.kongfu_id;
    getOssToken(kongfu_id).then(res => {console.log(res.data.result)
      var client = new Alioss.Wrapper({
        region: 'oss-cn-hangzhou',
        //endpoint: 'oss.book.kfcoding.com',
        accessKeyId: res.data.result.assumeRoleResponse.credentials.accessKeyId,
        accessKeySecret: res.data.result.assumeRoleResponse.credentials.accessKeySecret,
        stsToken: res.data.result.assumeRoleResponse.credentials.securityToken,
        bucket: 'kfcoding'
      });
      this.state.sts = res.data.result.assumeRoleResponse.credentials.accessKeyId;
      this.state.ossclient = client;

      request(client.signatureUrl(kongfu_id + '/meta.json')).then(res => {

        // meta.json contains pages meta info
        if (res.err && res.err.response.status === 404) {
          let meta = {
            id: kongfu_id,
            pages: []
          };
          client.put(kongfu_id + '/meta.json', new Alioss.Buffer(JSON.stringify(meta)));
          this.setState({meta: meta})
        } else {
          this.setState({meta: res.data});
        }

        if (this.state.meta.pages.length) {
          this.openPage(this.state.meta.pages[0]);
        }
      })
    })
    getKongfu(this.state.kongfu_id).then(res => {
      this.setState({kongfu: res.data.result.kongfu})
    })
  }

  saveTimer() {
    setInterval(() => {
      this._saveCurrentPage()
    }, 5000)
  }

  _saveCurrentPage() {
    if (!this.state.currentPage) {
      return;
    }
    if (this.state.dirty || localStorage.getItem('dirty') == 'true') {
      let page = this.state.currentPage;

      let filename = this.state.kongfu_id + '/' + page.file;
      let pushdata = this.state.currentValue.toJSON();

      this.state.ossclient.put(filename, new Alioss.Buffer(JSON.stringify(pushdata))).then(() => {
        this.state.dirty = false;
        localStorage.setItem('dirty', 'false');
      })
    }
  }

  addPage = ({parent}) => {
    if (!parent) {
      parent = this.state.meta;
    }
    var title = prompt('请输入章节名称', '新章节');
    if (!title) {
      return;
    }
    let page_id = new Date().getTime();
    let page = {
      title: title,
      file: page_id + '.json'
    };
    if (!parent.pages) {
      parent.pages = [];
    }
    parent.pages.push(page);

    this.state.ossclient.put(this.state.kongfu_id + '/meta.json', new Alioss.Buffer(JSON.stringify(this.state.meta)));

    let pushdata = initialValue;

    let filename = this.state.kongfu_id + '/' + page.file;

    this.state.ossclient.put(filename, new Alioss.Buffer(JSON.stringify(pushdata))).then(() => {
      this.state.currentPage = page;
      this.setState({currentValue: Value.fromJSON(initialValue)});
    })

  }

  openPage = (page) => {
    if (this.state.currentPage == page) {
      return;
    }
    if (this.state.dirty) {
      this._saveCurrentPage();
      this.state.dirty = false;
    }
    request(this.state.ossclient.signatureUrl(this.state.kongfu_id + '/' + page.file)).then(res => {
      if (res.err) {
        return;
      }
      this.state.currentPage = page;
      if (res.data.document.nodes.length == 0) {
        this.setState({currentValue: Value.fromJSON(initialValue)});
      } else {
        this.setState({currentValue: Value.fromJSON(res.data)});
      }
    })
  }

  onContentChange = ({value}) => {


    this.setState({currentValue: value});
    if (value.document != this.state.currentValue.document) {
      this.state.dirty = true;
    }
    console.log(value.toJSON())
  }

  changeTitle(page, e) {
    page.title = e.target.value;
    this.forceUpdate()
    e.target.focus()
  }

  saveTitle = (e) => {
    if (e.key == 'Enter') {
      this.state.ossclient.put(this.state.kongfu_id + '/meta.json', new Alioss.Buffer(JSON.stringify(this.state.meta)));
      this.setState({editTitlePage: null});
    }
  }

  onMenuClick(page) {
    this.openPage(page);
    this.setState({currentPage: page});
    this.forceUpdate()
  }

  _deletePage(page) {
    if (page.pages) {
      page.pages.forEach(p => {
        this._deletePage(p);
      })
    }
    this.state.ossclient.delete(this.state.kongfu_id + '/' + page.file);
    let parent = this._findParent(this.state.meta, page);
    for (var i in parent.pages) {
      if (page == parent.pages[i]) {
        parent.pages.splice(i, 1);
      }
    }
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
      padding: '0 30px 0 ' + this._getDepth(page) * 20 + 'px'
    };
    if (this.state.currentPage == page) {
      style.background = '#e6f7ff';
      style.color = '#1890ff';
      style.borderRight = '4px solid #1890ff';
    }

    let onDropClick = ({key}) => {
      if (key == 'remove') {
        this._deletePage(page);

        this.state.ossclient.put(this.state.kongfu_id + '/meta.json', new Alioss.Buffer(JSON.stringify(this.state.meta))).then(() => {
          this.setState({currentPage: null})
        });
      } else if (key == 'rename') {
        this.setState({editTitlePage: page})
      } else if (key == 'add') {
        this.addPage({parent: page});
      }
    }

    let onDragStart = (e) => {
      console.log(e)
    }

    let menu = (
      <Menu onClick={onDropClick}>
        <Menu.Item key="rename">
          <a style={{fontSize: '12px'}}><Icon type="edit" style={{marginRight: '10px'}}/> 重命名</a>
        </Menu.Item>
        <Menu.Item key="add">
          <a style={{fontSize: '12px'}}><Icon type="plus" style={{marginRight: '10px'}}/> 添加子章节</a>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="remove">
          <a style={{color: '#e05353', fontSize: '12px'}}><Icon type="close" style={{marginRight: '10px'}}/> 删除</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div key={page.file} draggable={true} onDragStart={onDragStart}>
        <div className='menu' style={style} onClick={this.onMenuClick.bind(this, page)}>
          {page == this.state.editTitlePage ?
            <input autoFocus type='text' value={page.title} onKeyDown={this.saveTitle}
                   onChange={this.changeTitle.bind(this, page)} style={{border: '0', height: '30px', width: '100%'}}/>
            :
            <span className='title'>{page.title}</span>
          }
          <span className='dropdown'>
          <Dropdown overlay={menu} trigger={['click']}>
            <a href="#">
              <Icon type="ellipsis"/>
            </a>
          </Dropdown>
          </span>
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

  render() {
    const {meta} = this.state;
    if (!meta) return null;

    let rpages = this.state.meta.pages.map(p => {
      return this.getPageList(p)
    })

    let serviceConfig = {
      name: "image",
      accept: "image/*",
      customRequest: ({file, onSuccess}) => {
        this.state.ossclient.put(this.state.kongfu_id + '/resources/' + new Date().getTime() + '.png', file).then(res => {
          res.data = {
            link: res.url
          }

          onSuccess(res)
          this.state.dirty = true;
        });
        return true;
      },
      headers: {
        "X-Requested-With": null // https://github.com/react-component/upload/issues/33
      }
    };

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
        value={this.state.currentValue}
        onChange={this.onContentChange}
        style={{minHeight: '100%', background: '#fff', width: '100%'}}
        placeholder='请开始你的表演！'
        imageOptions={serviceConfig}
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
            />
          </div>
          <div>
            <Layout style={centerLayoutStyle}>

              <MyHeader style={{width: '100%', paddingLeft: 20, paddingRight: 20}}>
                <Icon onClick={this.toggleLeft} style={{color: '#fff', cursor: 'pointer', fontSize: '16px'}} type="menu-fold" />
              </MyHeader>
              <Content>
                <SplitPane defaultSize='65%'>
                  <div>
                    <div
                      style={{height: 'calc(100vh - 64px)', overflow: 'hidden', overflowY: 'scroll', position: 'relative', background: '#fff'}}>
                      {editor}
                    </div>
                  </div>
                  <div>
                    <TrainPanel ref={el => this.trainPanel = el} codeFly={this.state.codeFly}/>
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

export default KongfuEditor;