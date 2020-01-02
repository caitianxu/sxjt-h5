import React, { Component } from "react";
import TabBar from "../../components/tabBar/TabBar";
import store from "../../store/store";
import Util from "../../script/util";
import { NavLink } from "react-router-dom";
import { Toast, Button, Modal } from "antd-mobile";
import HTTP from "../../script/service";
import "./Shelf.scss";

export default class Shelf extends Component {
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
    HTTP._get_book_shelf().then(res => {
      this.setState({
        books: res.data
      });
      Toast.hide();
    });
  };
  toLogin = () => {
    this.props.history.push("/login");
  };
  toBooks = () => {
    this.props.history.push("/books");
  };
  //图书详情
  toBookInfo = book => {
    if (this.state.base.userInfo) {
      this.props.history.push(`/reader/${book.bk_id}`)
    } else {
      this.props.history.push("/login");
    }
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
  delBookShlef = book => {
    Toast.success('移除成功.')
    HTTP._del_book_shelf({
      book_id: book.bk_id
    }).then(res => {
      this.getMyShelf();
    })
  }
  delAll = () => {
    Modal.alert("提示", "你确定要清空书架吗?", [
      { text: "取消" },
      {
        text: "确定",
        onPress: () => {
          let ps = this.state.books.map(item => item.bk_id);
          Toast.loading("正在删除...", 0);
          HTTP._del_book({
            book_id: ps.toString()
          }).then(res => {
            this.getMyShelf();
          });
        }
      }
    ]);
  };
  render() {
    const { userInfo } = this.state.base;
    const { books } = this.state;
    return (
      <div>
        <div className="page-top-nav">
          <span className="nav-item active">图书</span>
          <NavLink to="/asc" className="nav-item">听书</NavLink>
          <NavLink to="/vsc" className="nav-item">视频</NavLink>
        </div>
        <div className="book-page-content">
          {userInfo ? (
            <span>
              {books && books.length > 0 ? (
                <div className="books">
                  {books.map((book, index) => {
                    return (
                      <div className="book" key={index}>
                        <div className="cover" onClick={this.toBookInfo.bind(this, book)}>
                          <img alt="" src={this.transImgUrl(book.bk_cover_small)} />
                        </div>
                        {/* <p className="name">{book.bk_name}</p> */}
                        <div className="acc"><button onClick={this.delBookShlef.bind(this, book)}>删除</button></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="un-data">
                  <p>你的书架空空</p>
                  <div className="ac">
                    <Button type="ghost" inline size="small" onClick={this.toBooks}>
                      立即添加
                    </Button>
                  </div>
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
      </div>
    );
  }
}
