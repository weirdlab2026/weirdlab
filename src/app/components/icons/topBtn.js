export default function TopBtn() {
  return (
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width="48" 
  height="48" 
  viewBox="0 0 48 48" 
  fill="none"
>
  <style>
    {`
      .circle {
        fill: white;
        transition: all 0.3s ease;
      }

      .arrow {
        stroke: #6832FC;
        transition: all 0.3s ease;
      }

      svg:hover .circle {
        fill: #6832FC;
      }

      svg:hover .arrow {
        stroke: #58FF00;
      }
    `}
  </style>

  <path 
    className="circle"
    d="M24 47C11.2975 47 1 36.7026 0.999998 24C0.999997 11.2975 11.2975 1 24 1C36.7025 1 47 11.2974 47 24C47 36.7025 36.7025 47 24 47Z" 
    stroke="#6832FC" 
    strokeWidth="2"
  />
  
  <path 
    className="arrow"
    d="M17 28L24 20L31 28" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  />
</svg>

  );
}