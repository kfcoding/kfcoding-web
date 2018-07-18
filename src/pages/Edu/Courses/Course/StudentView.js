import React from 'react';
import { Tabs, Card, Table, Button, Icon, message, Modal, Select, Popover, Tooltip, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { inject, observer } from 'mobx-react';
import { getCourse } from "../../../../services/course";
import { getMyWorkspaces } from "../../../../services/users";
import { createSubmission } from "../../../../services/submission";
import Work from "../Work";
import request from "../../../../utils/request";
import { doWork } from "../../../../services/work";

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
  title: '学校',
  dataIndex: 'createTime',
  render: () => '华东师范大学',
  sorter: (a, b) => a.createTime.length - b.createTime.length,
}];

@inject('store')
@observer
class StudentView extends React.Component {
  state = {
    course: this.props.course,
    visible: false,
    currentWork: null,
    currentWorkspace: null,
    workspaces: [],
    submissionsVisible: false
  }

  _doWork = (work) => {
    // console.log(work)
    var w = window.open();
    doWork({work_id: work.id}).then(res => {
      w.location.href = 'http://workspace.kfcoding.com/' + res.data.result.workspaceId;
    })
  }

  componentWillReceiveProps(next) {
    if (next.course) {
      this.setState({course: next.course})
    }
  }

  render() {
    const {course} = this.state;
    const workColumns = [{
      title: '标题',
      dataIndex: 'name',
      render: (text, record) => (
        <Popover placement="topLeft" title={text} content={record.description} trigger='click'>
          <a href='javascript:;'>{text}</a>
        </Popover>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: (a, b) => a.createTime.length - b.createTime.length,
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      sorter: (a, b) => a.startTime - b.startTime,
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      sorter: (a, b) => a.endTime - b.endTime,
    }, {
      title: '操作',
      dataIndex: 'ops',
      render: (text, record) => (
        <div>
          {this.props.store.currentUser.role !== 'teacher' ?
            <Button onClick={() => {
              this._doWork(record)
            }}><Icon type="right-circle"/>做作业</Button>
            :
            <Link to={`/works/${record.id}/edit`}><Button><Icon type="edit"/>修改</Button></Link>
          }
        </div>
      )
    }];
    return (
      <Card title={this.state.course.name} bordered={false}>
        <Tabs>
          {course.works &&
          <Tabs.TabPane tab='作业列表' key='1'>
            <Table
              columns={workColumns}
              dataSource={course.works.filter(w => new Date(w.startTime) < new Date() && new Date(w.endTime) > new Date())}
              expandedRowRender={(record) => {
                return (
                  <div>
                    <p>作业内容：{record.description}</p>
                  </div>
                )
              }}
            />
          </Tabs.TabPane>
          }
        </Tabs>
      </Card>

    )
  }
}

export default StudentView;