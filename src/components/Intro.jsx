import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { animationList, modelData, PageState } from "../model/pageState";
import * as THREE from "three";
import PropTypes from 'prop-types';

const Intro = function (props) {
  const state = useSelector((state) => state.AppState);
  const dispatch = useDispatch();

  function onClickStart() {
    // dispatch.AppState.changePageState(PageState.ARView)
    modelData.children[0].scale.set(0, 0, 0);
    animationList["left_start"].stop();
    animationList["left_loop"].stop();
    animationList["left_start"].timeScale = 0;
    animationList["left_start"].play();
    animationList["left_start"].loop = THREE.LoopOnce;
    setTimeout(() => { animationList["left_start"].timeScale = 1; modelData.children[0].scale.set(0.235, 0.235, 0.235); }, 1500);

    animationList["ball_start"].stop();
    animationList["ball_loop"].stop();
    animationList["aa"].stop();
    animationList["bb"].stop();
    animationList["cc"].stop();
    animationList["dd"].stop();
    animationList["ball_start"].timeScale = 0;
    animationList["ball_start"].play();
    animationList["ball_start"].loop = THREE.LoopOnce;
    setTimeout(() => { animationList["ball_start"].timeScale = 1; modelData.children[0].scale.set(0.235, 0.235, 0.235); }, 1500);
  }

  

  return (
    <div className="intro" style={{ ...props.style }}>
      <img className="background-image" src="/image/CES_KV_bg.jpg" alt="" />
      <div className="intro-content">
        <div className="start-button-group">
          <div className="btn start-button" onClick={onClickStart}>
            <p className="start-button-text">Start AR Experience</p>
          </div>
        </div>
        <p className="device-warning">*For a better experience, mobile devices produced after 2019 are recommended.</p>
        <p className="device-warning">*Suggested OS & Browser: iOS 15.0, Android 9.0, Google Chrome 76 or above.</p>
      </div>
    </div>
  )
}

export default Intro;

Intro.propTypes = {
  style: PropTypes.object.isRequired,
};