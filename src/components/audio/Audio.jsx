import React, { Component } from "react";
import HTTP from "../../script/service";
import { Icon, Toast } from "antd-mobile";
import "./Audio.scss";
import NavBar from "../../components/navBar/NavBar";

export default class Audio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      audio: null,
      loop: false,
      issc: false,
      audios: null
    };
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
      return this.props.base.prefix + url;
    }
  };
  showModal = audio => {
    this.setState(
      {
        audio: audio,
        visible: true,
        play: false,
        issc: null
      },
      () => {
        this.searchCollect(audio.audio_id);
        if (!this.state.audios) {
          this.getAudios();
        }
      }
    );
    document.body.className = "hidden";
  };

  hideModal = () => {
    this.setState({
      audio: null,
      visible: false
    });
    document.body.className = "";
  };
  searchCollect = id => {
    HTTP._search_collect({
      type: 2,
      media_id: id
    }).then(res => {
      if (res.data) {
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
  changeAudio = n => {
    const { audios, audio } = this.state;
    let index = 0;
    audios.forEach((item, i) => {
      if (item.audio_id === audio.audio_id) {
        index = i;
      }
    });
    index = index + n >= 0 ? index + n : 0;
    const au = audios[index];
    if (au) {
      this.showModal(au);
    }
  };
  getAudios = () => {
    const { audio } = this.state;
    HTTP._get_audio_list({
      pageSize: 100,
      pageNum: 1,
      cid: audio.audio_cat_id
    }).then(res => {
      this.setState({
        audios: res.data.rows
      });
    });
  };
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
  ended = () => {
    this.setState({
      play: false
    });
  };
  pause = () => {
    this.setState({
      play: false
    });
  };
  play = () => {
    this.setState({
      play: true
    });
  };
  toPlay = () => {
    this.myAudio.play();
  };
  toPause = () => {
    this.myAudio.pause();
  };
  setloop = () => {
    const { loop } = this.state;
    this.setState({
      loop: !loop
    });
  };
  render() {
    const { visible, audio, play, issc, loop } = this.state;
    return (
      <div className="audio">

        {visible && audio ? (
          <div className="audio-plan">

            <div className="line-nav">

              <span className="reback" onClick={this.hideModal}>
                <Icon type="left" size="lg" />
              </span>
            </div>
            <div className="cover">
              <div className="cc">
                <img alt="" src={this.transImgUrl(audio.cover_url_small)} />
              </div>
            </div>
            <div className="name">
              <h3>{audio.audio_title}</h3>
            </div>
            <div className="control">
              <audio id="mp3Btn"
                controls
                src={audio.audio_url}
                ref={el => (this.myAudio = el)}
                onEnded={this.ended}
                onPause={this.pause}
                onPlay={this.play}
                loop={loop}
                autoPlay
              />
            </div>
            <div className="actions">
              <span className={loop ? "action-1 active" : "action-1"}>
                <span className="icon iconfont icon-shuaxin" onClick={this.setloop} />
              </span>
              <span className="action-2">
                <span
                  className="icon iconfont icon-ai10"
                  onClick={this.changeAudio.bind(this, -1)}
                />
              </span>
              <span className="action-3">
                {play ? (
                  <span className="icon iconfont icon-zanting" onClick={this.toPause} />
                ) : (
                  <span className="icon iconfont icon-bofang" onClick={this.toPlay} />
                )}
              </span>
              <span className="action-4">
                <span
                  className="icon iconfont icon-ai09"
                  onClick={this.changeAudio.bind(this, 1)}
                />
              </span>
              <span className="action-5">
                {issc ? (
                  <span className="icon iconfont icon-shoucang" onClick={this.changeCollect} />
                ) : (
                  <span className="icon iconfont icon-shoucang1" onClick={this.changeCollect} />
                )}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
