import "./globals.css";

export const metadata = {
  title: "문의하기",
  description: "문의 접수 폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
