// Polyfills
import "react-native-get-random-values";
import { Buffer } from "buffer";
global.Buffer = Buffer;

import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConnectionProvider } from "./src/ConnectionProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";

import { AppNavigator } from "./src/navigators/AppNavigator";
import { ClusterProvider } from "./src/components/cluster/cluster-data-access";

export const APP_IDENTITY = {
  name: "Expo Starter Template",
};

export const CHAIN = "solana";
export const CLUSTER = "devnet";
export const CHAIN_IDENTIFIER = `${CHAIN}:${CLUSTER}`;

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClusterProvider>
        <ConnectionProvider config={{ commitment: "processed" }}>
          <SafeAreaView style={styles.shell}>
            <PaperProvider>
              <AppNavigator />
            </PaperProvider>
          </SafeAreaView>
        </ConnectionProvider>
      </ClusterProvider>
    </QueryClientProvider>
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
