import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import styles from './styles.module.scss'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={styles.main}>
      <body className={inter.className}>
        <g className="nones"><p className="pnones"><span className="spans">Sakura</span> on mobile devices? <br></br>It's on the horizon!</p></g>
      <Providers>
        {children}
        </Providers>
      </body>
      
    </html>
  );
}
