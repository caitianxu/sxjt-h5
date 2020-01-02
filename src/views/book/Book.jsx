import React, { Component } from "react";
import NavBar from "../../components/navBar/NavBar";
import store from "../../store/store";
import HTTP from "../../script/service";
import Util from "../../script/util";
import { Toast } from "antd-mobile";
import SendReview from "../../components/sendReview/SendReview";
import "./Book.scss";

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      bookReview: null,
      book: null,
      remds: [],
      reviewParam: {
        pageNum: 1,
        total: 0,
        pageSize: 5,
        book_type: 2,
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
        this.getBookDetail(this.props.match.params.bookid);
      }, 1000);
    } else {
      this.getBookDetail(this.props.match.params.bookid);
    }
  }
  //获取详情
  getBookDetail = bookid => {
    HTTP._book_detail({
      bookid: bookid
    }).then(res => {
      Toast.hide();
      if (res.data) {
        this.setState(
          {
            book: res.data,
            bookReview: null,
            reviewParam: {
              book_id: bookid,
              pageNum: 0,
              total: 0,
              pageSize: 5,
              book_type: 2,
              more: true
            }
          },
          () => {
            this.getBookReview();
            this.getRecommends();
          }
        );
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
  //图书推荐
  getRecommends = () => {
    const { book } = this.state;
    HTTP._book_recommends({
      bookid: book.book_id
    }).then(rec => {
      this.setState({
        remds: rec.data
      });
    });
  };
  //图书评论
  getBookReview = () => {
    let { reviewParam, bookReview } = this.state;
    if (!reviewParam.more) return;
    reviewParam.pageNum += 1;
    this.setState({
      reviewParam: { ...reviewParam }
    });
    HTTP._book_reviews(reviewParam).then(res => {
      if (res.data) {
        if (!bookReview) bookReview = [];
        bookReview = bookReview.concat(res.data.rows);
        reviewParam.total = res.data.total;
        if (bookReview.length < res.data.total) {
          reviewParam.more = true;
        } else {
          reviewParam.more = false;
        }
        this.setState({
          reviewParam: reviewParam,
          bookReview: bookReview
        });
      }
    });
  };
  //重新获取评论
  reloadReview = () => {
    this.setState(
      {
        bookReview: null,
        reviewParam: {
          book_id: this.state.book.book_id,
          pageNum: 0,
          total: 0,
          pageSize: 5,
          book_type: 2,
          more: true
        }
      },
      () => {
        this.getBookReview();
      }
    );
  };
  //发送评论
  sendReviewData = () => {
    this.sendReviewElement && this.sendReviewElement.showModal();
  };
  //刷新
  toBookInfo = item => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    this.getBookDetail(item.book_id);
  };
  //加入收藏
  addBookShelf = () => {
    HTTP._add_book_shelf({
      book_id: this.state.book.book_id
    }).then(res => {
      if (res.code === 0) {
        let { book } = this.state;
        book.shelf_id = book.book_id;
        this.setState({
          book: { ...book }
        });
      } else {
        Toast.fail(res.message);
      }
    });
  };
  //立即阅读
  toReader = () => {
    const { book } = this.state;
    this.props.history.push(`/reader/${book.book_id}`)
  }
  render() {
    const { book, bookReview, remds, reviewParam } = this.state;
    return (
      <div className="book-page">
        <NavBar title="返回" base={this.state.base} reback={true} />
        <div className="book-page-content">
          {book ? (
            <span>
              <div className="book-detail">
                <div
                  className="bg"
                  style={{ backgroundImage: `url(${this.transImgUrl(book.book_cover_small)})` }}
                />
                <div className="ml">
                  <div className="cover">
                    <img alt="" src={this.transImgUrl(book.book_cover_small)} />
                  </div>
                  <div className="detail">
                    <h3>{book.book_name}</h3>
                    <h4>{book.book_author}</h4>
                    <h4>{book.book_publisher}</h4>
                  </div>
                </div>
              </div>
              <div className="actions">
                {book.shelf_id ? (
                  <span className="link e">已收藏</span>
                ) : (
                  <span className="link" onClick={this.addBookShelf}>
                    加入收藏
                  </span>
                )}
                <span className="link y" onClick={this.toReader}>立即阅读</span>
              </div>
              <div className="remark">
                <h3>书籍简介</h3>
                <div>{book.book_remark}</div>
              </div>
              <div className="comms">
                <div className="com-title">
                  <label>书籍评论</label>
                  <span onClick={this.sendReviewData}>写评论</span>
                </div>
                {bookReview && bookReview.length > 0 ? (
                  <div className="reviews">
                    {bookReview.map((item, index) => {
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
                      <div className="more-data" onClick={this.getBookReview}>
                        查看更多评论({reviewParam.total})
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="not-data">还没有评论</div>
                )}
              </div>
              <div className="tjs">
                <h3>相关推荐</h3>
                <div className="remds">
                  {remds.map((item, index) => {
                    return (
                      <div className="remd" key={"remd" + index}>
                        <div className="book">
                          <div className="cover" onClick={this.toBookInfo.bind(this, item)}>
                            <img alt="" src={this.transImgUrl(item.book_cover_small)} />
                          </div>
                          <p>{item.book_name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="copy">2017-2019 @ All Rights Reservd By 微悦读</div>
            </span>
          ) : null}
        </div>
        {book ? (
          <SendReview
            base={this.state.base}
            reload={this.reloadReview}
            bookid={book.book_id}
            ref={el => (this.sendReviewElement = el)}
          />
        ) : null}
      </div>
    );
  }
}
export default Book;
