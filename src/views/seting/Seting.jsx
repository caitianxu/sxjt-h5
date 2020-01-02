import React, { Component } from "react";
import NavBar from "../../components/navBar/NavBar";
import store from "../../store/store";
import config from "../../script/config";
import HTTP from "../../script/service";
import { Button, Toast, List, Picker, Modal } from "antd-mobile";
import { _set_user_info, _clear_user_info } from "../../store/Action";
import Upload from "antd-mobile-upload";
import ChangeNick from "../../components/changeNick/ChangeNick";
import Sign from "../../components/sign/Sign";
import "./Seting.scss";

const Item = List.Item;
const colors = [
  {
    label: "男",
    value: "1"
  },
  {
    label: "女",
    value: "2"
  }
];
export default class Seting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState()
    };
    store.subscribe(this.storeChange);
  }
  //更新store
  storeChange = () => {
    this.setState({
      base: store.getState()
    });
  };
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  //图片地址处理
  transImgUrl = url => {
    if (!url || url === "" || url === "/assets/img/icon-user.png") {
      return "/assets/img/icon-user.png";
    } else if (url.indexOf("http") !== -1 || url.indexOf("https") !== -1) {
      return url;
    } else if (url.indexOf("/assets/img/") !== -1) {
      return url;
    } else {
      return this.state.base.prefix + url;
    }
  };
  onSuccessFile = e => {
    if (e.code === 0 && e.data.length > 0) {
      HTTP._update_icon({
        icon: e.data[0].url
      }).then(res => {
        _set_user_info(res.data);
        Toast.hide();
      });
    }
  };
  openUploadFile = e => {
    document.querySelector("#uploadElement a").click();
  };
  onStart = () => {
    Toast.loading("正在上传...", 0);
  };
  showNickModal = () => {
    this.ChangeNickElement.showModal();
  };
  onChangeColor = e => {
    HTTP._modify_user_info({
      sex: e[0]
    }).then(res => {
      if (res.code === 0 && res.data) _set_user_info(res.data);
    });
  };
  changeSign = () => {
    this.ChangeSignElement.showModal();
  };
  loginup = () => {
    Modal.alert("提示", "你确定退出登录吗?", [
      { text: "取消" },
      {
        text: "确定",
        onPress: () => {
          _clear_user_info(() => {
            this.props.history.replace('/index');
          });
        }
      }
    ]);
  }
  render() {
    const { userInfo } = this.state.base;
    return (
      <div>
        <NavBar
          title="设置"
          base={this.state.base}
          reback={true}
          action={<span className="clear" />}
        />
        <div className="seting-content">
          {userInfo ? (
            <List className="my-list">
              <Item extra={userInfo.id}>账号ID</Item>
              <Item
                extra={
                  <img
                    alt=""
                    style={{ borderRadius: "50%" }}
                    src={this.transImgUrl(userInfo.icon)}
                  />
                }
                arrow="horizontal"
                onClick={this.openUploadFile}
              >
                头像
              </Item>
              <Item extra={userInfo.nick_name} arrow="horizontal" onClick={this.showNickModal}>
                昵称
              </Item>
              <Picker
                data={colors}
                value={[userInfo.sex ? userInfo.sex.toString() : "0"]}
                cols={1}
                onChange={this.onChangeColor}
              >
                <Item arrow="horizontal">性别</Item>
              </Picker>
              <List.Item
                extra={userInfo.sign ? userInfo.sign : "无"}
                arrow="horizontal"
                onClick={this.changeSign}
              >
                个性签名
              </List.Item>
            </List>
          ) : null}
          <div style={{ display: "none" }} id="uploadElement">
            <Upload
              multiple
              accept="image/jpeg,image/jpg,image/png"
              action={`${config.ctxPath}/file/upload`}
              onSuccess={this.onSuccessFile}
              onStart={this.onStart}
            />
          </div>
          <div className="action">
            <Button type="warning" onClick={this.loginup}>注销</Button>
          </div>
        </div>
        <ChangeNick ref={el => (this.ChangeNickElement = el)} base={this.state.base} />
        <Sign ref={el => (this.ChangeSignElement = el)} base={this.state.base} />
      </div>
    );
  }
}
