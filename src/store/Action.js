import store from "./store";
import Util from "../script/util";

//获取经纬度
export const _set_user_info = (userInfo, callback) => {
  const action = {
    type: "set_user_value",
    value: userInfo
  };
  store.dispatch(action);
  callback && callback();
};
//获取经纬度
export const _clear_user_info = callback => {
  const action = {
    type: "_clear_user_info"
  };
  Util.delCookie("account");
  Util.delCookie("pwd");
  store.dispatch(action);
  callback && callback();
};
