import React from 'react';
import {Card, Form, Input, Button, message} from 'antd';
import {withRouter} from 'react-router-dom';
import { createWork, updateWork } from "services/course";
import { getWork } from "../../../../services/work";

const FormItem = Form.Item;

class EditWork extends React.Component {
  state = {
    work: {}
  }

  componentDidMount() {
    getWork(this.props.match.params.work_id).then(res => {
      this.setState({work: res.data.result.work});
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.id = this.props.match.params.work_id;
        updateWork(values).then(res => {
          if (res.data && res.data.code === 200) {
            this.props.history.push(`/courses/${this.state.work.courseId}`);
          } else {
            message.error('出错了，请联系KFCoding解决')
          }
        })
      }
    });
  }

  back = () => {
    window.history.go(-1)
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
      <Card title='修改作业'>
        <Form onSubmit={this.handleSubmit} style={{width: 500}}>
          <FormItem
            {...formItemLayout}
            label='作业标题'
          >
            {getFieldDecorator('name', {
              initialValue: this.state.work.name,
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
              initialValue: this.state.work.description,
              rules: [{
                required: true, message: '请输入作业内容',
              }],
            })(
              <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder='请输入作业内容'/>
            )}
          </FormItem>


          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">提 交</Button>
            <Button onClick={this.back} style={{marginLeft: 30}}>返 回</Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default withRouter(Form.create()(EditWork));