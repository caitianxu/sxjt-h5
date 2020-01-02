import axios from "axios";
import qs from "qs";
import config from "./config";
import store from "../store/store";
import Util from "./util";

/********创建实例********/
const service = axios.create({
  baseURL: config.ctxPath,
  timeout: 10000
});

/********请求参数处理********/
service.interceptors.request.use(request => {
  const store_state = { ...store.getState() };
  let df_param = {
    org_id: window.webConfig.org_id,
    token_type: config.token_type,
    client_type: config.client_type,
    member_token: store_state.token,
    member_id: store_state.uid
  };
  if (!request.params) {
    request.params = {};
  }
  if (!request.data) {
    request.data = {};
  }
  if (request.method === "post") {
    if (request.data.application === "json") {
      request.data = { ...request.data, ...df_param };
      request.headers["Content-Type"] = "application/json; charset=UTF-8";
    } else {
      request.data = qs.stringify({ ...request.data, ...df_param });
      request.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
    }
  } else {
    request.params = { ...request.params, ...df_param };
    request.headers["Content-Type"] = "application/json; charset=UTF-8";
  }
  return request;
});

/********服务响应处理********/
service.interceptors.response.use(
  response => {
    if (response.data.code === 600) {
      Util.delCookie("account");
      Util.delCookie("pwd");
      //window.alert("当前用户登录信息已失效, 需要重新登录");
      window.location.href = "/#login";
    }
    return response.data;
  },
  error => {
    return {
      code: 500,
      data: null,
      message: error.message || "服务异常，请稍后再试~"
    };
  }
);

export default service;
