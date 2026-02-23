import "../globals.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="Footer_Container">

        <img src="/Logo_BlackColor.png" height={36} alt="logo" />

        <div className="footer_text">
          <div>woojeong.chon@gmail.com</div>
          <div>|</div>
          <div>055-320-3490</div>
          <div>|</div>
          <div>(50834) 경남 김해시 인제로 197 인제대학교 신어관(C동) 519호</div>
        </div>

        <div className="footer_text">Copyrightⓒ2026 weird LAB. All rights reserved.</div>

      </div>
    </footer>
  );
}