import "./globals.css";

export const metadata = {
  title: "Ethio Machinery Link (EML)",
  description: "Machinery Marketplace for Ethiopia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}