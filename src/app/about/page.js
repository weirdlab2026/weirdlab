'use client'

import styles from "../css/about.module.css";
import { useState } from "react";
import Arrow from "../components/icons/arrow";
import Mail from "../components/icons/mail";
import Blank from "../components/icons/blank";

export default function About() {

  let [nowShow, setNowShow] = useState(0);
  const research_field = [
    {
      title: "Human–AI Collaborative Design",
      desc: "인간과 인공지능이 역할을 나누어 함께 결과물을 만들어가는 협업 중심 디자인 방식이다. AI는 데이터 분석, 패턴 도출, 아이디어 확장을 지원하고, 인간은 맥락 이해와 가치 판단을 담당한다. 기술과 창의성이 상호 보완적으로 작동하는 새로운 디자인 패러다임이다."
    },
    {
      title: "Generative AI–Enabled Design",
      desc: "인간과 인공지능이 역할을 나누어 함께 결과물을 만들어가는 협업 중심 디자인 방식이다. AI는 데이터 분석, 패턴 도출, 아이디어 확장을 지원하고, 인간은 맥락 이해와 가치 판단을 담당한다. 기술과 창의성이 상호 보완적으로 작동하는 새로운 디자인 패러다임이다.기술과 창의성이 상호 보완적으로 작동하는 새로운 디자인 패러다임이다.2"
    },
    {
      title: "UX / UI Design",
      desc: "인간과 인공지능이 역할을 나누어 함께 결과물을 만들어가는 협업 중심 디자인 방식이다. AI는 데이터 분석, 패턴 도출, 아이디어 확장을 지원하고, 인간은 맥락 이해와 가치 판단을 담당한다. 기술과 창의성이 상호 보완적으로 작동하는 새로운 디자인 패러다임이다.기술과 창의성이 상호 보완적으로 작동하는 새로운 디자인 패러다임이다.기술과 창의성이 상호 보완적으로 작동하는 새로운 디자인 패러다임이다.3"
    },
    {
      title: "Service Design",
      desc: "인간과 인공지능이 역할을 나누어 함께 결과물을 만들어가는 협업 중심 디자인 방식이다. AI는 데이터 분석, 패턴 도출, 아이디어 확장을 지원하고, 인간은 맥락 이해와 가치 판단을 담당한다. 기술과 창의성이 상호 보완적으로 작동하는 새로운 디자인 패러다임이다기술과 창의성이 상호 보완적으로 작동하는 새로운 디자인 패러다임이다.기술과 창의성이 상호 보완적으로 작동하는 새로운 디자인 패러다임이다.4"
    },
  ]

  return (
    <div>
      {/* 안의 텍스트는 전부 변경 필요 */}
      <div className={styles.about_text}>We study <span className='main_color'>design activity</span> through<br/>the cognitive structures of<br/>thinking that shape designers’<br/>processes of <span className='main_color'>problem recognition,</span><br/>interpretation</div>

      <div className={styles.about_container}>
        <div className={styles.introduce_container}>
          <div className={styles.introduce_text}>
            Introduce
          </div>
          <div className={styles.introduce_desc}>
            인제대학교 weird 랩은 DEsign Experience for People의 약자로 사람들에게 좋은 경험을 제공할 수 있도록 깊이 연구하여 좋은 디자인을 만들겠다’ 라는 바램과 가치관이 담겨있습니다. DEEP 랩에서 집중하고 있는 연구분야로는 면밀한 사용자 조사를 기반으로 한 UX·UI 연구, 사용자의 행동을 유도하고 기만하는 Persuasive 디자인 연구, 수집된 데이터를 시각화하여 인사이트를 제공하는 Data Visualization 연구, 인공지능 솔루션을 효과적으로 사용할 있도록 도와주는 AI Interaction Design 연구 등으로 구성되어 있습니다.
          </div>
        </div>

        <div className={styles.introduce_container}>
          <div className={styles.introduce_text}>
            Research<br/>Field
          </div>
          <div>
            {research_field.map((item, index) => (
              <div key={index} className={styles.research_container} onClick={() => setNowShow(index)}>
                <div className={styles.research_title_container}>
                  <div className={nowShow === index ? styles.research_title : styles.research_title_hidden}>{item.title}</div>
                  
                  <div className={nowShow === index ? styles.accordion_open : styles.accordion_closed}>
                    <div className={styles.accordion_inner}>
                      <div className={styles.research_desc}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={nowShow === index ? styles.pointer : styles.pointer_reverse}>
                  <Arrow a={nowShow === index ? "#6832FC" : "#58FF00"} b={nowShow === index ? "#58FF00" : "#6832FC"}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.introduce_container}>

          <div className={styles.introduce_text}>
            Contact
          </div>

          <div className={styles.contact_container}>
            <div className={styles.contact_text}>
              <span className="color888">Prof.</span><br/>WOOJEONG CHON
            </div>
            <div>
              <div className={styles.contact_text}>
                <span className="color888">INJE UNIVERSITY</span><br/>
                C-519, 197 INJE-RO, GIMHAE-SI, GYEONGSANGNAM-DO
              </div>
              <div className={styles.info_container}>
                <div className={styles.contact_info_container}>
                  <Mail/>
                  <div className={styles.contact_info}>woojeong.chon@gmail.com</div>
                </div>
                <div className={styles.contact_info_container}>
                  <Blank/>
                  <div className={styles.contact_info} style={{marginLeft:"2px"}}>https://weirdlab.org/</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}