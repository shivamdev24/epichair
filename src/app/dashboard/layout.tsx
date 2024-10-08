import DashNavbar from "@/components/dashboard/DashNavbar"; 





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <DashNavbar />
        {children}
      </body>
    </html>
  );
}
