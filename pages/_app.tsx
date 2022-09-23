import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { useRouter } from "next/router";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  const pathName = useRouter();
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
        refreshInterval: 100,
      }}
    >
      <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} />
      </div>
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={() => {
          window.fbAsyncInit = function () {
            FB.init({
              appId: "your-app-id",
              autoLogAppEvents: true,
              xfbml: true,
              version: "v15.0",
            });
          };
        }}
      />
    </SWRConfig>
  );
}

export default MyApp;
