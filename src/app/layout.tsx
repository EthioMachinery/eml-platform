import "./globals.css";

export const metadata = {
  title: "Ethio Machinery Link (EML)",
  description: "Machinery marketplace platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        {children}
      </body>
    </html>
  );
}