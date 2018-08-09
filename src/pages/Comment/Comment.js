import React from 'react';
import { List, Card, Form, Icon, Avatar, Button, Spin, Input  } from 'antd';
import reqwest from 'reqwest';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
const { TextArea } = Input;
const FormItem = Form.Item;

const CommentForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      comment: Form.createFormField({
        ...props.comment,
        value: props.comment.value,
      })
    };
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})((props) => {
  const { getFieldDecorator } = props.form;
  return (
    <Form>
      <FormItem>
        {getFieldDecorator('comment')(
          <TextArea rows={6} placeholder="写评论……"/>
        )}
      </FormItem>
    </Form>
  );
})

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],

      fields: {
        comment:{value:''}
      }
    };
  }

  componentDidMount() {
    this.getData((res) => {
      this.setState({
        loading: false,
        data: res.results,
      });
    });
  }

   handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }

  getData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  }

  handleSubmit = () => {
    let data = {
      comment: this.state.fields.comment.value
    };
  }

  render() {
    const { data } = this.state;
    let valid = this.state.fields.comment.value  ? true : false;

    return (
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '8px 32px 32px 32px' }}
      >
        <List
          className="demo-loadmore-list"
          split={false}
          itemLayout="horizontal"
          dataSource={data}
          footer={
            <div>
              <CommentForm {...this.state.fields} onChange={this.handleFormChange} />
              <FormItem>
                <Button type="primary" htmlType="submit" onClick={this.handleSubmit} disabled={!valid}>提交</Button>
              </FormItem>
            </div>
          }
          renderItem={item => (
            <List.Item actions={[<a>回复</a>,<a>编辑</a>,<a>删除</a>]}>
              <List.Item.Meta
                avatar={<Avatar src="/favicon.ico" />}
                title={
                  <div>
                    <a href="https://ant.design" style={{fontSize:16,color:'#000',textDecorationLine:'none'}}>{item.name.last}</a>
                    &nbsp;&nbsp;&nbsp;
                    <span style={{color:"#CCC"}}>一个月前</span>
                  </div>
                }
                description={
                  <div>
                    <div style={{width:485,paddingTop:6, paddingLeft:16, paddingBottom:6, color:"#8C8C8C", backgroundColor:"#F9F9F9", marginTop:10}}>
                      回复 <a>@Carrie</a>
                    </div>
                    <div style={{lineHeight: 2, width: 500, marginTop:15, color:'#595959'}}>
                      段落示意：Kfcoding真好玩！
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  }
}

export default Comment;