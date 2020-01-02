import React, { Component } from "react";
import store from "../../store/store";
import TabBar from "../../components/tabBar/TabBar";
import NavBar from "../../components/navBar/NavBar";
import HTTP from "../../script/service";
import { Toast } from "antd-mobile";
import "./Hot.scss";

export default class Hot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      isLoading: false,
      hasMore: true,
      pageNum: 1,
      allData: []
    };
    store.subscribe(this.storeChange);
  }
  //更新store
  storeChange = () => {
    this.setState(
      {
        base: store.getState()
      },
      () => {
        console.log(this.state);
      }
    );
  };
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  componentWillMount() {
    this.loadMoreData();
  }
  //图书详情
  toBookInfo = book => {
    if (this.state.base.userInfo) {
      this.props.history.push(`/book/${book.book_id}`);
    } else {
      this.props.history.push("/login");
    }
  };
  //加载列表数据
  loadMoreData = () => {
    const { isLoading, hasMore } = this.state;
    Toast.loading("正在加载...", 0);
    if (isLoading) return;
    if (!hasMore) return;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    HTTP._get_book_list({
      pageSize: 9,
      pageNum: this.state.pageNum,
      book_cat_id: 0
    }).then(res => {
      if (res.code === 0 && res.data.rows) {
        const allData = res.data.rows;
        let more = this.state.pageNum * 9 < res.data.total ? true : false;
        this.setState({
          hasMore: more,
          isLoading: false,
          allData: allData
        });
      } else {
        this.setState({
          hasMore: false,
          isLoading: false
        });
      }
      Toast.hide();
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
  reload = () => {
    this.setState(
      {
        pageNum: this.state.pageNum + 1
      },
      () => {
        this.loadMoreData();
      }
    );
  };
  render() {
    return (
      <div>
        <NavBar title="好书推荐" base={this.state.base} reback={false} />
        <div className="hot-page-content">
          <div className="books">
            {this.state.allData.map((item, index) => {
              return (
                <div className={`book-detail index-${index}`} key={index} onClick={this.toBookInfo.bind(this, item)}>
                  <div className="cover">
                    <img alt="" src={this.transImgUrl(item.book_cover_small)} />
                  </div>
                  <div className="detail">
                    <h3>{item.book_name}</h3>
                    <p className="p1">{item.book_author}</p>
                    {index === 0 ? <p className="p2">{item.book_remark}</p> : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="reload-more" onClick={this.reload}>
            <span>
              换一组
              <span className="icon iconfont icon-shuaxin" />
            </span>
          </div>
        </div>
        <TabBar type="books" />
      </div>
    );
  }
}
