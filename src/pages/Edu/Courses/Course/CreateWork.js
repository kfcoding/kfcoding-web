import React from 'react';
import { Card, Form, Input, Button, message, Breadcrumb } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { createWork, getCourse } from "services/course";

const FormItem = Form.Item;

class CreateWork extends React.Component {
  state = {
    course: {}
  }

  componentDidMount() {
    getCourse(this.props.match.params.course_id).then(res => {
      this.setState({course: res.data.result.course});
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.courseId = this.props.match.params.course_id;
        createWork(values).then(res => {
          if (res.data && res.data.code === 200) {
            this.props.history.push(`/courses/${values.courseId}`);
          } else {
            message.error('出错了，请联系KFCoding解决')
          }
        })
      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div>
        <Breadcrumb style={{marginBottom: 30}}>
          <Breadcrumb.Item><Link to='/courses'>课程列表</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link
            to={`/courses/${this.state.course.id}`}>{this.state.course.name}</Link></Breadcrumb.Item>
          <Breadcrumb.Item>创建作业</Breadcrumb.Item>
        </Breadcrumb>
        <Card title='创建作业'>
          <Form onSubmit={this.handleSubmit} style={{width: 500}}>
            <FormItem
              {...formItemLayout}
              label='作业标题'
            >
              {getFieldDecorator('name', {
                rules: [{required: true, message: '请输入作业标题', whitespace: true}],
              })(
                <Input/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="作业内容"
            >
              {getFieldDecorator('description', {
                rules: [{
                  required: true, message: '请输入作业内容',
                }],
              })(
                <Input.TextArea autosize={{minRows: 2, maxRows: 6}} placeholder='请输入作业内容'/>
              )}
            </FormItem>


            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">提 交</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}

export default withRouter(Form.create()(CreateWork));