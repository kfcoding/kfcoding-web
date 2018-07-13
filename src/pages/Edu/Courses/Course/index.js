import React from 'react';
import { Tabs, Card, Table, Button, Icon, message, Modal, Select, Popover, Tooltip, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import {inject, observer} from 'mobx-react';
import { getCourse } from "../../../../services/course";
import { getMyWorkspaces } from "../../../../services/users";
import { createSubmission } from "../../../../services/submission";
import Work from "../Work";
import request from "../../../../utils/request";

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
    visible: false,
    currentWork: null,
    currentWorkspace: null,
    workspaces: [],
    submissionsVisible: false
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    if (!this.state.currentWorkspace) {
      return;
    }

    const containerName = this.state.currentWorkspace.containerName;
    const postData = {name : this.state.currentWorkspace.containerName};
    // 启动容器

    fetch('http://aliapi.workspace.cloudwarehub.com/workspace/start', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(postData)
    }).then(() => {
      let socket = io('http://' + containerName + '.workspace.cloudwarehub.com');
      socket.on('term.output', function(data) {
        console.log(data);
      });
      socket.on('connect', () => {
        // fetch('http://gitee.workspace.kfcoding.com/repo', {
        request('http://192.168.1.115:3000/repo', {

          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({name: containerName})
        }).then(res => {console.log(res)
          let id = new Date().getTime();
          let gitUrl = res.data.repo;
          socket.emit('term.open', {id: id, cols: 200, rows: 10, cwd: '/workspace'});
          setTimeout(() => {
            let inputs = [
              'rm -rf /tmp/workspace',
              'cp -r /workspace /tmp/workspace',
              'cd /tmp/workspace',
              'rm -rf .git',
              'git init',
              'git add .',
              'git config user.email "kfcodingrepos@gmail.com"',
              'git config user.name "kfcodingrepos"',
              'git commit -m "init"',
              'git remote add origin ' + gitUrl,
              'git push origin master',
            ];
            let input = inputs.join(' && ') + '\n';
            socket.emit('term.input', {id: id, input: input});
            setTimeout(() => {
              socket.emit('term.input', {id: id, input: 'kfcodingrepos@gmail.com\n'});
              setTimeout(() => {
                socket.emit('term.input', {id: id, input: 'kfcoding123\n'});

                // call api write to db
                createSubmission({
                  work_id: this.state.currentWork.id,
                  workspace_id: this.state.currentWorkspace.id,
                  repo: gitUrl
                }).then(res => {
                  if (res.err || res.data.code !== 200) {
                    message.error('提交作业失败，请稍后再试')
                  } else {
                    message.success('提交作业成功');
                    setTimeout(() => {
                      window.location.reload()
                    }, 2000)
                  }
                })
                this.setState({
                  visible: false,
                });
              }, 500)
            }, 500)
          })
        })

      })
    })
    return;

  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      submissionsVisible: false
    });
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

    getMyWorkspaces().then(res => {
      try {
        this.setState({workspaces: res.data.result.workspaces})
      } catch (e) {
        console.log(e)
      }
    })
  }

  submitWork = (work) => {
    this.state.currentWork = work;
    this.state.currentWorkspace_id = '';
    this.showModal();
  }

  submitWorkChange = (value) => {
    for (var i in this.state.workspaces) {
      if (this.state.workspaces[i].id === value) {
        this.state.currentWorkspace = this.state.workspaces[i];
        return;
      }
    }
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
      sorter: (a, b) => a.createTime.length - b.createTime.length,
    }, {
      title: '操作',
      dataIndex: 'ops',
      render: (text, record) => (
        <div>
          {this.props.store.currentUser.role !== 'teacher' ?
          <Button onClick={() => {
            this.submitWork(record)
          }}><Icon type="upload" />交作业</Button>
            :
            <Link to={`/works/${record.id}/edit`}><Button><Icon type="edit" />修改</Button></Link>
          }
        </div>
      )
    }];
    return (
      <div>
        <Breadcrumb style={{marginBottom: 30}}>
          <Breadcrumb.Item><Link to='/courses'>课程列表</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{this.state.course.name}</Breadcrumb.Item>
        </Breadcrumb>
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

            {this.props.store.currentUser.role === 'teacher' &&
            <Tabs.TabPane tab='学生列表' key='2'>
              <Table
                columns={columns}
                dataSource={course.users}
              />
            </Tabs.TabPane>
            }
            {this.props.store.currentUser.role === 'teacher' &&
            <Tabs.TabPane tab='设置' key='3'>
              课程加入代码：<b>{course.code}</b>
            </Tabs.TabPane>
            }
          </Tabs>
        </Card>

        <Modal
          title="交作业"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='提交'
          cancelText='取消'
        >
          选择Workspace：<Tooltip title='选择自己写好作业的Workspace'>
          <Icon type="question-circle-o" />
        </Tooltip>
          <Select style={{width: '100%'}} onChange={this.submitWorkChange}>
            {this.state.workspaces.map(w => (
              <Select.Option value={w.id}>{w.title} (
                <small>{w.description}</small>
                )</Select.Option>
            ))}
          </Select>
        </Modal>

      </div>
    )
  }
}

export default Course;