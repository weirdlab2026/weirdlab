'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import styles from "../../css/projectDetail.module.css";
import Link from "next/link";
import TopBtn from "@/app/components/icons/topBtn";

export default function Post() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [enTitle, setEnTitle] = useState("");
  const [contents, setContents] = useState("");
  const [group, setGroup] = useState("");
  const [category, setCategory] = useState("");
  const [uploadDate, setUploadData] = useState("");
  const [members, setMembers] = useState("");
  const [source, setSource] = useState("Weird Lab");

  let categoryList = ["All Papers", "Journal Papers", "Conference Papers", "Others"]

  // ✅ 단일 PDF 파일
  const [file, setFile] = useState(null);

  const inputFileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false); 
  const [isDragging, setIsDragging] = useState(false); 

  const removeFile = () => setFile(null);

  const processFile = (fileObj) => {
    if (!fileObj) return;

    if (fileObj.type !== "application/pdf") {
      alert("PDF만 업로드 가능합니다.");
      return;
    }

    setFile(fileObj);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !contents) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setIsUploading(true); 

    try {
      let fileUrl = null;

      // ✅ PDF 업로드
      if (file) {
        const response = await axios.post(
          `/api/image_upload?filename=${file.name}&folder=pdf`,
          file
        );
        fileUrl = response.data.url;
      }

      // ✅ 저장
      const res = await axios.post("/api/publications", { 
        title, 
        enTitle,
        contents,
        group,
        category,
        uploadDate,
        members,
        source,
        file: fileUrl
      });

      if (res.data.ok) {
        alert("등록되었습니다.");
        router.push("/publications");
      } else {
        alert("작성 권한이 없습니다.");
      }

    } catch (error) {
      console.error(error);
      alert("업로드 실패!");
    } finally {
      setIsUploading(false); 
    }
  }

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleDateChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.slice(0, 6);

    let year = value.slice(0, 4);
    let month = value.slice(4, 6);

    if (month.length === 1) {
      if (parseInt(month) > 1) {
        month = "0" + month;
      }
    }

    if (month.length === 2) {
      let monthNum = parseInt(month);

      if (monthNum === 0) month = "01";
      if (monthNum > 12) month = "12";
    }

    if (month.length > 0) {
      value = `${year}.${month}`;
    } else {
      value = year;
    }
    setUploadData(value);
  };

  return (
    <div className={styles.pro_detail_container}>

      <Link href="/projects" className={styles.back_container}>
        <div className={styles.back_btn_container}><TopBtn /></div>
        <div className={`${styles.back_text} main_color`}>Back</div>
      </Link>
      
      <div className={styles.pro_decs_container}>
        <input 
          type="text" 
          placeholder="영어 논문명"
          onChange={(e) => setTitle(e.target.value)}
          className={styles.pro_title}
          style={{border: 'none', outline: 'none', fontFamily: 'Pretendard'}}
        />
        <input 
          type="text" 
          placeholder="한글 논문명"
          onChange={(e) => setEnTitle(e.target.value)}
          className={styles.pro_en_title}
          style={{border: 'none', outline: 'none', fontFamily: 'Pretendard', marginBottom: '60px'}}
        />

        <div className={styles.pro_info_container}>
          <div>
            <div className={styles.pro_info_title}>Group</div>
            <div className={styles.pro_info_desc}>
              <div className={styles.pro_info_desc}
              style={{border: 'none', outline: 'none', fontFamily: 'pretendard', width: '212px', marginBottom: '20px'}}>
                {group || "그룹, 아래에서 선택"}
              </div>
              {
                categoryList.map((item, index)=>{
                  return (
                    <div key={index} onClick={() => setGroup(item)} className={styles.select_group}>
                      {item}
                    </div>
                  )
                })
              }
            </div>
          </div>

          <div>
            <div className={styles.pro_info_title}>Society</div>
            <input 
              type="text" 
              placeholder="학회"
              onChange={(e) => setCategory(e.target.value)}
              className={styles.pro_info_desc}
              style={{border: 'none', outline: 'none', fontFamily: 'pretendard', width: '212px'}}
            />
          </div>

          <div>
            <div className={styles.pro_info_title}>Upload Date</div>
            <input 
              type="text" 
              placeholder="숫자만(예:2000.12)"
              value={uploadDate}
              onChange={handleDateChange}
              className={styles.pro_info_desc}
              style={{border: 'none', outline: 'none', fontFamily: 'pretendard', width: '212px'}}
            />
          </div>

          <div>
            <div className={styles.pro_info_title}>Authors</div>
            <input 
              type="text" 
              placeholder="저자"
              onChange={(e) => setMembers(e.target.value)}
              className={styles.pro_info_desc}
              style={{border: 'none', outline: 'none', fontFamily: 'pretendard', width: '212px'}}
            />
          </div>

        </div>

        <textarea 
          placeholder="내용"
          onChange={(e) => setContents(e.target.value)}
          className={styles.pro_contents}
          style={{border: 'none', outline: 'none', resize: 'none', fontFamily: 'Pretendard', height: '180px'}}
        />
      
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputFileRef.current.click()}
          className={styles.drop_field}
          style={{
            border: isDragging ? '1px solid #6832FC' : '1px dashed #888',
            backgroundColor: isDragging ? '#eaf4ff' : '#fafafa',
          }}
        >
          <p style={{ textAlign: 'center', fontFamily: 'pretendard', fontSize: '18px', fontWeight: '500', lineHeight: '26px'}}>PDF 드래그 앤 드롭<br/>또는 클릭하여 선택</p>
        </div>

        <input 
          ref={inputFileRef} 
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* 선택된 파일 UI */}
        {file && (
          <div className={styles.pdf_check_field}>
            <span>{file.name}</span>
            <button onClick={removeFile} className={styles.delete_btn}>X</button>
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={isUploading}
          className={styles.submit_btn}
          style={{ 
            backgroundColor: isUploading ? '#ccc' : '#6832FC', 
            cursor: isUploading ? 'not-allowed' : 'pointer',
          }}
        >
          {isUploading ? '업로드 중...' : '게시글 등록하기'}
        </button>
      </div>
    </div>
  );
}