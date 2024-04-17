import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NDKProvider } from "@/hooks/useNDK";

export default function App({ Component, pageProps }: AppProps) {
  return (
    // NDKProvider wraps the entire app giving all components access to the ndk instance
    <NDKProvider>
      <Component {...pageProps} /> {/* NOTE: these are the "children" */}
    </NDKProvider>
  );
}
