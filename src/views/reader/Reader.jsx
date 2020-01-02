import React, { Component } from "react";
import store from "../../store/store";
import HTTP from "../../script/service";
import Util from "../../script/util";
import { Toast, Drawer, Icon, Slider } from "antd-mobile";
import "./Reader.scss";

export default class Reader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      fontSize: 14,
      bkid: null,
      loading: false,
      chapter: null, //最后章节
      schedule: 0, //最后进度
      chHtmls: [], //存放章节内容
      open: false, //显示菜单
      toogle: false, //显示操作
      shuqian: false, //书签
      inNight: false //夜间模式
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
    const inNight = Util.readCookie("inNight");
    const size = Util.readCookie("fontSize");
    this.setState(
      {
        bkid: this.props.match.params.bookid,
        inNight: inNight || false,
        fontSize: size ? parseInt(size) : 14
      },
      () => {
        const account = Util.readCookie("account");
        const pwd = Util.readCookie("pwd");
        if (account && pwd && !this.state.base.userInfo) {
          Toast.loading("正在加载...", 0);
          setTimeout(() => {
            this.getchapterTree();
          }, 1000);
        } else {
          this.getchapterTree();
        }
      }
    );
  }
  componentDidMount() {
    document.querySelector(".am-drawer-content").addEventListener("scroll", this.handleScroll);
  }
  //滚动监听
  handleScroll = e => {
    let bottom = e.srcElement.scrollHeight - e.srcElement.scrollTop;
    if (bottom - e.srcElement.clientHeight < 300) {
      this.loadNext();
    }
  };
  //直接单章节
  setToChapterHtml = item => {
    this.setState(
      {
        chapter: item,
        chHtmls: [],
        open: false,
        toogle: false
      },
      () => {
        Toast.loading("正在加载...", 0);
        this.getChapterContent();
      }
    );
  };
  //获取章节
  getchapterTree = () => {
    HTTP._chapterTree({
      book_id: this.state.bkid
    }).then(res => {
      if (res.data && res.code === 0) {
        const schedule_cookie = Util.readCookie(this.state.bkid);
        const schedule = schedule_cookie ? schedule_cookie.split("|") : [0, 0];
        let chaptersData = [];
        //装载数据
        res.data.chapters.forEach((one, i) => {
          const { id, name, url } = one;
          chaptersData.push({ id, name, url, index: chaptersData.length, pid: 0 });
          if (one.child && one.child.length > 0) {
            one.child.forEach((two, i) => {
              const { id, name, url } = two;
              chaptersData.push({ id, name, url, index: chaptersData.length, pid: one.id });
            });
          }
        });
        let chapter = null;
        let schedule_index = schedule[1];
        if (schedule[0] && schedule[0] !== "0") {
          let chapters = chaptersData.filter(item => item.id.toString() === schedule[0].toString());
          if (chapters && chapters.length > 0) {
            chapter = chapters[0];
            schedule_index = ((chapter.index / chaptersData.length) * 100).toFixed(2);
          }
        }
        if (!chapter) {
          chapter = chaptersData[0];
          schedule_index = 0;
        }
        this.setState(
          {
            height: document.documentElement.clientHeight,
            chapters: res.data.chapters,
            book: res.data.info,
            chaptersData: chaptersData,
            chapter: chapter, //最后章节
            schedule: schedule_index //最后进度
          },
          () => {
            this.getChapterContent();
          }
        );
      } else {
        this.props.history.replace("/login");
      }
      Toast.hide();
    });
  };
  //获取章节内容
  getChapterContent = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        HTTP._getChapterContent({
          chapter_id: this.state.chapter.id,
          book_id: this.state.bkid
        }).then(res => {
          let schedule_index = 0;
          let chapters = this.state.chaptersData.filter(
            item => item.id.toString() === this.state.chapter.id.toString()
          );
          if (chapters && chapters.length > 0) {
            schedule_index = ((chapters[0].index / this.state.chaptersData.length) * 100).toFixed(
              2
            );
          }
          //设置进度
          Util.setCookie(this.state.bkid, `${this.state.chapter.id}|${schedule_index}`);
          this.setState(
            {
              chHtmls: this.state.chHtmls.concat(res.data),
              schedule_index: schedule_index,
              loading: false
            },
            () => {
              Toast.hide();
              setTimeout(this.loadMore, 1000);
            }
          );
        });
      }
    );
  };
  //加载更多章节
  loadMore = () => {
    const { height } = this.state;
    if (height < this.readerElement.clientHeight) {
      console.log("超过高度不用加载");
      return false;
    }
    this.loadNext();
  };
  //加载下一章
  loadNext = () => {
    const { chapter, chaptersData, loading } = this.state;
    if (chapter.index + 1 >= chaptersData.length) {
      console.log("没有更多章节加载");
      return false;
    }
    if (loading) {
      console.log("正在加载中");
      return false;
    }
    let new_chapter = chaptersData[chapter.index + 1];
    this.setState(
      {
        chapter: new_chapter
      },
      () => {
        this.getChapterContent();
      }
    );
  };
  //获取上一章
  onToLastCh = () => {
    const { chapter, chaptersData } = this.state;
    if (chapter.index <= 0) {
      Toast.info("已经是第一章了");
      return false;
    }
    let new_chapter = chaptersData[chapter.index - 1];
    this.setState(
      {
        chapter: new_chapter,
        chHtmls: [],
        open: false,
        toogle: false
      },
      () => {
        Toast.loading("正在加载...", 0);
        this.getChapterContent();
      }
    );
  };
  //获取下一章
  onToNextCh = () => {
    const { chapter, chaptersData } = this.state;
    if (chapter.index + 1 >= chaptersData.length) {
      Toast.info("已经是最后一章");
      return false;
    }
    let new_chapter = chaptersData[chapter.index + 1];
    this.setState(
      {
        chapter: new_chapter,
        chHtmls: [],
        open: false,
        toogle: false
      },
      () => {
        Toast.loading("正在加载...", 0);
        this.getChapterContent();
      }
    );
  };
  //打开章节
  onOpenChange = () => {
    this.setState({ open: !this.state.open }, () => {
      const dom = document.querySelector(`#id_${this.state.chapter.id}`);
      if (dom) {
        document.querySelector(".am-drawer-sidebar").scrollTo(0, dom.offsetTop);
      }
    });
  };
  //打开操作
  onToogleChange = () => {
    this.setState({ toogle: !this.state.toogle });
  };
  //返回
  onReback = () => {
    this.props.history.goBack();
  };
  //书签
  onChangeShuqian = () => {
    this.setState({
      shuqian: !this.state.shuqian
    });
  };
  //模式
  onLineChange = () => {
    this.setState(
      {
        inNight: !this.state.inNight
      },
      () => {
        if (this.state.inNight) {
          Util.setCookie("inNight", true);
        } else {
          Util.delCookie("inNight");
        }
      }
    );
  };
  //改变字体大小
  chengSize = n => {
    let size = this.state.fontSize + n;
    if (size < 10) {
      size = 10;
    } else if (size > 30) {
      size = 30;
    }
    this.setState(
      {
        fontSize: size
      },
      () => {
        Util.setCookie("fontSize", size);
      }
    );
  };
  toHome = () => {
    this.props.history.replace("/index");
  };
  render() {
    const { chapters, chaptersData, toogle, open, shuqian, inNight, chHtmls, chapter } = this.state;
    //章节
    const sidebar = chapters ? (
      <div className="book-menu">
        <ul className="one">
          {chaptersData.map((one, i) => {
            return (
              <li
                key={"one" + i}
                id={"id_" + one.id}
                className={chapter.id === one.id ? "active" : ""}
              >
                {one.pid ? (
                  <h4 onClick={this.setToChapterHtml.bind(this, one)}>{one.name}</h4>
                ) : (
                  <h3 onClick={this.setToChapterHtml.bind(this, one)}>{one.name}</h3>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    ) : (
      <div className="book-menu" />
    );
    return (
      <div className={inNight ? "book-reader in-night" : "book-reader"}>
        <Drawer
          className="my-drawer"
          style={{ minHeight: this.state.height }}
          sidebar={sidebar}
          open={open}
          onOpenChange={this.onOpenChange}
        >
          <div className="reader-html">
            {/* 阅读内容 */}
            <div
              className="book-reader-content"
              ref={el => (this.readerElement = el)}
              onClick={this.onToogleChange}
              style={{ fontSize: this.state.fontSize }}
            >
              {chHtmls.map((ch, index) => {
                return (
                  <span className="html-body" key={`ch${index}`}>
                    <div dangerouslySetInnerHTML={{ __html: ch.content }} />
                  </span>
                );
              })}
            </div>
            {/* 操作项 */}
            {toogle ? (
              <div className="reader-control">
                <div className="reader-nav">
                  <div className="solo-plan fadeInDown animated faster">
                    <div className="top-nav">
                      <span className="reback" onClick={this.onReback}>
                        <Icon type="left" size="lg" />
                      </span>
                      <span className="shuqian" onClick={this.onChangeShuqian}>
                        {shuqian ? (
                          <span className="icon iconfont icon-shuqian" />
                        ) : (
                          <span className="icon iconfont icon-shuqianw" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="reader-center" onClick={this.onToogleChange} />
                <div className="reader-tab">
                  <div className="solo-plan fadeInUp animated faster">
                    <div className="solo-row-1">
                      <span className="book-last" onClick={this.onToLastCh}>
                        上一章
                      </span>
                      <span className="reag">
                        <Slider
                          defaultValue={0}
                          value={parseFloat(this.state.schedule)}
                          disabled
                          trackStyle={{
                            backgroundColor: "#f80",
                            height: "5px"
                          }}
                          railStyle={{
                            height: "5px"
                          }}
                          handleStyle={{
                            borderColor: "#f90",
                            height: "14px",
                            width: "14px",
                            marginLeft: "-7px",
                            marginTop: "-4.5px",
                            backgroundColor: "#f90"
                          }}
                        />
                      </span>
                      <span className="book-next" onClick={this.onToNextCh}>
                        下一章
                      </span>
                    </div>
                    <div className="solo-row-2">
                      <div className="a-item" onClick={this.toHome}>
                        <span className="icon iconfont icon-shouye" />
                        <p>首页</p>
                      </div>
                      <div className="a-item" onClick={this.onOpenChange}>
                        <span className="icon iconfont icon-directory" />
                        <p>目录</p>
                      </div>
                      {inNight ? (
                        <div className="a-item" onClick={this.onLineChange}>
                          <span className="icon iconfont icon-rijianmoshi" />
                          <p>夜间</p>
                        </div>
                      ) : (
                        <div className="a-item" onClick={this.onLineChange}>
                          <span className="icon iconfont icon-yejianmoshi" />
                          <p>夜间</p>
                        </div>
                      )}

                      <div className="a-item" onClick={this.chengSize.bind(this, -2)}>
                        <span className="icon iconfont icon-zitijianxiao" />
                        <p>字体</p>
                      </div>

                      <div className="a-item" onClick={this.chengSize.bind(this, 2)}>
                        <span className="icon iconfont icon-zitizengda" />
                        <p>字体</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Drawer>
      </div>
    );
  }
}
