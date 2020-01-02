import React, { Component } from "react";
import { Icon } from "antd-mobile";
import { NavLink, withRouter } from "react-router-dom";
import "./NavBar.scss";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
  goback = () => {
    this.props.history.goBack();
  };
  render() {
    const { title, reback, base, hideCenter, action } = this.props;
    return (
      <div className="Nav-Bar">
        <label className="name">
          <span className="reback" onClick={this.goback}>
            {reback ? <Icon size="lg" type="left" /> : null}
          </span>
          {title}
        </label>
        <span className={hideCenter ? "center hide" : "center"}>
          {action && base.userInfo? (
            action
          ) : (
            <span>
              <NavLink to="/search" className="search">
                <Icon type="search"/>
              </NavLink>
              {/* {base.userInfo ? (
                <NavLink to="/center">
                  <span className="cover">
                    <img alt="" src={this.transImgUrl(base.userInfo.icon)} />
                  </span>
                </NavLink>
              ) : (
                <NavLink to="/login">
                  <span className="icon iconfont icon-wode" />
                </NavLink>
              )} */}
            </span>
          )}
        </span>
      </div>
    );
  }
}
export default withRouter(NavBar);
