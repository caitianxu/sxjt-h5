import React, { Component } from "react";
import HTTP from "../../script/service";
import { Icon, Toast } from "antd-mobile";
import "./Video.scss";

export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      video: null,
      remds: null,
      issc: false
    };
  }

  showModal = video => {
    console.log(video);
    HTTP._get_videl_detail({
      video_id: video.video_id
    }).then(res => {
      this.setState(
        {
          visible: true,
          video: res.data,
          remds: null
        },
        () => {
          this.searchCollect(video.video_id);
          this.getVideos();
        }
      );
    });

    document.body.className = "hidden";
  };
  getVideos = () => {
    HTTP._get_videos().then(res => {
      this.setState({
        remds: res.data.rows
      });
    });
  };
  searchCollect = id => {
    HTTP._search_collect({
      type: 1,
      media_id: id
    }).then(res => {
      if (res.data) {
        this.setState({
          issc: res.data ? true : false
        });
      }
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
      video: null
    });
    document.body.className = "";
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
      return this.props.base.prefix + url;
    }
  };
  changeCollect = () => {
    const { video, issc } = this.state;
    HTTP._add_collect({
      type: 1,
      media_id: video.video_id
    }).then(() => {
      if (issc) {
        Toast.success("取消收藏成功");
      } else {
        Toast.success("加入收藏成功");
      }
      this.setState({
        issc: issc ? false : true
      });
    });
  };
  render() {
    const { visible, video, remds } = this.state;
    return (
      <div className="video">
        {visible ? (
          <div className="video-plan">
            <div className="video-top">
              <div className="line-nav">
                <span className="reback" onClick={this.hideModal}>
                  <Icon type="left" size="lg" />
                </span>
              </div>
              <div className="video-modal">
                {video ? (
                  <video
                    width="100%"
                    height="100%"
                    src={video.video_url + `?v=${+new Date()}`}
                    autoPlay
                    controls
                  />
                ) : null}
                {/* playsinline="" webkit-playsinline=""  */}
              </div>
            </div>
            <div className="video-title">{video.video_title}</div>
            <div className="video-remark">
              <div className="actions">
                <label>
                  视频分类：<b>{video.video_cat_name || "xxxx"}</b>
                </label>
                {this.state.issc ? (
                  <span className="red" onClick={this.changeCollect}>
                    - 取消
                  </span>
                ) : (
                  <span onClick={this.changeCollect}>+ 收藏</span>
                )}
              </div>
              <p>{video.video_remark}</p>
            </div>
            <div className="video-content">
              <div className="tjs">
                <h3>相关推荐</h3>
                <div className="remds">
                  {remds &&
                    remds.map((item, index) => {
                      return (
                        <div className="remd" key={"remd" + index}>
                          <div className="book">
                            <div className="cover" onClick={this.showModal.bind(this, item)}>
                              <img alt="" src={this.transImgUrl(item.cover_url_small)} />
                            </div>
                            <p>{item.video_title}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="copy">2017-2019 @ All Rights Reservd By 微悦读</div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
