import { cookies } from 'next/headers'
import LogoutButton from './logoutBtn';
import LoginForm from './loginForm';

export default async function RegisterWeirdlabChon() {

  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  return (
    <div>
      {token ? <LogoutButton/> : <LoginForm/>}
    </div>
  );
}