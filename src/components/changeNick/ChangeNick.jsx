import React, { Component } from "react";
import { Icon, Button, Toast } from "antd-mobile";
import "./ChangeNick.scss";
import { _set_user_info } from "../../store/Action";
import HTTP from "../../script/service";

export default class ChangeNick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      nick: null
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
      nick: this.props.base.userInfo.nick_name
    });
  };
  //文本值变更
  formChange = e => {
    this.setState({
      nick: e.target.value
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
      nick: null
    });
  };
  submitForm = () => {
    const {nick} = this.state;
    if(!nick){
      Toast.info('请填写昵称');
      return;
    }
    Toast.loading('正在修改昵称...', 0);
    HTTP._modify_user_info({
      nickName: nick
    }).then(res => {
      if(res.code === 0 && res.data){
        _set_user_info(res.data);
        Toast.hide();
        this.hideModal();
      }
    })
  }
  render() {
    const { visible, nick } = this.state;
    return (
      <span>
        {visible ? (
          <div className="nick-fix">
            <div className="line-nav">
              <span className="reback" onClick={this.hideModal}>
                <Icon type="left" size="lg" />
              </span>
              <h3>修改昵称</h3>
            </div>

            <div className="cform">
              <input type="text" onChange={this.formChange} placeholder="请输入昵称" maxLength="16" defaultValue={nick} />
            </div>

            <div className="caction">
              <Button type="ghost" onClick={this.submitForm}>修改</Button>
            </div>
          </div>
        ) : null}
      </span>
    );
  }
}
