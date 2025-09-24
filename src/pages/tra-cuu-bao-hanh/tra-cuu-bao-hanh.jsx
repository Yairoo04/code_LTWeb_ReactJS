import "./style.scss"; // file SCSS
import Link from "next/link";
import { useState } from "react";
import React from 'react';
import MenuListShowroom from '../../layout/menu_list/menu_list_showroom';

const TraCuuBaoHanh = () => {
  const [activeTab, setActiveTab] = useState("content-a");

  return (
    <div className="showroom-system-container">
      {/* Menu bên trái */}
            <MenuListShowroom active="/tra-cuu-bao-hanh" />


      {/* Nội dung */}
      <div className="content">
        <div className="content-bao-hanh">
          <h1 className="tra-cuu-h1">Tra cứu bảo hành</h1>

          {/* Tabs chọn */}
          <div className="choice-box-bao-hanh">
            <div
              className={`choice-box ${activeTab === "content-a" ? "active" : ""}`}
              onClick={() => setActiveTab("content-a")}
            >
              Tra cứu phiếu bảo hành
            </div>
            <div
              className={`choice-box ${activeTab === "content-b" ? "active" : ""}`}
              onClick={() => setActiveTab("content-b")}
            >
              Tra cứu IMEI
            </div>
          </div>

          {/* Nội dung theo tab */}
          <div className="choice-content">
            {activeTab === "content-a" && (
              <div id="content-a" className="content-box active">
                <p>
                  Quý khách vui lòng nhập cả 2 trường thông tin (bắt buộc) để tra
                  cứu trạng thái của phiếu bảo hành.
                </p>
                <div className="input-sdt-bao-hanh">
                  <input placeholder="Số điện thoại" type="text" />
                  <input placeholder="Mã phiếu bảo hành" type="text" />
                  <button className="traCuu">Tra cứu</button>
                </div>
              </div>
            )}

            {activeTab === "content-b" && (
              <div id="content-b" className="content-box active">
                <input
                  placeholder="Mã IMEI/ Serial Number"
                  type="text"
                  name="imei"
                  required
                />
                <br />
                <br />

                {/* Google reCAPTCHA */}
                <div
                  className="g-recaptcha"
                  data-sitekey="6Ld9H8QrAAAAAHtMEXKaJjQ5f7zriolvQd207VMq"
                ></div>
                <br />
                <button type="submit">Tra cứu</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraCuuBaoHanh;
