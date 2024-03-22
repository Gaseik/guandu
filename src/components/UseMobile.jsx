import React from "react";

export function UseMobile() {
  return (
    <div>
      <div className="use-mobile-background">
        <div className="contain-group">
          <div className="icon-group">
            <img src="/image/icon/computer-icon.svg" className="computer-icon" alt="" />
            <img src="/image/icon/east-icon.svg" className="east-icon" alt="" />
            <img src="/image/icon/phone-icon.svg" className="phone-icon" alt="" />
          </div>
          <div className="use-mobile-text">
            <p>Please visit the ASUS CES 2023 event site below</p>
            <p>to experience the Augmented Reality on your mobile device!</p>
            <a href="https://www.asus.com/event/ces/">https://www.asus.com/event/ces/</a>
          </div>
          <p className="slogan"> Reveal the next incredible ASUS technology with us!</p>
        </div>
        <img className="asus-logo" src="/image/ASUS-logo.png" alt="" />
      </div>
    </div>
  )
}