export default function Arrow({a,b}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" transform="rotate(180 24 24)" fill={a}/>
      <path d="M15 22.8333L24 14.5M24 14.5L33 22.8333M24 14.5L24 34.5" stroke={b} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
