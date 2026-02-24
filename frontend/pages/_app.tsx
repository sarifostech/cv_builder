import Head from 'next/head';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CV Creator – Build Your CV</title>
        <meta name="description" content="Create an ATS-friendly CV with our easy builder. Export PDFs and get AI tips." />
        <link rel="canonical" href="https://cv-creator.example.com/" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
