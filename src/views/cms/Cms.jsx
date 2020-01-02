import React, { Component } from "react";
import "./Cms.scss";
import store from "../../store/store";
import HTTP from "../../script/service";
import { ListView, Carousel } from "antd-mobile";
import TabBar from "../../components/tabBar/TabBar";
import NavBar from "../../components/navBar/NavBar";


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
});
export default class Cms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banner: [],
      dataSource,
      isLoading: false,
      hasMore: true,
      pageNum: 1,
      base: store.getState(),
      allData: [],
      cats: []
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
    //资讯
    HTTP._get_act_cats({
      article_cat_id: "170519100317044",
      limit: 20
    }).then(res => {
      this.setState({
        cats: res.data
      });
      this.setSelCat(res.data[0]);
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
    const { isLoading, hasMore, banner, selCat } = this.state;
    console.log(selCat)
    if (isLoading) return;
    if (!hasMore) return;
    HTTP._get_act_list({
      pageSize: 5,
      type: "news",
      cat_id: selCat.article_cat_id,
      pageNum: this.state.pageNum
    }).then(res => {
      if (res.code === 0 && res.data.rows) {
        const allData = this.state.allData.concat(res.data.rows);
        let more = allData.length < res.data.total ? true : false;
        if (banner.length == 0) {
          this.setState({
            banner: [...res.data.rows]
          });
        }
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
  //资讯详情
  toCms = cms => {
    this.props.history.push(`/cm/${cms.article_id}`);
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
  render() {
    const { cats, selCat } = this.state;
    //列表项
    const row = rowData => {
      return (
        <div className="book" key={rowData.article_id}>
          <div className="book-row" onClick={this.toCms.bind(this, rowData)}>
            <div className="detail">
              <div className="name">{rowData.article_title}</div>
              <div className="time">{rowData.publish_time}</div>
            </div>
            <div className="cover">
              <img src={this.transImgUrl(rowData.cover_url_small)} alt="" />
            </div>
          </div>
        </div>
      );
    };
    return (
      <div>
          <NavBar title="返回" base={this.state.base} reback={true} />
        <div className="cms-page-content">

          <div className="cms-content">
            <div className="left-menu">
              {cats && selCat ? (
                <div className="menu-parent">
                  {cats.map((item, index) => {
                    return (
                      <span
                        className={
                          selCat.article_cat_id === item.article_cat_id ? "menu active" : "menu"
                        }
                        key={index}
                        onClick={this.setSelCat.bind(this, item)}
                      >
                        {item.article_cat_name}
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
                  height: "100%",
                  width: "100%"
                }}
              />
            </div>
          </div>
        </div>
        <TabBar type="books" />
      </div>
    );
  }
}
