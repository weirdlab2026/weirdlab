'use client'

import axios from "axios";
import { useState } from 'react';
import { useRouter } from "next/navigation";


export default function Login() {

  const router = useRouter();

  const [pw, setPw] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { password: pw });
      if (res.status === 200) {
        alert('관리자 로그인 되었습니다.');
        router.push('/');
        router.refresh();
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };

  return (
      <div>
        login
        <input type="text" value={pw} onChange={(e) => setPw(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
  );
}