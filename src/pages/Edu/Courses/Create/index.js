import React from 'react';
import {Card, Form, Input, Button, message} from 'antd';
import {withRouter} from 'react-router-dom';
import { createCourse } from "services/course";

const FormItem = Form.Item;

class CreateCourse extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        createCourse(values).then(res => {
          if (res.data && res.data.code === 200) {
            this.props.history.push('/courses')
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
      <Card title='创建课程'>
        <Form onSubmit={this.handleSubmit} style={{width: 500}}>
          <FormItem
            {...formItemLayout}
            label='课程名称'
          >
            {getFieldDecorator('name', {
              rules: [{required: true, message: '请输入课程名称', whitespace: true}],
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="课程描述"
          >
            {getFieldDecorator('description', {
              rules: [{
                required: true, message: '请输入简短的课程描述',
              }],
            })(
              <Input/>
            )}
          </FormItem>


          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">提 交</Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default withRouter(Form.create()(CreateCourse));