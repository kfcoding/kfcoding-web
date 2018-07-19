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

  run = (record) => {
    let w = window.open();
    w.location.href = 'http://workspace.kfcoding.com/' + record.workspace.id;
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
      title: '开始时间',
      dataIndex: 'createTime',
      render: r => new Date(r).toLocaleString(),
      sorter: (a, b) => a.createTime - b.createTime,
    }, {
      title: '操作',
      dataIndex: 'ops',
      render: (text, record) => (
        <div>
          <Tooltip title='运行'>
            <Icon type="play-circle-o" onClick={() => {this.run(record)}} style={{margin: '0 10px', cursor: 'pointer'}}/>
          </Tooltip>
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