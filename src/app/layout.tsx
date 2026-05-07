import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AcadeMetrics | Educational Evaluation Platform",
  description: "Next-gen platform for academic evaluation and coding assessments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased selection:bg-indigo-500/30`}>
        <AuthProvider>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              className: 'glass text-white border-white/10',
              duration: 4000,
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
