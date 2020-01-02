import React, { Component } from "react";
import store from "../../store/store";
import Util from "../../script/util";
import { NavLink } from "react-router-dom";
import TabBar from "../../components/tabBar/TabBar";
import { Toast, Button, Modal } from "antd-mobile";
import HTTP from "../../script/service";
import Video from "../../components/video/Video";
import "./videoSc.scss";

export default class videoSc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      books: null
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
  componentWillMount() {
    const account = Util.readCookie("account");
    const pwd = Util.readCookie("pwd");
    if (this.state.base.userInfo) {
      this.getMyShelf();
    } else if (account && pwd) {
      Toast.loading("正在加载...", 0);
      setTimeout(this.getMyShelf, 1000);
    }
  }
  getMyShelf = () => {
    HTTP._get_collect_list({
      type: 1,
      pageNum: 1,
      pageSize: 100
    }).then(res => {
      if (res.data && res.data.rows) {
        this.setState({
          books: res.data.rows
        });
      }
      Toast.hide();
    });
  };
  toLogin = () => {
    this.props.history.push("/login");
  };
  toBooks = () => {
    this.props.history.push("/books");
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
  delAll = () => {
    Modal.alert("提示", "你确定要清空书架吗?", [
      { text: "取消" },
      {
        text: "确定",
        onPress: () => {
          this.state.books.forEach((item, index) => {
            if (item) {
              HTTP._add_collect({
                type: 1,
                media_id: item.video_id
              }).then(res => {
                this.getMyShelf();
              });
            }
          });
        }
      }
    ]);
  };
  //视频详情
  toVideo = video => {
    this.videoElement.showModal(video);
  }
  render() {
    const { userInfo } = this.state.base;
    const { books } = this.state;
    return (
      <div>
        <div className="page-top-nav">
          <NavLink to="/shelf" className="nav-item">图书</NavLink>
          <NavLink to="/asc" className="nav-item">听书</NavLink>
          <span className="nav-item active">视频</span>
        </div>
        <div className="page-content-new">
          {userInfo ? (
            <span>
              {books && books.length > 0 ? (
                <div className="videoscs">
                  {books.map((book, index) => {
                    if (book) {
                      return (
                        <div className="book" key={index}>
                          <div className="cover" onClick={this.toVideo.bind(this, book)}>
                            <img alt="" src={this.transImgUrl(book.cover_url_small)} />
                          </div>
                          <p className="name">{book.video_title}</p>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              ) : (
                <div className="un-data">
                  <p>没有视频收藏</p>
                </div>
              )}
            </span>
          ) : (
            <div className="un-data">
              <p>你还没有登录</p>
              <div className="ac">
                <Button type="ghost" inline size="small" onClick={this.toLogin}>
                  立即登录
                </Button>
              </div>
            </div>
          )}
        </div>
        <TabBar type="shelf" />
        <Video base={this.state.base} ref={el => (this.videoElement = el)} />
      </div>
    );
  }
}
