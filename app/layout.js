import "./globals.css";

export const metadata = {
  title: "weirdLab",
  description: "weirdlab",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
