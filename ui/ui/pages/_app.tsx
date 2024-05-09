import type { AppProps } from 'next/app';
import { FirebaseProvider } from '@/lib/firebase/providers/firebase.provider';
import "@/styles/style.css"
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <FirebaseProvider>
        <Component {...pageProps} />
      </FirebaseProvider>
    </>
  );
}

export default MyApp;
