import React, { Component } from "react";
import NavBar from "../../components/navBar/NavBar";
import store from "../../store/store";
import HTTP from "../../script/service";
import Util from "../../script/util";
import CmsReview from "../../components/cmsReview/CmsReview";
import { Toast } from "antd-mobile";
import "./Cm.scss";

export default class Cm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      cmsReview: null,
      data: null,
      reviewParam: {
        pageNum: 1,
        total: 0,
        pageSize: 5,
        article_id: null,
        more: true
      }
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
    if (account && pwd && !this.state.base.userInfo) {
      Toast.loading("正在加载...", 0);
      setTimeout(() => {
        this.getNewsDetail(this.props.match.params.cid);
      }, 1000);
    } else {
      this.getNewsDetail(this.props.match.params.cid);
    }
  }
  getNewsDetail = cid => {
    HTTP._get_news_detail({
      article_id: cid
    }).then(res => {
      this.setState(
        {
          data: res.data,
          cid: cid,
          cmsReview: null
        },
        () => {
          this.reloadReview();
        }
      );
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
  //获取评论
  getCmsReview = () => {
    let { reviewParam, cmsReview } = this.state;
    console.log('more', reviewParam)
    if (!reviewParam.more) return;
    reviewParam.pageNum += 1;
    HTTP._get_articleReview_list(reviewParam).then(res => {
      console.log("pin", res);
      if (res.data) {
        if (!cmsReview) cmsReview = [];
        cmsReview = cmsReview.concat(res.data.rows);
        reviewParam.total = res.data.total;
        if (cmsReview.length < res.data.total) {
          reviewParam.more = true;
        } else {
          reviewParam.more = false;
        }
        this.setState({
          reviewParam: reviewParam,
          cmsReview: cmsReview
        });
      }
    });
  };
  reloadReview = () => {
    let { reviewParam, cid } = this.state;
    reviewParam.pageNum = 0;
    reviewParam.article_id = cid;
    reviewParam.more = true;
    this.setState({
      cmsReview: null,
      reviewParam: { ...reviewParam }
    },() => {
      this.getCmsReview();
    });
  };
  //发送评论
  sendReviewData = () => {
    if (this.state.base.userInfo) {
      this.sendReviewElement && this.sendReviewElement.showModal();
    } else {
      this.props.history.push("/login");
    }
  };
  render() {
    const { data, base, cmsReview, reviewParam } = this.state;
    let cc = "";
    if (data) {
      cc = data.article_content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(
        match,
        capture
      ) {
        // return match.replace(capture, `${base.prefix}${capture}`)
        return `<img src="${base.prefix}${capture}"/>`;
      });
    }
    return (
      <div>
        <NavBar title="返回" base={this.state.base} reback={true} />
        <div className="msg-info">
          {data ? (
            <div>
              <h3 className="msg-title">{data.article_title}</h3>
              <p className="msg-time">{data.publish_time}</p>
              <div className="cms-html" dangerouslySetInnerHTML={{ __html: cc }} />
              <div className="comms">
                <div className="com-title">
                  <label>资讯评论</label>
                  <span onClick={this.sendReviewData}>写评论</span>
                </div>
                {cmsReview && cmsReview.length > 0 ? (
                  <div className="reviews">
                    {cmsReview.map((item, index) => {
                      return (
                        <div className="review" key={"re" + index}>
                          <div className="cover">
                            <img alt="" src={this.transImgUrl(item.icon)} />
                          </div>
                          <div className="ddl">
                            <div className="row-1">
                              <span className="name">{item.nick_name}</span>
                              <label className="time">{item.create_time}</label>
                            </div>
                            <div className="row-2">{item.review_content}</div>
                          </div>
                        </div>
                      );
                    })}
                    {reviewParam.more ? (
                      <div className="more-data" onClick={this.getCmsReview}>
                        查看更多评论({reviewParam.total})
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="not-data">还没有评论</div>
                )}
              </div>
              <div className="copy">2017-2019 @ All Rights Reservd By 微悦读</div>
            </div>
          ) : null}
        </div>
        {data ? (
          <CmsReview
            base={this.state.base}
            reload={this.reloadReview}
            cid={this.state.cid}
            ref={el => (this.sendReviewElement = el)}
          />
        ) : null}
      </div>
    );
  }
}
