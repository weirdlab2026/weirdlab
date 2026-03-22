import Link from "next/link";
import styles from "../css/people.module.css";
import connectDB from "@/lib/mongodb";
import { cookies } from "next/headers";
import TopBtn from "../components/icons/topBtn";
import Mail from "../components/icons/mail";
import Blank from "../components/icons/blank";

export default async function People() {

  const db = (await connectDB).db("weirdlab_people");
  const data = await db.collection("people").findOne({});

  const cookieStore =await cookies();
  const hasToken = cookieStore.get('admin_token')?.value;

  return (
    <div>
      <div className={styles.people_container}>

        <div className={styles.people_left_container}>
          <img className={styles.prof_photo} />
          {
            hasToken ? <Link href="/people/edit">편집</Link> : null
          }
          <div className={styles.top_btn_container}>
            <TopBtn />
          </div>
        </div>

        <div className={styles.people_card_container}>
          <div style={{marginBottom:'60px'}}>
            <div className={styles.prof}>Professor.</div>
            <div className={styles.prof_name}>WOOJEONG CHON</div>
          </div>

          <div style={{marginBottom:'80px'}}>
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

          <div>
            <div className={styles.edawtoex_container}>
              <div>
                <div style={{marginBottom:'100px'}}>
                  <div className={styles.edawtoex_title}>Education</div>
                  {
                    data?.education.map((item, index) => (
                      <div key={index} className={styles.edawtoex_text}>
                        <div>{item}</div>
                      </div>
                    ))
                  }
                </div>

                <div>
                  <div className={styles.edawtoex_title}>Award</div>
                  {
                    data?.awards.map((item, index) => (
                      <div key={index} className={styles.edawtoex_text}>
                        <div>{item}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div>
                <div className={styles.edawtoex_title}>Experience</div>
                {
                  data?.experience.map((item, index) => (
                    <div key={index} className={styles.edawtoex_text}>
                      <div>{item}</div>
                    </div>
                  ))
                }
              </div>
            </div>

            <div>
              <div className={styles.edawtoex_title}>Research</div>
              {
                data?.research.map((item, index) => (
                  <div key={index} className={styles.edawtoex_text}>
                    <div>{item}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>


      <div className={styles.people_container}>

        <div className={styles.people_left_container}>
          <div className={styles.text_student}>Student</div>
        </div>

        <div className={styles.people_card_container}>
          <div>
            <div>
              <div>Master's Student</div>
              <div>
                {data?.masterStudents.map((student, index) => (
                  <div key={index}>
                    <div>{student.name}</div>
                    <div>{student.field}</div>
                    <div>{student.email}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div>PhD Student</div>
              <div>
                {data?.phdStudents.map((student, index) => (
                  <div key={index}>
                    <div>{student.name}</div>
                    <div>{student.field}</div>
                    <div>{student.email}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}