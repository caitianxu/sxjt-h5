import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import HTTP from "../../script/service";
import Util from "../../script/util";
import { Icon, Toast } from "antd-mobile";
import { _set_user_info } from "../../store/Action";
import "./Login.scss";

export default class Login extends Component {
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
  //登录
  onSubmitForm = () => {
    const { param } = this.state;
    if (!param.account) {
      Toast.offline("请输入账号.");
      return false;
    }
    if (!param.pwd || param.account.pwd < 6) {
      Toast.offline("请输入密码.");
      return false;
    }
    Toast.loading("正在登录...", 0);
    HTTP._login({
      account: param.account,
      pwd: param.pwd
    }).then(res => {
      Toast.hide();
      if (res.code === 0) {
        Util.setCookie("account", param.account);
        Util.setCookie("pwd", param.pwd);
        _set_user_info(res.data, ()=> {
          this.props.history.replace("/center");
        });
      } else {
        Toast.fail(res.message);
        Util.delCookie("account");
        Util.delCookie("pwd");
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
          <span className="reback" onClick={this.goBack}>
            <Icon type="left" size="lg" />
          </span>
          <h3>用户登录</h3>
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
          <button onClick={this.onSubmitForm}>登录</button>
          <div className="link-row">
            <NavLink to="/registe">没有账号，立即注册</NavLink>
          </div>
        </div>
        <div className="login-footer">2017-2019 @ All Rights Reservd By 微悦读</div>
      </div>
    );
  }
}
