// Polyfills
import "react-native-get-random-values";
import { Buffer } from "buffer";
global.Buffer = Buffer;

import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CLUSTER, ConnectionProvider } from "./src/ConnectionProvider";
import { clusterApiUrl } from "@solana/web3.js";
import { AuthorizationProvider } from "./src/AuthorizationProvider";
import MainScreen from "./src/MainScreen";
import { Header } from "./src/Header";

export const APP_IDENTITY = {
  name: "Expo Starter Template",
};

export default function App() {
  return (
    <ConnectionProvider
      config={{ commitment: "processed" }}
      endpoint={clusterApiUrl(CLUSTER)}
    >
      <AuthorizationProvider>
        <SafeAreaView style={styles.shell}>
          <Header />
          <MainScreen />
        </SafeAreaView>
      </AuthorizationProvider>
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
