import React, { Component } from "react";
import { Icon, Button, Toast } from "antd-mobile";
import HTTP from "../../script/service";
import "./CmsReview.scss";

export default class CmsReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      reamText: null,
      loading: false
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
      reamText: null,
      loading: false
    });
  };
  hideModal = () => {
    this.setState({
      visible: false
    });
    this.props.reload();
  };
  //文本值变更
  changeFormValue = e => {
    this.setState({
      reamText: e.target.value
    });
  };
  sendForm = () => {
    const { reamText } = this.state;
    if (!reamText) {
      Toast.offline("请填写你的评论");
      return false;
    }
    this.setState(
      {
        loading: true
      },
      () => {
        HTTP._add_cms_review({
          article_id: this.props.cid,
          review_content: reamText
        }).then(res => {
          if (res.code === 0) {
            this.hideModal();
          } else {
            Toast.fail(res.message);
          }
        });
      }
    );
  };
  render() {
    const { visible } = this.state;
    return (
      <span>
        {visible ? (
          <div className="sendReview">
            <div className="line-nav">
              <span className="reback" onClick={this.hideModal}>
                <Icon type="left" size="lg" />
              </span>
              <h3>发表评论</h3>
            </div>
            <div className="review-content">
              <textarea
                placeholder="填写你的评论..."
                maxLength="50"
                onChange={this.changeFormValue}
              />
              <Button type="primary" inline onClick={this.sendForm} loading={this.state.loading}>
                发表评论
              </Button>
            </div>
          </div>
        ) : null}
      </span>
    );
  }
}
