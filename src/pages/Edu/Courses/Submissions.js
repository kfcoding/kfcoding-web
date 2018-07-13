import React from 'react';
import { List, Card, Button, Icon, Table, Modal, Input } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import logo from 'assets/logo-min.png';
import { getWork } from "../../../services/work";

@inject('store')
@observer
class Work extends React.Component {

  state = {
    work: {}
  }

  componentDidMount() {
    getWork(this.props.match.params.work_id).then(res => {
      this.setState({work: res.data.result.work})
    })
  }

  render() {
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
      title: '学校',
      dataIndex: 'createTime',
      render: () => '华东师范大学',
      sorter: (a, b) => a.createTime.length - b.createTime.length,
    }];
    return (
      <Card title={work.title} bordered={false}>
        {/*<Card title={}>*/}

        {/*</Card>*/}
        <Table
          columns={columns}
          dataSource={work.submissions}
        />

      </Card>

    )
  }
}

export default Work;