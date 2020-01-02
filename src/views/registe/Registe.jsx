import React, { Component } from "react";
import HTTP from "../../script/service";
import { Icon, Toast } from "antd-mobile";
import "./Registe.scss";

export default class Registe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      param: {}
    };
  }
  //文本值变更
  changeFormValue = e => {
    let { param } = this.state;
    param[e.target.name] = e.target.value;
    this.setState({
      param: param
    });
  };
  //注册
  submitForm = () => {
    const { param } = this.state;
    if (!param.account || param.account.length < 5) {
      Toast.offline("请输入账号，5-15个字符长度.");
      return false;
    }
    if (!param.pwd || param.account.pwd < 6) {
      Toast.offline("请输入密码，6-15个字符长度.");
      return false;
    }
    if (param.pwd !== param.pwd1) {
      Toast.offline("两次密码输入不一致.");
      return false;
    }
    Toast.loading("正在注册账号...", 0);
    HTTP._registe({
      account: param.account,
      pwd: param.pwd
    }).then(res => {
      Toast.hide();
      if (res.code === 0) {
        Toast.success("恭喜，账号注册成功", 2, () => {
          this.props.history.push("/login");
        });
      } else {
        Toast.fail(res.message);
      }
    });
  };
  goBack = () => {
    this.props.history.goBack();
  };
  render() {
    return (
      <div className="page-login">
        <div className="line-nav">
          <span className="reback">
            <Icon type="left" size="lg" onClick={this.goBack} />
          </span>
          <h3>用户注册</h3>
        </div>
        <div className="login-form">
          <div className="form-row">
            <label>账号</label>
            <input
              type="text"
              name="account"
              placeholder="请输入账号"
              maxLength="15"
              onChange={this.changeFormValue}
            />
          </div>
          <div className="form-row">
            <label>密码</label>
            <input
              type="password"
              name="pwd"
              placeholder="请输入密码"
              maxLength="15"
              onChange={this.changeFormValue}
            />
          </div>
          <div className="form-row">
            <label>确认密码</label>
            <input
              type="password"
              name="pwd1"
              placeholder="请输入密码"
              maxLength="15"
              onChange={this.changeFormValue}
            />
          </div>
          <button onClick={this.submitForm}>立即注册</button>
        </div>
        <div className="login-footer">2017-2019 @ All Rights Reservd By 微悦读</div>
      </div>
    );
  }
}
