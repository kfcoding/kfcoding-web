import React from 'react';
import {Card, Form, Input, Button, message, DatePicker} from 'antd';
import {withRouter} from 'react-router-dom';
import { createWork, updateWork } from "services/course";
import { getWork } from "../../../../services/work";
import moment from 'moment';

const FormItem = Form.Item;

const templateList = [
  {
    id: '1001',
    name: 'C++',
    image: 'daocloud.io/shaoling/workspace-cpp:4c1c190',
    logo: '/C++.png',
  },
  {
    id: '1002',
    name: 'Python',
    image: 'kfcoding/workspace-python',
    logo: '/Python.png',
  },
  {
    id: '1003',
    name: 'NodeJs',
    image: 'kfcoding/workspace-node',
    logo: '/NodeJs.png',
  },
  {
    id: '1004',
    name: 'HTML5',
    image: 'kfcoding/workspace-html5',
    logo: '/HTML5.png',
  },
];

class EditWork extends React.Component {
  state = {
    work: {},
    image: ''
  }

  componentDidMount() {
    getWork(this.props.match.params.work_id).then(res => {
      this.setState({work: res.data.result.work});
      this.setState({image: res.data.result.work.image})
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.id = this.props.match.params.work_id;
        values.image = this.state.image;
        values.startTime = values.beginend[0];
        values.endTime = values.beginend[1];
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


  handleButtonClick = (image) => {
    console.log(image);
    this.setState({
      image: image
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
          <FormItem {...formItemLayout} label="项目地址（可选）">
            {getFieldDecorator('repo', {
              initialValue: this.state.work.repo
            })(<Input placeholder="Git地址"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="模板">
            <div style={{width: '400px'}}>
              {templateList.map(item => (
                <div className={this.state.image === item.image ? 'cardInfo' : 'card'}>
                  <div className='cardItem' onClick={() => {
                    this.handleButtonClick(item.image)
                  }}>
                    <div className='cardButton' style={{backgroundImage: "url(" + item.logo + ")"}}></div>
                    <h6 style={{textAlign: 'center', marginTop: '-20px'}}>{item.name}</h6>
                  </div>
                </div>
              ))}
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="起止时间"
          >
            {getFieldDecorator('beginend', {
              initialValue: [moment(this.state.work.startTime), moment(this.state.work.endTime)]
            })(
              <DatePicker.RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                allowClear
              />
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