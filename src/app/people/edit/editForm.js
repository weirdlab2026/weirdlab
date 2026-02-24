"use client";

import { useState } from "react";
import axios from "axios";

export default function ProfileEditForm({ initialData }) {

  const [formData, setFormData] = useState({
    education: initialData?.education || [],
    experience: initialData?.experience || [],
    awards: initialData?.awards || [],
    research: initialData?.research || [],
    phdStudents: initialData?.phdStudents || [],
    masterStudents: initialData?.masterStudents || [],
    alumniPhd: initialData?.alumniPhd || "",
    alumniMaster: initialData?.alumniMaster || "",
  });

  const [uploading, setUploading] = useState(false);

  // 단순 텍스트 배열 항목 업데이트
  const handleStringArrayChange = (category, index, value) => {
    const newArray = [...formData[category]];
    newArray[index] = value;
    setFormData({ ...formData, [category]: newArray });
  };

  // 단순 텍스트 배열 항목 추가
  const addStringItem = (category) => {
    setFormData({ ...formData, [category]: [...formData[category], ""] });
  };

  // 단순 텍스트 배열 항목 삭제
  const removeStringItem = (category, index) => {
    const newArray = formData[category].filter((_, i) => i !== index);
    setFormData({ ...formData, [category]: newArray });
  };

  // 학생 데이터 업데이트
  const handleStudentChange = (category, index, field, value) => {
    const newStudents = [...formData[category]];
    newStudents[index][field] = value;
    setFormData({ ...formData, [category]: newStudents });
  };

  // 학생 추가
  const addStudent = (category) => {
    setFormData({
      ...formData,
      [category]: [...formData[category], { name: "", field: "", email: "", photoUrl: "" }],
    });
  };

  // 학생 삭제
  const removeStudent = (category, index) => {
    const newStudents = formData[category].filter((_, i) => i !== index);
    setFormData({ ...formData, [category]: newStudents });
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e, category, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await fetch(`/api/image_upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!res.ok) throw new Error("업로드 실패");
      
      const blob = await res.json();
      handleStudentChange(category, index, "photoUrl", blob.url);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // 이미지 개별 삭제 핸들러
  const handleImageDelete = async (category, index, blobUrl) => {
    if (!blobUrl) return;

    try {
      const res = await fetch(`/api/image_upload?blobUrl=${encodeURIComponent(blobUrl)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제 실패");
      handleStudentChange(category, index, "photoUrl", "");
    } catch (error) {
      console.error("Image delete error:", error);
      alert("이미지 삭제에 실패했습니다.");
    }
  };

  // 폼 제출 핸들러 (수정된 데이터 전송)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/people", formData);

      if (response.data.ok) {
        alert("프로필 정보가 성공적으로 저장되었습니다.");
      } else {
        throw new Error(response.data.error || "저장 실패");
      }
    } catch (error) {
      console.error("Save error:", error);

      const errorMessage = error.response?.data?.error || "저장 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h1>프로필 정보 수정</h1>
        <button type="submit">
          변경사항 저장
        </button>
      </div>

      {["education", "experience", "awards", "research"].map((category) => (
        <section key={category}>
          <div>
            <h2>{category}</h2>
            <button type="button" onClick={() => addStringItem(category)}>
              + 항목 추가
            </button>
          </div>
          {formData[category].map((item, index) => (
            <div key={index}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleStringArrayChange(category, index, e.target.value)}
                placeholder={`${category} 항목을 입력하세요`}
              />
              <button type="button" onClick={() => removeStringItem(category, index)}>
                삭제
              </button>
            </div>
          ))}
          {formData[category].length === 0 && (
            <div>
              등록된 항목이 없습니다. 우측 상단의 버튼을 눌러 추가해주세요.
            </div>
          )}
        </section>
      ))}

      {["phdStudents", "masterStudents"].map((category) => (
        <section key={category}>
          <div>
            <h2>{category === "phdStudents" ? "PhD Student" : "Master's Student"}</h2>
            <button type="button" onClick={() => addStudent(category)}>
              + 학생 추가
            </button>
          </div>
          
          {formData[category].length === 0 ? (
            <div>
              등록된 학생이 없습니다. 우측 상단의 버튼을 눌러 추가해주세요.
            </div>
          ) : (
            <div>
              {formData[category].map((student, index) => (
                <div key={index}>
                  <button type="button" onClick={() => removeStudent(category, index)}>
                    학생 삭제
                  </button>

                  <div>
                    <div>
                      {student.photoUrl ? (
                        <>
                          <img src={student.photoUrl} alt="profile" />
                          <button
                            type="button"
                            onClick={() => handleImageDelete(category, index, student.photoUrl)}
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        <span>
                          {uploading ? "업로드 중..." : "사진 없음"}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <label>프로필 사진</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, category, index)}
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  <div>
                    <label>이름</label>
                    <input type="text" value={student.name || ""} onChange={(e) => handleStudentChange(category, index, "name", e.target.value)} placeholder="홍길동" />
                  </div>
                  <div>
                    <label>분야</label>
                    <input type="text" value={student.field || ""} onChange={(e) => handleStudentChange(category, index, "field", e.target.value)} placeholder="UX/UI Design..." />
                  </div>
                  <div>
                    <label>이메일</label>
                    <input type="email" value={student.email || ""} onChange={(e) => handleStudentChange(category, index, "email", e.target.value)} placeholder="email@example.com" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
      
      {/* 졸업생 섹션 */}
      <section>
        <h2>Alumni</h2>
        <div>
          <div>
            <label>PhD Alumni</label>
            <textarea value={formData.alumniPhd} onChange={(e) => setFormData({ ...formData, alumniPhd: e.target.value })} placeholder="박사 졸업생 명단 입력 (예: 홍길동 (2025))" />
          </div>
          <div>
            <label>Master's Alumni</label>
            <textarea value={formData.alumniMaster} onChange={(e) => setFormData({ ...formData, alumniMaster: e.target.value })} placeholder="석사 졸업생 명단 입력 (예: 홍길동 (2025), 김철수 (2024)...)" />
          </div>
        </div>
      </section>
    </form>
  );
}