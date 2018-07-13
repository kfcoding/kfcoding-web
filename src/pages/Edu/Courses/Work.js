import React from 'react';
import { List, Card, Button, Icon, Table, Popover, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { getWork } from "../../../services/work";

@inject('store')
@observer
class Work extends React.Component {

  state = {
    work: {
      submissions: []
    }
  }

  componentDidMount() {
    getWork(this.props.work.id).then(res => {
      this.setState({work: res.data.result.work})
    })
  }

  run = (record) => {return;
  // TODO:
    let data = {
      image: record.image,
      title: 'tmp-' + new Date().getTime(),
      description: 'tmp',
      gitUrl: record.repo,
    };

    this.props.store.currentUser.workspaceStore.createWorkspace(data);
    setTimeout(() => {
      window.location.href = 'http://workspace.kfcoding.com/'
    })
  }

  render() {
    const {store} = this.props;
    const {work} = this.state;
    const columns = [{
      title: '学号',
      dataIndex: 'student.studentNumber',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.student.studentNumber.length - b.student.studentNumber.length,
    }, {
      title: '姓名',
      dataIndex: 'student.realName',
      sorter: (a, b) => a.student.realName.length - b.student.realName.length,
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      sorter: (a, b) => a.createTime.length - b.createTime.length,
    }, {
      title: '操作',
      dataIndex: 'ops',
      render: (text, record) => (
        <div>
          <Tooltip title='运行'>
            <Icon type="play-circle-o" onClick={() => {this.run(record)}} style={{margin: '0 10px'}}/>
          </Tooltip>
          <Popover title='Git地址' content={<a target='_blank' href={record.repo}>{record.repo}</a>}>
            <Icon type="github" style={{margin: '0 10px'}}/>
          </Popover>
        </div>
      )
    }];
    return (
      <div>
        <Card title='提交列表'>

          <Table
            columns={columns}
            dataSource={store.currentUser.role === 'teacher' ? work.submissions : work.submissions.filter(s => s.userId === store.currentUser.id)}
          />
        </Card>
      </div>
    )
  }
}

export default Work;