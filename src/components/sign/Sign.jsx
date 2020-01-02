import React, { Component } from "react";
import { Icon, Button, Toast } from "antd-mobile";
import "./Sign.scss";
import { _set_user_info } from "../../store/Action";
import HTTP from "../../script/service";

export default class Sign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      sign: null,
      nickName: null
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
      nickName: this.props.base.userInfo.nick_name,
      sign: this.props.base.userInfo.sign
    });
  };
  //文本值变更
  formChange = e => {
    this.setState({
      sign: e.target.value
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
      sign: null
    });
  };
  submitForm = () => {
    const {sign, nickName} = this.state;
    if(!sign){
      Toast.info('请填写签名');
      return;
    }
    Toast.loading('正在修改签名...', 0);
    HTTP._modify_user_info({
      sign: sign,
      nickName: nickName
    }).then(res => {
      if(res.code === 0 && res.data){
        _set_user_info(res.data);
        Toast.hide();
        this.hideModal();
      }
    })
  }
  render() {
    const { visible, sign } = this.state;
    return (
      <span>
        {visible ? (
          <div className="nick-fix">
            <div className="line-nav">
              <span className="reback" onClick={this.hideModal}>
                <Icon type="left" size="lg" />
              </span>
              <h3>修改签名</h3>
            </div>

            <div className="cform">
              <textarea type="text" onChange={this.formChange} placeholder="请输入签名" maxLength="20" defaultValue={sign} />
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
