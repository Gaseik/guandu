import React from "react";

const DeviceOrientation = function (props) {
    return (
        <div className="deviceOrientation" style={{ ...props.style }}>
            <div className="phoneOrientation-group">
                <div className="icon-container">
                    <img className="phoneOrientation-icon" src="/image/icon/phoneOrientation.svg" alt="" />
                </div>
                <p className="phoneOrientation-text">Please turn your device to portrait mode to continue</p>
            </div>
        </div>
    )
}

export default DeviceOrientation;