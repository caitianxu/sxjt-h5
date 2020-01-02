import React, { Component } from "react";
import NavBar from "../../components/navBar/NavBar";
import store from "../../store/store";
import Util from "../../script/util";
import HTTP from "../../script/service";
import { Checkbox, Toast } from "antd-mobile";
import "./Revews.scss";

export default class Revews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      rows: null,
      edit: false
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
      this.getAllReviews();
    } else if (account && pwd) {
      Toast.loading("正在加载...", 0);
      setTimeout(this.getAllReviews, 1000);
    }
  }
  getAllReviews = () => {
    HTTP._member_review_list({
      pageNum: 1,
      pageSize: 100
    }).then(res => {
      Toast.hide();
      if (res.data && res.data.rows) {
        this.setState({
          rows: res.data.rows
        });
      }
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
  chengEdit = () => {
    let { rows } = this.state;
    rows.forEach((item, index) => {
      item.checked = false;
    });
    this.setState({
      rows: [...rows],
      edit: !this.state.edit
    });
  };
  changeChecked = (index, e) => {
    let { rows } = this.state;
    rows[index].checked = !rows[index].checked;
    this.setState({
      rows: [...rows]
    });
  };
  delAll = () => {
    let sels = this.state.rows.filter((item, index) => item.checked);
    let arr = [];
    sels.forEach((item, index) => {
      arr.push(item.review_id);
    });
    if (sels.length > 0) {
      HTTP._delete_reviews({
        review_ids: arr.toString()
      }).then(res => {
        this.getAllReviews();
      });
    } else {
      Toast.fail("请选择需要删除的评论");
    }
  };
  toBookInfo = book => {
    this.props.history.push(`/book/${book.book_id}`);
  };
  render() {
    const { edit, rows } = this.state;
    const sels = rows ? rows.filter((item, index) => item.checked) : [];
    return (
      <div>
        <NavBar
          title="我的评论"
          base={this.state.base}
          reback={true}
          action={
            <span className="clear" onClick={this.chengEdit}>
              {edit ? "取消" : "编辑"}
            </span>
          }
        />
        <div className="rms-plan">
          {rows && rows.length > 0 ? (
            <span>
              {rows.map((item, index) => {
                return (
                  <div className="rim" key={"kk" + index}>
                    {edit ? (
                      <div className="action">
                        <Checkbox
                          checked={item.checked}
                          onChange={this.changeChecked.bind(this, index)}
                        />
                      </div>
                    ) : null}
                    <div className="detail" onClick={this.toBookInfo.bind(this, item)}>
                      <div className="row">
                        <div className="title">《{item.book_name}》</div>
                        <label className="num">{item.create_time.substr(0, 10)}</label>
                      </div>
                      <div className="remark">{item.review_content}</div>
                    </div>
                  </div>
                );
              })}
            </span>
          ) : null}
        </div>
        {edit ? (
          <div className="fix-foot-action" onClick={this.delAll}>
            删除{sels.length}条评论
          </div>
        ) : null}
      </div>
    );
  }
}
