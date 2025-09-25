export const metadata = {
  title: "Birthday",
  description: "Special day flow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Important for iPhone 15 Pro Max correct sizing */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <body>{children}</body>
    </html>
  );
}
