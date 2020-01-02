import React, { Component } from "react";
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import asyncComponent from "../../script/asyncComponent";
import store from "../../store/store";
import Util from "../../script/util";
import HTTP from "../../script/service";
import { _set_user_info } from "../../store/Action";
import "./Main.scss";

const Index = asyncComponent(() => import("../index/Index"));
const Stick = asyncComponent(() => import("../stick/Stick"));
const Books = asyncComponent(() => import("../books/Books"));
const Shelf = asyncComponent(() => import("../shelf/Shelf"));
const Videos = asyncComponent(() => import("../videos/Videos"));
const Audios = asyncComponent(() => import("../audios/Audios"));
const Login = asyncComponent(() => import("../login/Login"));
const Center = asyncComponent(() => import("../center/Center"));
const Registe = asyncComponent(() => import("../registe/Registe"));
const Book = asyncComponent(() => import("../book/Book"));
const videoSc = asyncComponent(() => import("../videoSc/videoSc"));
const audioSc = asyncComponent(() => import("../audioSc/audioSc"));
const Revews = asyncComponent(() => import("../revews/Revews"));
const Seting = asyncComponent(() => import("../seting/Seting"));
const Reader = asyncComponent(() => import("../reader/Reader"));
const BK = asyncComponent(() => import("../bk/BK"));
const Hot = asyncComponent(() => import("../hot/Hot"));
const Search = asyncComponent(() => import("../search/Search"));
const Cms = asyncComponent(() => import("../cms/Cms"));
const Cm = asyncComponent(() => import("../cm/Cm"));

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: store.getState()
    };
    store.subscribe(this.storeChange);
  }
  //更新store
  storeChange = () => {
    this.setState({
      base: store.getState()
    });
  };
  //初始化
  componentWillMount() {
    const account = Util.readCookie("account");
    const pwd = Util.readCookie("pwd");
    if (account && pwd) {
      HTTP._login({
        account: account,
        pwd: pwd
      }).then(res => {
        if (res.code === 0) {
          Util.setCookie("account", account);
          Util.setCookie("pwd", pwd);
          _set_user_info(res.data);
        } else {
          Util.delCookie("account");
          Util.delCookie("pwd");
        }
      });
    } else {
      let param = {
        account: new Date().getTime(),
        pwd: "123456"
      };
      HTTP._registe({
        account: param.account,
        pwd: param.pwd
      }).then(res => {
        if (res.code == 0) {
          HTTP._login({
            account: param.account,
            pwd: param.pwd
          }).then(res => {
            if (res.code === 0) {
              Util.setCookie("account", param.account);
              Util.setCookie("pwd", param.pwd);
              _set_user_info(res.data);
            } else {
              Util.delCookie("account");
              Util.delCookie("pwd");
            }
          });
        }
      });
    }
  }
  render() {
    return (
      <div className="main-page">
        <div className="main-Route">
          <Router>
            <Switch>
              <Redirect exact from="/" to="/index" />
              <Route path="/index" component={Index} />
              <Route path="/shelf" component={Shelf} />
              <Route path="/books" component={Books} />
              <Route path="/book/:bookid" component={Book} />
              <Route path="/audios" component={Audios} />
              <Route path="/videos" component={Videos} />
              <Route path="/vsc" component={videoSc} />
              <Route path="/asc" component={audioSc} />
              <Route path="/cms" component={Cms} />
              <Route path="/cm/:cid" component={Cm} />
              <Route path="/login" component={Login} />
              <Route path="/seting" component={Seting} />
              <Route path="/registe" component={Registe} />
              <Route path="/center" component={Center} />
              <Route path="/revews" component={Revews} />
              <Route path="/bk" component={BK} />
              <Route path="/hot" component={Hot} />
              <Route path="/search" component={Search} />
              <Route path="/reader/:bookid" component={Reader} />
              <Route path="/:local" component={Stick} />
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}
export default Main;
