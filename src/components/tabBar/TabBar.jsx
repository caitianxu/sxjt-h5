import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./TabBar.scss";

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type } = this.props;
    return (
      <div className="Tab-Bar">
        <NavLink to="/index" className={type === "index" ? "menu active" : "menu"}>
          <span className="icon iconfont icon-caidan" />
          <p>悦读</p>
        </NavLink>
        {window.webConfig.cms ? (
          <NavLink to="/cms" className={type === "cms" ? "menu active" : "menu"}>
            <span className="icon iconfont icon-zixun" />
            <p>资讯</p>
          </NavLink>
        ) : null}
        <NavLink to="/shelf" className={type === "shelf" ? "menu active" : "menu"}>
          <span className="icon iconfont icon-books" />
          <p>书架</p>
        </NavLink>
        <NavLink to="/center" className={type === "center" ? "menu active" : "menu"}>
          <span className="icon iconfont icon-wode" />
          <p>我的</p>
        </NavLink>
        {/* <NavLink to="/index" className={type === "index" ? "menu active" : "menu"}>
          <span className="icon iconfont icon-tuijian" />
          <p>推荐</p>
        </NavLink>
        <NavLink to="/shelf" className={type === "shelf" ? "menu active" : "menu"}>
          <span className="icon iconfont icon-books" />
          <p>书架</p>
        </NavLink>
        <NavLink to="/books" className={type === "books" ? "menu active" : "menu"}>
          <span className="icon iconfont icon-shuben" />
          <p>图书</p>
        </NavLink>
        <NavLink to="/audios" className={type === "audios" ? "menu active" : "menu"}>
          <span className="icon iconfont icon-huaban" />
          <p>听书</p>
        </NavLink>
        <NavLink to="/videos" className={type === "videos" ? "menu active" : "menu"}>
          <span className="icon iconfont icon-shipin" />
          <p>视频</p>
        </NavLink> */}
      </div>
    );
  }
}

export default TabBar;
