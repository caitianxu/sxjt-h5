import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import store from "../../store/store";
import HTTP from "../../script/service";
import { Toast, Carousel } from "antd-mobile";
import TabBar from "../../components/tabBar/TabBar";
import NavBar from "../../components/navBar/NavBar";
import Video from "../../components/video/Video";
import AudioInfo from "../../components/audioInfo/AudioInfo";
import Audio from "../../components/audio/Audio";

import "./Index.scss";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState(),
      visible: false,
      searchType: "图书",
      bookData: null,
      videoData: null,
      audioData: null,
      cmsData: null,
      banner: []
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
    this.setState({
      banner: window.webConfig.banner
    });
    Toast.loading("正在加载...", 0);
    //图书
    HTTP._hbjt_get_books().then(res => {
      if (res.code === 0) {
        this.setState({
          bookData: res.data.rows
        });
      }
      //视频
      HTTP._hbjt_get_videos().then(res => {
        if (res.code === 0) {
          this.setState({
            videoData: res.data.rows
          });
          Toast.hide();
        }
        //听书
        HTTP._hbjt_get_audios().then(res => {
          if (res.code === 0) {
            this.setState({
              audioData: res.data.rows
            });
          }
        });
        if (window.webConfig.cms) {
          //资讯
          HTTP._get_act_list({
            pageSize: 6,
            pageNum: 1,
            type: "news"
          }).then(res => {
            if (res.code === 0) {
              this.setState({
                cmsData: res.data.rows
              });
            }
            console.log("资讯", res);
          });
        }
      });
    });
  }
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
  //视频详情
  toVideo = video => {
    if (this.state.base.userInfo) {
      this.videoElement.showModal(video);
    } else {
      this.props.history.push("/login");
    }
  };
  //听书详情
  toAudio = audio => {
    if (this.state.base.userInfo) {
      this.audioInfoElement.showModal(audio);
    } else {
      this.props.history.push("/login");
    }
  };
  //资讯详情
  toCms = cms => {
    this.props.history.push(`/cm/${cms.article_id}`);
  };
  audioPlay = audio => {
    if (this.state.base.userInfo) {
      this.audioElement.showModal(audio);
    } else {
      this.props.history.push("/login");
    }
  };
  //报刊
  toBK = () => {
    window.location.href =
      "http://mc.m.5read.com/other/webapp4Rss_webApp4Rss_rssCataList2.jspx?schoolid=12653&uid=12653";
  };
  render() {
    const { bookData, videoData, audioData, cmsData } = this.state;
    return (
      <div>
        <NavBar title={<span className="logo" />} base={this.state.base} reback={false} />
        <div className="page-content">
          <div className="top-banner">
            <Carousel autoplay={true} infinite autoplay>
              {this.state.banner.map((val, index) => (
                <div className="banner" key={"banner-" + index}>
                  <a href={val.href}>
                      <img alt="" src={val.pic} />
                  </a>
                    <br /><span id="toutiao">{val.title}</span>
                </div>
              ))}
            </Carousel>
          </div>
          <div className="menu-bar">
            <NavLink className="menu-item" to="/hot">
              <div className="cover">
                <img alt="" src="./assets/img/m1.png" />
              </div>
              <p>推荐</p>
            </NavLink>
            <NavLink className="menu-item" to="/books">
              <div className="cover">
                <img alt="" src="./assets/img/m2.png" />
              </div>
              <p>图书</p>
            </NavLink>
            <NavLink className="menu-item" to="/audios">
              <div className="cover">
                <img alt="" src="./assets/img/m3.png" />
              </div>
              <p>听书</p>
            </NavLink>
            <NavLink className="menu-item" to="/videos">
              <div className="cover">
                <img alt="" src="./assets/img/m4.png" />
              </div>
              <p>视频</p>
            </NavLink>
            <div className="menu-item" onClick={this.toBK}>
              <div className="cover">
                <img alt="" src="./assets/img/m5.png" />
              </div>
              <p>报刊</p>
            </div>
          </div>
          {bookData ? (
            <span className="all-fix">
              <div className="content-title">
                <label className="name">最新图书</label>
                <NavLink className="more" to="/books">
                  <label>更多&gt;</label>
                </NavLink>
              </div>
              <div className="content-list">
                {bookData.map((book, index) => {
                  return (
                    <div className="book" key={index}>
                      <div className="cover" onClick={this.toBookInfo.bind(this, book)}>
                        <img alt="" src={this.transImgUrl(book.book_cover_small)} />
                      </div>
                      <p className="name">{book.book_name}</p>
                    </div>
                  );
                })}
              </div>
            </span>
          ) : null}

          {videoData ? (
            <span className="all-fix">
              <div className="content-title">
                <label className="name">最新视频</label>
                <NavLink className="more" to="/videos">
                  <label>更多&gt;</label>
                </NavLink>
              </div>
              <div className="content-list">
                {videoData.map((video, index) => {
                  return (
                    <div className="video" key={index}>
                      <div className="cover" onClick={this.toVideo.bind(this, video)}>
                        <img alt="" src={this.transImgUrl(video.cover_url_small)} />
                      </div>
                      <p className="name">{video.video_title}</p>
                    </div>
                  );
                })}
              </div>
            </span>
          ) : null}

          {audioData ? (
            <span className="all-fix">
              <div className="content-title">
                <label className="name">最新听书</label>
                <NavLink className="more" to="/audios">
                  <label>更多&gt;</label>
                </NavLink>
              </div>
              <div className="content-list">
                {audioData.map((audio, index) => {
                  return (
                    <div className="book" key={index}>
                      <div className="cover" onClick={this.toAudio.bind(this, audio)}>
                        <img alt="" src={this.transImgUrl(audio.cover_url_small)} />
                      </div>
                      <p className="name">{audio.audio_title}</p>
                    </div>
                  );
                })}
              </div>
            </span>
          ) : null}
          {cmsData ? (
            <span className="all-fix">
              <div className="content-title">
                <label className="name">最新资讯</label>
                <NavLink className="more" to="/cms">
                  <label>更多&gt;</label>
                </NavLink>
              </div>
              <div className="content-list">
                {cmsData.map((cms, index) => {
                  return (
                    <div className="video" key={index}>
                      <div className="cover" onClick={this.toCms.bind(this, cms)}>
                        <img alt="" src={this.transImgUrl(cms.cover_url_small)} />
                      </div>
                      <p className="name">{cms.article_title}</p>
                    </div>
                  );
                })}
              </div>
            </span>
          ) : null}
        </div>
        <TabBar type="index" />
        <Video base={this.state.base} ref={el => (this.videoElement = el)} />
        <AudioInfo
          base={this.state.base}
          ref={el => (this.audioInfoElement = el)}
          audioPlay={this.audioPlay}
        />
        <Audio base={this.state.base} ref={el => (this.audioElement = el)} />
      </div>
    );
  }
}

export default Index;
