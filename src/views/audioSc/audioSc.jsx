import React, { Component } from "react";
import store from "../../store/store";
import Util from "../../script/util";
import TabBar from "../../components/tabBar/TabBar";
import { NavLink } from "react-router-dom";
import { Toast, Button, Modal } from "antd-mobile";
import HTTP from "../../script/service";
import Audio from "../../components/audio/Audio";
import "./audioSc.scss";

export default class audioSc extends Component {
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
      type: 2,
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
  //听书详情
  toAudio = audio => {
    this.audioElement.showModal(audio);
  };
  delAll = () => {
    Modal.alert("提示", "你确定要清空收藏吗?", [
      { text: "取消" },
      {
        text: "确定",
        onPress: () => {
          this.state.books.forEach((item, index) => {
            HTTP._add_collect({
              type: 2,
              media_id: item.audio_id
            }).then(res => {
              this.getMyShelf();
            });
          });
        }
      }
    ]);
  };
  delBookShlef = book => {
    Toast.success('移除成功.')
    HTTP._add_collect({
      type: 2,
      media_id: book.audio_id
    }).then(() => {
      this.getMyShelf();
    });
  };
  render() {
    const { userInfo } = this.state.base;
    const { books } = this.state;
    return (
      <div>
        <div className="page-top-nav">
          <NavLink to="/shelf" className="nav-item">
            图书
          </NavLink>
          <span className="nav-item active">听书</span>
          <NavLink to="/vsc" className="nav-item">
            视频
          </NavLink>
        </div>
        <div className="book-page-content">
          {userInfo ? (
            <span>
              {books && books.length > 0 ? (
                <div className="books">
                  {books.map((book, index) => {
                    return (
                      <div className="book" key={index}>
                        <div className="cover" onClick={this.toAudio.bind(this, book)}>
                          <img alt="" src={this.transImgUrl(book.cover_url_small)} />
                        </div>
                        <div className="acc">
                          <button onClick={this.delBookShlef.bind(this, book)}>删除</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="un-data">
                  <p>没有听书收藏</p>
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
        <Audio base={this.state.base} ref={el => (this.audioElement = el)} />
      </div>
    );
  }
}
