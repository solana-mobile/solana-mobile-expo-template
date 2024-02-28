// Polyfills
import "react-native-get-random-values";
import { Buffer } from "buffer";
global.Buffer = Buffer;

import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConnectionProvider } from "./src/ConnectionProvider";
import { clusterApiUrl } from "@solana/web3.js";
import MainScreen from "./src/MainScreen";
import { Header } from "./src/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const APP_IDENTITY = {
  name: "Expo Starter Template",
};

export const CHAIN = "solana";
export const CLUSTER = "devnet";
export const CHAIN_IDENTIFIER = `${CHAIN}:${CLUSTER}`;

const queryClient = new QueryClient();

export default function App() {
  return (
    <ConnectionProvider
      config={{ commitment: "processed" }}
      endpoint={clusterApiUrl(CLUSTER)}
    >
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={styles.shell}>
          <Header />
          <MainScreen />
        </SafeAreaView>
      </QueryClientProvider>
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shell: {
    height: "100%",
  },
});
