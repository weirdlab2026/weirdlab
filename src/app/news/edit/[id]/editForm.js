'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import styles from "../../../css/projectDetail.module.css";
import Link from "next/link";
import TopBtn from "@/app/components/icons/topBtn";

export default function EditForm({ post }) {
  const router = useRouter();

  const [title, setTitle] = useState(post.title);
  const [enTitle, setEnTitle] = useState(post.enTitle);
  const [contents, setContents] = useState(post.contents);
  const [group, setGroup] = useState(post.group);
  const [uploadDate, setUploadData] = useState(post.uploadDate);

  let categoryList = ["Notice", "Event", "Activity", "Others"]

  // existingImages: 서버에 이미 올라가 있는 이미지 URL들
  const [existingImages, setExistingImages] = useState(post.images || []);
  
  // newFiles: 새로 추가하려는 로컬 파일 객체들 (아직 업로드 전)
  const [newFiles, setNewFiles] = useState([]); 
  // newPreviews: 새로 추가한 파일의 미리보기 URL
  const [newPreviews, setNewPreviews] = useState([]);

  const inputFileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // A. 기존 이미지 삭제 (화면에서만 안 보이게 처리, 실제 삭제는 수정 완료 시 또는 별도 API로)
  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // B. 새로 추가한 이미지 삭제
  const removeNewFile = (indexToRemove) => {
    setNewPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
    setNewFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    URL.revokeObjectURL(newPreviews[indexToRemove]); // 메모리 해제
  };

  const processFiles = (files) => {
    if (!files || files.length === 0) return;

    const addedFiles = Array.from(files);
    const addedPreviews = addedFiles.map((file) => URL.createObjectURL(file));

    setNewPreviews((prev) => [...prev, ...addedPreviews]);
    setNewFiles((prev) => [...prev, ...addedFiles]);
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
    e.target.value = ''; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let newUploadedUrls = [];

      // 1. 새로 추가된 파일이 있다면 Vercel Blob에 업로드
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(async (file) => {
          const response = await axios.post(`/api/image_upload?filename=${file.name}&folder=uploads`, file);
          return response.data;
        });

        const results = await Promise.all(uploadPromises);
        newUploadedUrls = results.map((res) => res.url);
      }

      // 2. [기존 유지된 이미지] + [새로 업로드된 이미지] 합치기
      const finalImages = [...existingImages, ...newUploadedUrls];

      // 3. DB 업데이트 요청 (PUT)
      const res = await axios.put("/api/news", {
        id: post._id,
        title,
        contents,
        images: finalImages
      });

      if (res.data.ok) {
        alert("수정되었습니다.");
        router.push('/');
        router.refresh();
      } else {
        alert("수정 실패: " + res.data.error);
      }

    } catch (error) {
      console.error(error);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 드래그 앤 드롭 핸들러
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

      <Link href="/news" className={styles.back_container}>
        <div className={styles.back_btn_container}><TopBtn /></div>
        <div className={`${styles.back_text} main_color`}>Back</div>
      </Link>

      <div className={styles.pro_decs_container}>
        <input 
          type="text" 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="영어 뉴스 제목"
          value={title}
          className={styles.pro_title}
          style={{border: 'none', outline: 'none', fontFamily: 'Pretendard'}}
        />
        <input 
          type="text" 
          onChange={(e) => setEnTitle(e.target.value)}
          value={enTitle}
          placeholder="한글 뉴스 제목"
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

          <div style={{display: 'flex', flexDirection: 'column'}}>
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
        </div>

        <textarea 
          placeholder="내용"
          onChange={(e) => setContents(e.target.value)}
          value={contents}
          className={styles.pro_contents}
          style={{border: 'none', outline: 'none', resize: 'none', fontFamily: 'Pretendard', height: '200px'}}
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
          <p style={{ textAlign: 'center', fontFamily: 'pretendard', fontSize: '18px', fontWeight: '500', lineHeight: '26px'}}>수정할 이미지를 드래그 앤 드롭<br/>또는 클릭하여 선택</p>
        </div>
        <input 
        ref={inputFileRef} 
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        />

        <div className={styles.pro_detail_content_container}>
          
          {/* A. 기존 이미지들 */}
          {existingImages.map((url, idx) => (
            <div key={`old-${idx}`} className={styles.pro_detail_img_container2}>
              <img src={url} className={styles.pro_detail_img} />
              <button onClick={() => removeExistingImage(idx)} className={styles.delete_btn}>X</button>
            </div>
          ))}

          {/* B. 새로 추가한 이미지들 */}
          {newPreviews.map((url, idx) => (
            <div key={`new-${idx}`} className={styles.pro_detail_img_container2}>
              <img src={url} className={styles.pro_detail_img} />
              <button onClick={() => removeNewFile(idx)} className={styles.delete_btn}>X</button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className={styles.submit_btn}
          style={{background: isUploading ? '#ccc' : '#6832FC'}}
        >
          {isUploading ? "수정 중..." : "수정 완료"}
        </button>

      </div>
    </div>
  );
}