import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metrica",
  description: "Metrica Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

