'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');

      alert('로그아웃 되었습니다.');
      router.push('/');
      router.refresh();
      
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };

  return (
    <button onClick={handleLogout}>
      로그아웃
    </button>
  );
}