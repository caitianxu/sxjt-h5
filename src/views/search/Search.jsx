import React, { Component } from "react";
import store from "../../store/store";
import HTTP from "../../script/service";
import { ListView, Icon, Toast } from "antd-mobile";
import "./Search.scss";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
});
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource,
      base: store.getState(),
      isLoading: false,
      hasMore: true,
      pageNum: 1,
      allData: null,
      searchText: ""
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
    HTTP._get_search_key_list({
      display: 30
    }).then(res => {
      console.log("关键词", res);
      this.setState({
        keys: res.data
      });
    });
  }
  setSearch = key => {
    this.setState(
      {
        searchText: key,
        pageNum: 1,
        allData: null
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
    Toast.loading("正在加载...", 0);
    HTTP._get_book_list({
      pageSize: 10,
      pageNum: this.state.pageNum,
      searchText: this.state.searchText
    }).then(res => {
      if (res.code === 0 && res.data.rows) {
        let { allData } = this.state;
        if (!allData) allData = [];
        allData = allData.concat(res.data.rows);
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
      Toast.hide();
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
  //图书详情
  toBookInfo = book => {
    if (this.state.base.userInfo) {
      this.props.history.push(`/book/${book.book_id}`);
    } else {
      this.props.history.push("/login");
    }
  };
  //回退
  goback = () => {
    this.props.history.goBack();
  };
  //搜索
  searchList = e => {
    Toast.loading("正在搜索...", 0);
    this.setState(
      {
        isLoading: false,
        hasMore: true,
        pageNum: 1,
        allData: [],
        searchText: this.searchInput.value
      },
      () => {
        this.loadMoreData();
      }
    );
    this.searchInput.blur();
  };
  seachChange = e => {
    this.setState({
      searchText: e.target.value
    });
  };
  render() {
    const { allData, keys } = this.state;
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
      <div className="search-page">
        <div className="search-nav">
          <span className="reback" onClick={this.goback}>
            <Icon size="lg" type="left" />
          </span>
          <form action="javascript:;" className="form" id="searchFrom" onSubmit={this.searchList}>
            <input
              type="search"
              placeholder="搜索图书名称/作者"
              value={this.state.searchText}
              onChange={this.seachChange}
              ref={el => (this.searchInput = el)}
            />
          </form>
        </div>
        <div className="book-list">
          {allData ? (
            <ListView
              dataSource={this.state.dataSource}
              onEndReached={this.onEndReached}
              renderRow={row}
              pageSize={10}
              renderFooter={() => (
                <div style={{ padding: 50, textAlign: "center" }}>
                  {this.state.isLoading
                    ? "加载中..."
                    : allData.length
                    ? "没有更多书籍了"
                    : "没有找到相关书籍"}
                </div>
              )}
              style={{
                height: "calc(100vh - 45px)",
                width: "100%"
              }}
            />
          ) : (
            <div className="keys">
              {keys &&
                keys.map((key, index) => {
                  return (
                    <span key={`key-${index}`} onClick={this.setSearch.bind(this, key.name)}>
                      {key.name}
                    </span>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    );
  }
}
