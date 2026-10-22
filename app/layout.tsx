import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie for Friends",
  description: "Movie for Friends NextJS App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}