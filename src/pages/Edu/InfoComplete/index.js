import React from 'react';
import { Card, Form, Input, Alert, Icon, Cascader, Select, Row, Col, Checkbox, Button, message } from 'antd';
import { updateStudentInfo } from "../../../services/users";

const FormItem = Form.Item;

const residences = [{
  value: 'shanghai',
  label: '上海市',
  children: [{
    value: 'shanghai',
    label: '上海市',
    children: [{
      value: 'huashida',
      label: '华东师范大学',
    }],
  }],
}];

class InfoComplete extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.school = values.school[2];
        updateStudentInfo(values).then(res => {
          message.success('保存成功');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
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
        <Alert message="您尚未完善个人信息，请完善个人信息" type="info" showIcon style={{marginBottom: 30}}/>

        <Card title="信息完善" bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{width: 500}}>

            <FormItem
              {...formItemLayout}
              label="学校"
            >
              {getFieldDecorator('school', {
                rules: [{type: 'array', required: true, message: '请输入学校'}],
              })(
                <Cascader options={residences} placeholder='请选择学校'/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='姓名'
            >
              {getFieldDecorator('realname', {
                rules: [{required: true, message: '请输入姓名', whitespace: true}],
              })(
                <Input/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="学号"
            >
              {getFieldDecorator('studentnumber', {
                rules: [{
                  required: true, message: '请输入学号',
                }],
              })(
                <Input/>
              )}
            </FormItem>

            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
          </Form>

        </Card>
      </div>
    )
  }
}

export default Form.create()(InfoComplete);