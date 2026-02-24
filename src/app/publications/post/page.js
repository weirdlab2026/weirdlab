'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function Post() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [source, setSource] = useState("Weird Lab");

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
        contents,
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

      {/* 드롭 영역 */}
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
          color: '#666'
        }}
      >
        <p style={{ fontWeight: 'bold' }}>PDF 드래그 앤 드롭</p>
        <p style={{ fontSize: '12px' }}>또는 클릭하여 선택</p>
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
        <div style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          padding:'10px',
          border:'1px solid #0070f3',
          borderRadius:'8px',
          marginBottom:'20px'
        }}>
          <span>{file.name}</span>
          <button onClick={removeFile}>삭제</button>
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