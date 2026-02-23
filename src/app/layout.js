import Header from "./components/header";
import Footer from "./components/footer";

export const metadata = {
  title: "weirdLab",
  description: "weirdlab",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="layout">
        <Header />
        <main className="content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}