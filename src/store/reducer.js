const defaultState = {
  uid: null,
  token: null,
  userInfo: null,
  prefix: "http://www.tuibook.com/"
};

export default (state = defaultState, action) => {
  //设置数据字典内容
  if (action.type === "set_user_value") {
    const newState = { ...state };
    newState.userInfo = action.value;
    newState.uid = action.value.member_id;
    newState.token = action.value.token;
    return newState;
  }
  else if( action.type === '_clear_user_info'){
    const newState = { ...state };
    newState.userInfo = null;
    newState.uid = null;
    newState.token = null;
    return newState;
  }

  return state;
};
