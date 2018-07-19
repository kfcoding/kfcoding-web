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
import StudentView from "./StudentView";

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
class Course extends React.Component {
  state = {
    course: {
      id: ''
    },
  }

  componentDidMount() {
    getCourse(this.props.match.params.course_id).then(res => {
      try {
        this.setState({course: res.data.result.course});
      } catch (e) {
        message.error('获取课程信息失败');
        console.log(e)
      }
    })
  }

  expandWork = (record) => {
    return (
      <Work work={record}/>
    )
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
      render: r => new Date(r).toLocaleString(),
      sorter: (a, b) => a.createTime - b.createTime,
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      render: r => new Date(r).toLocaleString(),
      sorter: (a, b) => a.startTime - b.startTime,
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      render: r => new Date(r).toLocaleString(),
      sorter: (a, b) => a.endTime - b.endTime,
    }, {
      title: '操作',
      dataIndex: 'ops',
      render: (text, record) => (
        <div>
            <Link to={`/works/${record.id}/edit`}><Button><Icon type="edit"/>修改</Button></Link>
        </div>
      )
    }];
    return (
      <div>
        <Breadcrumb style={{marginBottom: 30}}>
          <Breadcrumb.Item><Link to='/courses'>课程列表</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{this.state.course.name}</Breadcrumb.Item>
        </Breadcrumb>
        {this.props.store.currentUser.role === 'teacher' ?
          <Card title={this.state.course.name} bordered={false}>
            <Tabs>

              <Tabs.TabPane tab='作业列表' key='1'>
                <Table
                  columns={workColumns}
                  dataSource={course.works}
                  expandedRowRender={(record) => {
                    return this.expandWork(record)
                  }}
                />
                <Link to={`/courses/${course.id}/works/create`}><Button><Icon type='plus'/>创建作业</Button></Link>
              </Tabs.TabPane>

              <Tabs.TabPane tab='学生列表' key='2'>
                <Table
                  columns={columns}
                  dataSource={course.users}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab='设置' key='3'>
                课程加入代码：<b>{course.code}</b>
              </Tabs.TabPane>
            </Tabs>
          </Card>
          :
          <StudentView course={this.state.course}/>
        }
      </div>
    )
  }
}

export default Course;