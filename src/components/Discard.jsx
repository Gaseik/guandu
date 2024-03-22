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
          <p className="discard-text">Discard the image / video ?</p>
          <div className="discard-btn-group">
            <div className="btn delete-btn" onClick={onClickDelete}><p>Delete</p></div>
            <div className="btn cancel-btn" onClick={onClickCancel}><p>Cancel</p></div>
          </div>
        </div>
      </div>
  )
}

export default Discard;