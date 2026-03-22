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


  let categoryList = ["Industry–Academia Collaboration", "Awards", "Others"]


  // 1. 파일 관리를 위한 상태 (여기가 핵심!)
  // previews: 보여줄 이미지 URL들
  // selectedFiles: 실제 서버로 보낼 파일 객체들
  const [previews, setPreviews] = useState([]); 
  const [selectedFiles, setSelectedFiles] = useState([]); 

  const inputFileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false); 
  const [isDragging, setIsDragging] = useState(false); 

  // ---------------------------------------------------------
  // [삭제 기능] 특정 인덱스의 이미지와 파일을 제거
  // ---------------------------------------------------------
  const removeImage = (indexToRemove) => {
    // 1. 미리보기 URL 제거
    setPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
    
    // 2. 실제 전송할 파일 목록에서 제거
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));

    // (선택사항) 메모리 누수 방지를 위해 URL 해제
    URL.revokeObjectURL(previews[indexToRemove]);
  };

  // ---------------------------------------------------------
  // [파일 처리] 드래그나 클릭으로 들어온 파일을 상태에 추가
  // ---------------------------------------------------------
  const processFiles = (files) => {
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    // 기존 목록 뒤에 이어 붙이기 (여러 번 나눠서 추가 가능하게 함)
    setPreviews((prev) => [...prev, ...newPreviews]);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
    // 같은 파일을 다시 선택할 수 있도록 input 초기화
    e.target.value = ''; 
  };

  // ---------------------------------------------------------
  // [제출] selectedFiles 배열을 사용하여 업로드
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !contents || !enTitle || !group || !category || !members || !uploadDate) {
      alert("모든 내용을 입력해주세요.");
      return;
    }

    setIsUploading(true); 

    try {
      let finalImageUrls = [];

      // A. selectedFiles 상태에 있는 파일들을 업로드
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(async (file) => {
          const response = await axios.post(`/api/image_upload?filename=${file.name}`, file);
          return response.data;
        });

        const results = await Promise.all(uploadPromises);
        finalImageUrls = results.map((result) => result.url);
        
        console.log("업로드 된 이미지들:", finalImageUrls);
      }

      // B. 텍스트 + 이미지 URL 저장
      const res = await axios.post("/api/projects", { 
        title, 
        enTitle,
        contents,
        group,
        category,
        uploadDate,
        members,
        source,
        images: finalImageUrls
      });

      if (res.data.ok) {
        alert("등록되었습니다.");
        router.push("/projects");
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

  // 드래그 앤 드롭 이벤트 핸들러들
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
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
          placeholder="한글 프로젝트명"
          onChange={(e) => setTitle(e.target.value)}
          className={styles.pro_title}
          style={{border: 'none', outline: 'none', fontFamily: 'Pretendard'}}
        />
        <input 
          type="text" 
          placeholder="영문 프로젝트명"
          onChange={(e) => setEnTitle(e.target.value)}
          className={styles.pro_en_title}
          style={{border: 'none', outline: 'none', fontFamily: 'Pretendard'}}
        />
        <textarea 
          placeholder="내용"
          onChange={(e) => setContents(e.target.value)}
          className={styles.pro_contents}
          style={{border: 'none', outline: 'none', resize: 'none', fontFamily: 'Pretendard'}}
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
            <div className={styles.pro_info_title}>Category</div>
            <input 
              type="text" 
              placeholder="카테고리"
              onChange={(e) => setCategory(e.target.value)}
              className={styles.pro_info_desc}
              style={{border: 'none', outline: 'none', fontFamily: 'pretendard', width: '212px'}}
            />
          </div>

          <div>
            <div className={styles.pro_info_title}>Date</div>
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
            <div className={styles.pro_info_title}>Members</div>
            <input 
              type="text" 
              placeholder="멤버"
              onChange={(e) => setMembers(e.target.value)}
              className={styles.pro_info_desc}
              style={{border: 'none', outline: 'none', fontFamily: 'pretendard', width: '212px'}}
            />
          </div>

        </div>

        {/* 드래그 앤 드롭 영역 */}
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
          <p style={{ textAlign: 'center', fontFamily: 'pretendard', fontSize: '18px', fontWeight: '500', lineHeight: '26px'}}>이미지 드래그 앤 드롭<br/>또는 클릭하여 선택</p>
        </div>

        <input 
          ref={inputFileRef} 
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {previews.length > 0 && (
          <div className={styles.pro_detail_content_container}>
            {previews.map((url, index) => (
              <div key={index} className={styles.pro_detail_img_container2}>
                <img src={url}/>
                <button onClick={() => removeImage(index)} className={styles.delete_btn}>X</button>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={isUploading}
          style={{ 
            backgroundColor: isUploading ? '#ccc' : '#6832FC', 
            cursor: isUploading ? 'not-allowed' : 'pointer',
          }}
          className={styles.submit_btn}
        >
          {isUploading ? '프로젝트 업로드 중...' : '프로젝트 등록하기'}
        </button>
      </div>

    </div>
  );
}