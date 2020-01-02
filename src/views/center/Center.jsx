import React, { Component } from "react";
import store from "../../store/store";
import { List, Toast } from "antd-mobile";
import HTTP from "../../script/service";
import Util from "../../script/util";
import TabBar from "../../components/tabBar/TabBar";
import "./Center.scss";

const Item = List.Item;
export default class Center extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState()
    };
    store.subscribe(this.storeChange);
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  componentWillMount() {
    const account = Util.readCookie("account");
    const pwd = Util.readCookie("pwd");
    if (account && pwd && !this.state.base.userInfo) {
      Toast.loading("正在加载...", 0);
      setTimeout(this.changeUserState, 1000);
    } else {
      this.changeUserState();
    }
  }
  changeUserState = () => {
    if (this.state.base.userInfo) {
      HTTP._read_count().then(res => {
        Toast.hide();
        if (res.code === 0) {
          this.setState({
            read: res.data
          });
        }
      });
    } else {
      Toast.hide();
      this.props.history.replace("/login");
    }
  };
  //更新store
  storeChange = () => {
    this.setState({
      base: store.getState()
    });
  };
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
  toMyShelf = () => {
    this.props.history.push('/shelf');
  }
  toAsc = () => {
    this.props.history.push('/asc');
  }
  toVsc = () => {
    this.props.history.push('/vsc');
  }
  toRevews = () => {
    this.props.history.push('/revews');
  }
  toSeting = () => {
    this.props.history.push('/seting');
  }
  render() {
    const { base, read } = this.state;
    const userInfo = base.userInfo;
    return (
      <div className="center-all">
        <div className="center-content">
          <div className="center-header">
            <div className="header-content">
              <div className="cover">
                <img alt="" src={this.transImgUrl(userInfo ? userInfo.icon : "")} />
              </div>
              <div className="row-1">{userInfo ? userInfo.nick_name : ""}</div>
              <div className="row-2">
                {userInfo && userInfo.sign ? userInfo.sign : "你还没有设置签名"}
              </div>
              <ul>
                <li>
                  <h3>{read ? read.todayTime : 0}min</h3>
                  <p>今日已读</p>
                </li>
                <li>
                  <h3>{read ? read.allTime : 0}h</h3>
                  <p>累计时长</p>
                </li>
                <li>
                  <h3>{read ? read.reviewNum : 0}本</h3>
                  <p>已读图书</p>
                </li>
                <li>
                  <h3>{read ? read.rank : '无'}</h3>
                  <p>阅读排名</p>
                </li>
              </ul>
            </div>
          </div>
          <List>
            <Item
              thumb={<span className="icon iconfont icon-shuben" />}
              arrow="horizontal"
              onClick={this.toMyShelf}
            >
              我的书架
            </Item>
            <Item
              thumb={<span className="icon iconfont icon-huaban" />}
              onClick={this.toAsc}
              arrow="horizontal"
            >
              听书收藏
            </Item>
            <Item
              thumb={<span className="icon iconfont icon-shipin" />}
              onClick={this.toVsc}
              arrow="horizontal"
            >
              视频收藏
            </Item>
            <Item
              thumb={<span className="icon iconfont icon-liuyan" />}
              onClick={this.toRevews}
              arrow="horizontal"
            >
              我的评论
            </Item>
            <Item
              thumb={<span className="icon iconfont icon-setting" />}
              onClick={this.toSeting}
              arrow="horizontal"
            >
              设置
            </Item>
          </List>
        </div>
        <TabBar type="" />
      </div>
    );
  }
}
