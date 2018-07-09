import React from 'react';
import { Layout, Divider, Button, Steps, message, Form, Input, Upload, Icon, Tag, Modal, Switch } from 'antd';
import {inject, observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import { createKongfu, getKongfu, getTags, updateKongfu } from "services/kongfu";
import Book from "components/Book";

const FormItem = Form.Item;
const { CheckableTag } = Tag;
const { Content, Sider } = Layout;

class MyTag extends React.Component {

  state = { checked: this.props.checked == true ? true : false };
  handleChange = (checked) => {
    this.setState({ checked });
    this.props.onChange(this.props.tag, checked)
  }
  render() {console.log(this.props.checked)
    return <CheckableTag {...this.props} checked={this.props.checked} onChange={this.handleChange} />;
  }
}

const BasicForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      title: Form.createFormField({
        ...props.title,
        value: props.title.value,
      }),
      brief: Form.createFormField({
        ...props.brief,
        value: props.brief.value
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
      <FormItem
        label='秘籍名称'
        required
      >
        {getFieldDecorator('title', {
          rules: [{required: true, message: '秘籍名称不能为空'}],
        })(
          <Input/>
        )}
      </FormItem>
      <FormItem
        label='秘籍描述'
        required
      >
        {getFieldDecorator('brief', {
          rules: [{required: true, message: '秘籍描述不能为空'}],
        })(
          <Input/>
        )}
      </FormItem>
    </Form>
  );
})

@inject('store')
  @observer
class KongfuSettings extends React.Component {
  constructor(props) {
    super(props);
console.log(this.props.book)
    this.state = {
      kongfu_id: this.props.book.id,
      kongfu: this.props.book,
      tags: [],

      fields: {
        title: {
          value: ''
        },
        brief: '',
        surfaceImage: '',
        surfaceBackground: '',
        tags: []
      },
      status: 'public'
    }
  }

  componentDidMount() {
    let {book} = this.props;
    this.setState({fields: {
            title: {value: book.title},
            brief: {value: book.brief},
            tags: book.tags
          }});
    // getKongfu(this.state.kongfu_id).then(res => {console.log('ok',res.data.result.kongfu.tags);
    //   this.setState({kongfu: res.data.result.kongfu});
    //   this.setState({fields: {
    //     title: {value: res.data.result.kongfu.title},
    //     brief: {value: res.data.result.kongfu.brief},
    //     tags: res.data.result.kongfu.tags
    //   }});
    // })
    getTags().then(res => {
      this.setState({tags: res.data.result.taglist});
    })
  }

  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  }

  changeTag = (tag, checked) => {
    for (var i in this.state.fields.tags) {
      if (this.state.fields.tags[i].id == tag.id) {
        if (!checked) {
          this.state.fields.tags.splice(i, 1);
          this.forceUpdate();
          return;
        }
      }
    }

    this.state.fields.tags.push(tag);
    this.forceUpdate();
  }

  done = () => {
    let data = {
      id: this.state.kongfu.id,
      title: this.state.fields.title.value,
      brief: this.state.fields.brief.value,
      level: 'newbie',
      tags: this.state.fields.tags,
      status: this.state.kongfu.status
    };
    updateKongfu(data).then(res => {
      if (!res.err) {
        message.success('保存成功');
        getKongfu(this.state.kongfu_id).then(res => {console.log('ok',res.data.result.kongfu.tags);
          this.setState({kongfu: res.data.result.kongfu});
          this.setState({fields: {
            title: {value: res.data.result.kongfu.title},
            brief: {value: res.data.result.kongfu.brief},
            tags: res.data.result.kongfu.tags
          }});
        })
      }
    })
  };

  _checkTagChecked = (tag) => {
    for (var i in this.state.fields.tags) {
      if (this.state.fields.tags[i].id == tag.id) {
        console.log('check', tag)
        return true;
      }
    }
    return false;
  }

  onChangePublish = (checked) => {
    let kongfu = this.state.kongfu;
    if (checked) {
      kongfu.status = 'public';
    } else {
      kongfu.status = 'private';
    }
    this.setState({kongfu: kongfu});
  }

  showDeleteConfirm = () => {
    const self = this;
    Modal.confirm({
      title: `确定删除《${this.props.book.title}》？`,
      content: '',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.props.store.currentUser.bookStore.removeBook(self.props.book);
        message.success('删除成功');
        setTimeout(() => {
          self.props.history.push(`/home`)
        }, 2000);
      }
    });
  }


  render() {
    let valid = this.state.fields.title.value && this.state.fields.brief.value && this.state.fields.tags.length ? true : false;

    return (
        <Content style={{ padding: '50px' }}>
          <Layout style={{ padding: '24px 0', background: '#fff' }}>
            <Sider width={300} style={{ background: '#fff', paddingLeft: '30px' }}>
              <div style={{overflow: 'visible', padding: '0 0 30px 0'}}>
                <a href='#' style={{display: 'block'}}>
                  <Book book={this.state.kongfu}/>
                </a>
              </div>
            </Sider>
            <Content>
              <div style={{ background: '#fff', padding: 24, minHeight: 280, overflow: 'auto' }}>
                <BasicForm {...this.state.fields} onChange={this.handleFormChange}/>
                <Form.Item
                  label='选择标签让别人更容易找到它'
                  required
                >
                  <div>
                    {this.state.tags.map((tag, index) => {
                      return <MyTag key={tag.id} tag={tag} onChange={this.changeTag} checked={this._checkTagChecked(tag)}>{tag.name}</MyTag>
                    })}
                  </div>
                </Form.Item>
                <Form.Item
                  label='是否发布'
                >
                  <Switch checked={this.state.kongfu.status == 'public'} onChange={this.onChangePublish} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.done} disabled={!valid} style={{marginRight: 20}}><Icon type="check" />保 存</Button>
                  <Button type='danger' onClick={this.showDeleteConfirm}><Icon type='delete'/>删除秘籍</Button>
                </Form.Item>
              </div>
            </Content>

          </Layout>
        </Content>
    )
  }
}

export default withRouter(KongfuSettings);