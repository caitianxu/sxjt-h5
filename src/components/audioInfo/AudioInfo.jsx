import React, { Component } from "react";
import HTTP from "../../script/service";
import { Icon, Toast } from "antd-mobile";
import "./AudioInfo.scss";

export default class AudioInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      audio: null,
      issc: false,
      audios: []
    };
  }
  showModal = audio => {
    console.log(audio);
    this.setAudio(audio);
  };
  hideModal = () => {
    this.setState({
      audio: null,
      visible: false
    });
    document.body.className = "";
  };
  setAudio = audio => {
    this.setState(
      {
        audio: audio,
        visible: true,
        issc: false
      },
      () => {}
    );
    //推荐
    HTTP._hbjt_get_audios({}).then(res => {
      if (res.code === 0 && res.data && res.data.rows) {
        this.setState({
          audios: res.data.rows || []
        });
      }
    });
    document.body.className = "hidden";
    if (this.scrollElement) {
      this.scrollElement.scrollTop = 0;
    }
    //是否收藏
    HTTP._search_collect({
      type: 2,
      media_id: audio.audio_id
    }).then(res => {
      if (res.code === 0 && res.data) {
        this.setState({
          issc: true
        });
      } else {
        this.setState({
          issc: false
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
      return this.props.base.prefix + url;
    }
  };
  onPlay = () => {
    this.props.audioPlay(this.state.audio);
  }
  //收藏
  changeCollect = () => {
    const { audio, issc } = this.state;
    HTTP._add_collect({
      type: 2,
      media_id: audio.audio_id
    }).then(() => {
      if(issc){
        Toast.success('取消收藏成功')
      }
      else{
        Toast.success('加入收藏成功')
      }
      this.setState({
        issc: issc ? false : true
      });
    });
  };
  render() {
    const { audio, visible, audios, issc } = this.state;
    return (
      <span>
        {visible && audio ? (
          <div className="audio-page-info">
            <div className="line-nav">
              <span className="reback" onClick={this.hideModal}>
                <Icon type="left" size="lg" />
              </span>
              <span className="title">{audio.audio_title}</span>
            </div>
            <div className="audio-page-content-info" ref={el => (this.scrollElement = el)}>
              <div className="max-cover">
                <img alt="" src={this.transImgUrl(audio.cover_url_small)} />
              </div>
              <div className="max-remark">{audio.audio_remark}</div>
              <div className="actions">
                {!issc ? <span onClick={this.changeCollect}>加入收藏</span> : <span className="end" onClick={this.changeCollect}>取消收藏</span>}
                <span onClick={this.onPlay}>立即收听</span>
              </div>
              <div className="tjs">
                <h3>相关推荐</h3>
                <div className="remds">
                  {audios.map((item, index) => {
                    return (
                      <div className="remd" key={"remd" + index}>
                        <div className="book">
                          <div className="cover" onClick={this.setAudio.bind(this, item)}>
                            <img alt="" src={this.transImgUrl(item.cover_url_small)} />
                          </div>
                          <p>{item.audio_title}</p>
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
      </span>
    );
  }
}
