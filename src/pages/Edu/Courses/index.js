import React from 'react';
import { List, Card, Button, Icon, message, Modal, Input, Tooltip } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { getMyCourses } from "../../../services/users";
import logo from 'assets/logo-min.png';
import { getMyJoinedCourses, joinCourse } from "../../../services/course";
import InfoComplete from 'pages/Edu/InfoComplete';

@inject('store')
@observer
class Courses extends React.Component {

  state = {
    courses: [],
    visible: false,
    code: ''
  }

  constructor(props) {
    super(props);

    // ensure data fetched from server
    setTimeout(() => {
      if (props.store.currentUser.role.toLowerCase() === 'teacher') {
        return;
      }
      if (!props.store.currentUser.student
        || !props.store.currentUser.student.realName
        || !props.store.currentUser.student.studentNumber) {
        this.props.history.push('/complete');
      }
    }, 2000);
  }

  componentDidMount() {
    if (localStorage.getItem('role') === 'teacher') {
      getMyCourses().then(res => {
        this.setState({courses: res.data.result.courses})
      })
    } else {
      getMyJoinedCourses().then(res => {
        try {
          this.setState({courses: res.data.result.courses})
        } catch (e) {
          console.log(e);
          message.error('获取课程信息失败')
        }
      })
    }

  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(this.state);

    joinCourse(this.state.code).then(res => {
      window.location.reload();
    })
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {
    const {store} = this.props;
    const {courses} = this.state;

    const currentUser = store.currentUser;
    return (
      <div>
        {(currentUser.role !== 'teacher' && (!currentUser.student
          || !currentUser.student.realName
          || !currentUser.student.studentNumber)) ?
          <InfoComplete/>
          :
          <Card title="我的课程" bordered={false}>
            {courses.sort((a, b) => (a.createTime > b.createTime)).map(course => (
              <Link to={`/courses/${course.id}`} key={course.id}>
                <Card
                  hoverable
                  style={{width: 204, display: 'inline-block', margin: 15}}
                  cover={<img alt="example" src={logo}/>}
                >
                  <Card.Meta
                    title={course.name}
                    description={course.description}
                  />
                </Card>
              </Link>
            ))}
            <div>
              {this.props.store.currentUser.role === 'teacher' ?
                <Link to='/courses/create'><Button type='primary'><Icon type='plus'/> 创建课程</Button></Link>
                :
                <Button type='primary' onClick={this.showModal}><Icon type='plus'/> 加入课程</Button>
              }
            </div>

            <Modal
              title="加入课程"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              okText='提交'
              cancelText='取消'
            >
              请输入课程代码：
              <Tooltip title='课程代码请询问课程教师'>
                <Icon type="question-circle-o"/>
              </Tooltip>
              <Input onChange={(e) => {
                this.setState({code: e.target.value})
              }}/>
            </Modal>
          </Card>
        }


      </div>
    )
  }
}

export default withRouter(Courses);