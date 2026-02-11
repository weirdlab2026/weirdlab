'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function EditForm({ post }) {
  const router = useRouter();

  const [title, setTitle] = useState(post.title);
  const [contents, setContents] = useState(post.contents);

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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>게시글 수정</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <label>제목</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ padding: '8px' }}
        />
        <label>내용</label>
        <textarea 
          value={contents} 
          onChange={(e) => setContents(e.target.value)} 
          style={{ padding: '8px', minHeight: '150px' }}
        />
      </div>

      {/* --- 이미지 관리 영역 --- */}
      <h3>이미지 수정</h3>
      
      {/* 1. 드래그 앤 드롭 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputFileRef.current.click()}
        style={{
          width: '100%', height: '100px',
          border: isDragging ? '3px solid #0070f3' : '2px dashed #ccc',
          backgroundColor: isDragging ? '#eaf4ff' : '#fafafa',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', marginBottom: '20px', color: '#666'
        }}
      >
        <p>추가할 이미지를 드래그하거나 클릭하세요</p>
      </div>
      <input ref={inputFileRef} type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />

      {/* 2. 이미지 미리보기 및 삭제 영역 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        
        {/* A. 기존 이미지들 */}
        {existingImages.map((url, idx) => (
          <div key={`old-${idx}`} style={{ position: 'relative', aspectRatio: '1/1' }}>
            <img src={url} alt="existing" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '2px solid #ddd' }} />
            <button 
              onClick={() => removeExistingImage(idx)}
              style={{ position: 'absolute', top: 5, right: 5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}
            >X</button>
            <span style={{ position: 'absolute', bottom: 5, left: 5, background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '3px'}}>기존</span>
          </div>
        ))}

        {/* B. 새로 추가한 이미지들 */}
        {newPreviews.map((url, idx) => (
          <div key={`new-${idx}`} style={{ position: 'relative', aspectRatio: '1/1' }}>
            <img src={url} alt="new" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '2px solid #0070f3' }} />
            <button 
              onClick={() => removeNewFile(idx)}
              style={{ position: 'absolute', top: 5, right: 5, background: 'black', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}
            >X</button>
            <span style={{ position: 'absolute', bottom: 5, left: 5, background: '#0070f3', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '3px'}}>신규</span>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={isUploading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        {isUploading ? "수정 중..." : "수정 완료"}
      </button>
    </div>
  );
}