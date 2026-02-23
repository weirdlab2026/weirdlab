'use client'

import "../globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {

  const pathname = usePathname();

  return (
    <header className="header_gnb">

      <div className="header_container">

        <Link href="/" className='gnb_link'>
          <img src="/Logo_MainColor.png" height={24} alt="logo" />
        </Link>

        <div className="Link_Container">

          <Link href="/about" className={pathname === '/about' ? 'gnb_link_selected' : 'gnb_link'}>ABOUT</Link>
          <Link href="/people" className={pathname === '/people' ? 'gnb_link_selected' : 'gnb_link'}>PEOPLE</Link>

          <Link href="/projects" className={pathname === '/projects' ? 'gnb_link_selected' : 'gnb_link'}>PROJECTS</Link>

          <Link href="/publications" className={pathname === '/publications' ? 'gnb_link_selected' : 'gnb_link'}>PUBLICATIONS</Link>

          <Link href="/news" className={pathname === '/news' ? 'gnb_link_selected' : 'gnb_link'}>NEWS</Link>

        </div>
        
      </div>
    </header>
  );
}