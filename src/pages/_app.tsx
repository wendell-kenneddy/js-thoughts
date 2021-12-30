import type { AppProps } from "next/app";

import { ChakraProvider } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "react-query";

import { theme } from "../styles/theme";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
