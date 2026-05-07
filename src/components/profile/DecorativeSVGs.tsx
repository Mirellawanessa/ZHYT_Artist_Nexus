export const SquigglyLineTop = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 200 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0 50 C 40 10, 60 90, 100 50 C 140 10, 160 90, 200 50"
      stroke="#1a1a1a"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M50 85 C 10 50, 10 20, 30 10 C 45 5, 50 20, 50 30 C 50 20, 55 5, 70 10 C 90 20, 90 50, 50 85 Z"
      stroke="#1a1a1a"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const SquigglyLineBottom = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 150 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 70 L 40 40 L 70 70 L 100 20 L 130 50"
      stroke="#1a1a1a"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="140" cy="10" r="3" fill="#1a1a1a" />
  </svg>
);

export const SparkBurst = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M30 10 C 35 20, 35 30, 40 40"
      stroke="#1a1a1a"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M60 20 C 55 30, 50 40, 45 45"
      stroke="#1a1a1a"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M80 40 C 70 45, 60 45, 55 50"
      stroke="#1a1a1a"
      strokeWidth="8"
      strokeLinecap="round"
    />
  </svg>
);
