import React, { Component } from "react";
import store from "../../store/store";
import TabBar from "../../components/tabBar/TabBar";
import NavBar from "../../components/navBar/NavBar";
import HTTP from "../../script/service";
import { ListView } from "antd-mobile";
import "./Books.scss";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
});
export default class Books extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource,
      isLoading: false,
      hasMore: true,
      pageNum: 1,
      base: store.getState(),
      allData: [],
      cats: []
      // cats: [
      //   {
      //     book_cat_id: "0",
      //     book_cat_name: "热门图书"
      //   },
      //   {
      //     book_cat_id: "-1",
      //     book_cat_name: "最新推荐"
      //   }
      // ]
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
  //图书详情
  toBookInfo = book => {
    if (this.state.base.userInfo) {
      this.props.history.push(`/book/${book.book_id}`);
    } else {
      this.props.history.push("/login");
    }
  };
  componentWillMount() {
    HTTP._get_book_cats().then(res => {
      if (res.code === 0) {
        const cats = this.state.cats.concat(res.data);
        this.setState({
          cats: cats
        });
        this.setSelCat(cats[0]);
      }
    });
  }
  //设置分类
  setSelCat = item => {
    this.setState(
      {
        dataSource: this.state.dataSource.cloneWithRows([]),
        selCat: item,
        allData: [],
        pageNum: 1,
        isLoading: false,
        hasMore: true
      },
      () => {
        this.loadMoreData();
      }
    );
  };
  //加载列表数据
  loadMoreData = () => {
    const { isLoading, hasMore } = this.state;
    if (isLoading) return;
    if (!hasMore) return;
    HTTP._get_book_list({
      pageSize: 10,
      pageNum: this.state.pageNum,
      book_cat_id: this.state.selCat.book_cat_id
    }).then(res => {
      if (res.code === 0 && res.data.rows) {
        const allData = this.state.allData.concat(res.data.rows);
        let more = allData.length < res.data.total ? true : false;
        this.setState({
          hasMore: more,
          isLoading: false,
          allData: allData,
          dataSource: this.state.dataSource.cloneWithRows(allData)
        });
      } else {
        this.setState({
          hasMore: false,
          isLoading: false
        });
      }
    });
  };
  //滚动加载
  onEndReached = () => {
    if (this.state.isLoading || !this.state.hasMore) {
      return;
    }
    this.setState({
      pageNum: this.state.pageNum + 1
    });
    this.loadMoreData();
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
  render() {
    const { cats, selCat } = this.state;
    //列表项
    const row = rowData => {
      return (
        <div className="book" key={rowData.book_cat_id}>
          <div className="book-row" onClick={this.toBookInfo.bind(this, rowData)}>
            <div className="cover">
              <img src={this.transImgUrl(rowData.book_cover_small)} alt="" />
            </div>
            <div className="detail">
              <h3 className="name">{rowData.book_name}</h3>
              <div className="remark">{rowData.book_remark}</div>
              <div className="author">{rowData.book_author}</div>
            </div>
          </div>
        </div>
      );
    };
    return (
      <div>
        <NavBar title="图书" base={this.state.base} reback={false} />
        <div className="book-page-content">
          <div className="left-menu">
            {cats && selCat ? (
              <div className="menu-parent">
                {cats.map((item, index) => {
                  return (
                    <span
                      className={selCat.book_cat_id === item.book_cat_id ? "menu active" : "menu"}
                      key={index}
                      onClick={this.setSelCat.bind(this, item)}
                    >
                      {item.book_cat_name}
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className="book-list">
            <ListView
              dataSource={this.state.dataSource}
              onEndReached={this.onEndReached}
              renderRow={row}
              pageSize={10}
              renderFooter={() => (
                <div style={{ padding: 15, textAlign: "center" }}>
                  {this.state.isLoading || this.state.hasMore ? "加载中..." : "没有更多内容了"}
                </div>
              )}
              style={{
                height: "calc(100vh - 95px)",
                width: "100%"
              }}
            />
          </div>
        </div>
        <TabBar type="books" />
      </div>
    );
  }
}
