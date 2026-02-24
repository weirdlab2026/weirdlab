'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function Post() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [source, setSource] = useState("Weird Lab");

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
    
    if (!title || !contents) {
      alert("제목과 내용을 입력해주세요.");
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
        contents,
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>새 게시글 작성</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="제목"
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
        <textarea 
          placeholder="내용"
          onChange={(e) => setContents(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', minHeight: '150px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>

      {/* 드래그 앤 드롭 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputFileRef.current.click()}
        style={{
          width: '100%',
          height: '150px',
          border: isDragging ? '3px solid #0070f3' : '2px dashed #ccc',
          backgroundColor: isDragging ? '#eaf4ff' : '#fafafa',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          cursor: 'pointer',
          marginBottom: '20px',
          color: '#666',
          transition: 'all 0.2s'
        }}
      >
        <p style={{ fontWeight: 'bold' }}>이미지 드래그 앤 드롭</p>
        <p style={{ fontSize: '12px' }}>또는 클릭하여 선택</p>
      </div>

      <input 
        ref={inputFileRef} 
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* 💡 미리보기 그리드 (여기에 삭제 버튼 추가됨)
      */}
      {previews.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {previews.map((url, index) => (
            <div key={index} style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
              
              {/* 이미지 */}
              <img 
                src={url} 
                alt={`preview-${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} 
              />

              {/* ❌ 삭제 버튼 */}
              <button
                onClick={() => removeImage(index)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={handleSubmit} 
        disabled={isUploading}
        style={{ 
          width: '100%', 
          padding: '15px', 
          backgroundColor: isUploading ? '#ccc' : '#0070f3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          fontSize: '16px', 
          fontWeight: 'bold',
          cursor: isUploading ? 'not-allowed' : 'pointer'
        }}
      >
        {isUploading ? '업로드 및 저장 중...' : '게시글 등록하기'}
      </button>

    </div>
  );
}