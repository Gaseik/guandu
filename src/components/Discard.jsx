import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageState } from "../model/pageState";

const Discard = function (props) {
  const state = useSelector((state) => state.AppState);
  const dispatch = useDispatch();

  function onClickCancel() {
    dispatch.AppState.changePageState(state.lastPage)
  }
  function onClickDelete() {
    dispatch.AppState.changePageState(PageState.ARView)
  }

  return (
    <div className="discard" style={{ ...props.style }}>
        <div className="discard-pop">
          <img src="/image/icon/image-icon.svg" className="image-icon" alt=""/>
          <p className="discard-text">您確定要放棄這張照片或影片嗎？</p>
          <div className="discard-btn-group">
            <div className="btn delete-btn" onClick={onClickDelete}><p className="">放棄</p></div>
            <div className="btn cancel-btn" onClick={onClickCancel}><p>取消</p></div>
          </div>
        </div>
      </div>
  )
}

export default Discard;