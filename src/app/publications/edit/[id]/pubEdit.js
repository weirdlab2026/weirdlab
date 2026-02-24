'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function EditForm({ post }) {
  const router = useRouter();

  const [title, setTitle] = useState(post.title);
  const [contents, setContents] = useState(post.contents);

  // 기존 PDF (하나)
  const [existingFile, setExistingFile] = useState(post.file || null);

  // 새 PDF (하나)
  const [newFile, setNewFile] = useState(null);

  const inputFileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const removeExistingFile = () => setExistingFile(null);
  const removeNewFile = () => setNewFile(null);

  const processFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("PDF만 업로드 가능합니다.");
      return;
    }
    setNewFile(file);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalFileUrl = existingFile;

      // 새 파일 업로드
      if (newFile) {
        const response = await axios.post(
          `/api/image_upload?filename=${newFile.name}&folder=pdf`,
          newFile
        );
        finalFileUrl = response.data.url;
      }

      const res = await axios.put("/api/publications", {
        id: post._id,
        title,
        contents,
        file: finalFileUrl
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

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
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

      <h3>PDF 파일</h3>

      {/* 드롭 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputFileRef.current.click()}
        style={{
          width: '100%',
          height: '100px',
          border: isDragging ? '3px solid #0070f3' : '2px dashed #ccc',
          backgroundColor: isDragging ? '#eaf4ff' : '#fafafa',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          marginBottom: '20px',
          color: '#666'
        }}
      >
        <p>PDF를 드래그하거나 클릭하세요</p>
      </div>

      <input
        ref={inputFileRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* 기존 파일 */}
      {existingFile && !newFile && (
        <div style={{ display:'flex', justifyContent:'space-between', padding:'8px', border:'1px solid #ddd', borderRadius:'6px', marginBottom:'10px' }}>
          <a href={existingFile} target="_blank">기존 PDF 보기</a>
          <button onClick={removeExistingFile}>삭제</button>
        </div>
      )}

      {/* 새 파일 */}
      {newFile && (
        <div style={{ display:'flex', justifyContent:'space-between', padding:'8px', border:'1px solid #0070f3', borderRadius:'6px', marginBottom:'10px' }}>
          <span>{newFile.name}</span>
          <button onClick={removeNewFile}>삭제</button>
        </div>
      )}

      <button onClick={handleSubmit} disabled={isUploading} style={{ padding: '10px 20px' }}>
        {isUploading ? "업로드 중..." : "수정 완료"}
      </button>
    </div>
  );
}