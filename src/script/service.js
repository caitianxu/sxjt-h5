import service from "./request";
// import fetchJsonp from "fetch-jsonp";

const HTTP = {
  //注册
  _registe: param => {
    return service.post('/v2/api/mobile/registe', param);
  },
  //登录
  _login: param => {
    return service.post('/v2/api/mobile/login', param);
  },
  //最新图书
  _hbjt_get_books: param => {
    return service.post("/api/hbjt/getbooks", param);
  },
  //最新视频
  _hbjt_get_videos: param => {
    return service.post("/api/hbjt/getvideos", param);
  },
  //最新视频
  _hbjt_get_audios: param => {
    return service.post("/api/hbjt/getaudios", param);
  },
  //图书分类
  _get_book_cats: param => {
    return service.post("/v2/api/bookCat/getList", param);
  },
  //图书列表
  _get_book_list: param => {
    return service.post("/v2/api/book/getList", param);
  },
  //听书分类
  _get_audio_cats: param => {
    return service.post("/api/hbjt/audio/getAudioCats", param);
  },
  //听书列表
  _get_audio_list: param => {
    return service.post("/api/hbjt/audio/getList", param);
  },
  //视频分类
  _get_video_cats: param => {
    return service.post("/api/hbjt/video/getVideoCats", param);
  },
  //视频列表
  _get_video_list: param => {
    return service.post("/api/hbjt/video/getList", param);
  },
  //图书详情
  _book_detail: param => {
    return service.post("/api/hbjt/bookdetail", param);
  },
  //个人中心
  _read_count: param => {
    return service.post("/v2/api/member/readCount", param);
  },
  //相关推荐
  _book_recommends: param => {
    return service.post("/api/hbjt/bookrecommends", param);
  },
  //相关推荐-1
  _getSearchkeyList: param => {
    return service.post("/v2/api/searchKey/getSearchkeyList", param);
  },
  //图书评论
  _book_reviews: param => {
    return service.post("/v2/api/mobile/bookReview/list", param);
  },
  //发布评论
  _add_review: param => {
    return service.post("/v2/api/mobile/bookReview/addReview", param);
  },
  //添加收藏
  _add_book_shelf: param => {
    return service.post("/v2/api/bookShelf/addBook", param);
  },
  //移除收藏
  _del_book_shelf: param => {
    return service.post("/v2/api/bookShelf/delBook", param);
  },
  //视频详情
  _get_videos: param => {
    return service.post("/api/hbjt/getvideos", param);
  },
  //视频是否收藏
  _search_collect: param => {
    return service.post("/api/hbjt/searchcollect", param);
  },
  //视频加人收藏
  _add_collect: param => {
    return service.post("/api/hbjt/addcollect", param);
  },
  //我的书架
  _get_book_shelf: param => {
    return service.post("/v2/api/bookShelf/getList", param);
  },
  //清空书架
  _del_book: param => {
    return service.post("/v2/api/bookShelf/delBook", param);
  },
  //清空书架
  _get_collect_list: param => {
    return service.post("/api/hbjt/getcollectlist", param);
  },
  //所有评论
  _member_review_list: param => {
    return service.post("/v3/member/memberReviewList", param);
  },
  //删除评论
  _delete_reviews: param => {
    return service.post("/v3/bookReview/deleteReviews", param);
  },
  //上传
  _file_upload: param => {
    return service.post("/file/upload", param);
  },
  //修改头像
  _update_icon: param => {
    return service.post("/v2/api/mobile/memberInfo/updateIcon", param);
  },
  //修改昵称
  _modify_user_info: param => {
    return service.post("/v3/member/updateMemberInfo", param);
  },
  //出版章节列表
  _chapterTree: param => {
    return service.post("/v3/api/book/chapterTree", param);
  },
  //出版章节内容
  _getChapterContent: param => {
    return service.post("/v4/api/book/getChapterContent", param);
  },
  //出版章节内容
  _updateMemberReadRecord: param => {
    return service.post("/v2/api/bookShelf/updateMemberReadRecord", param);
  },
  //banner
  _get_banner: param => {
    return service.post("/api/ylmobile/getrecommendcms", param);
  },
  //搜索关键词
  _get_search_key_list: param => {
    return service.post("/v3/searchKey/getSearchkeyList", param);
  },
  //搜索关键词
  _get_videl_detail: param => {
    return service.post("/api/hbjt/videodetail", param);
  },
  //热门资讯
  _get_act_list: param => {
    return service.post("/api/hbjt/getActList", param);
  },
  //资讯分类
    _get_act_cats: param => {
        return service.post("/web/infCat/getCatList", param);
    },
    //资讯分类
// _get_act_cats: param => {
       //  return service.post("/api/hbjt/getcats", param);
    // },
  //资讯p
    _get_recommen_darts: param => {
    return service.post("/api/hbjt/getrecommendarts", param);
  },
  //资讯详情
  _get_news_detail: param => {
    return service.post("/api/hbjt/newsdetail", param);
  },
  //资讯评论
  _get_articleReview_list: param => {
    return service.post("/hbjt/articleReview/list", param);
  },
  //发布资讯评论
  _add_cms_review: param => {
    return service.post("/hbjt/articleReview/addReview", param);
  }
  
  
  

};
export default HTTP;
