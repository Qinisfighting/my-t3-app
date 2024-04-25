import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import {Toaster} from "react-hot-toast";
import { api } from "~/utils/api";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <main className={`font-sans ${inter.variable}`}>
        <Toaster position="top-center"/>
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
