import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Divider, Text } from "react-native-paper";

import { Section } from "../Section";
import { useAuthorization, Account } from "../utils/useAuthorization";
import { useConnection } from "../ConnectionProvider";
import { AccountDetailFeature } from "../components/account/account-detail-feature";
import { SignInFeature } from "../components/sign-in/sign-in-feature";

export function HomeScreen() {
  const { connection } = useConnection();
  const { selectedAccount } = useAuthorization();
  const [balance, setBalance] = useState<number | null>(null);

  console.log("Remounted: ");
  console.log(selectedAccount);

  const fetchAndUpdateBalance = useCallback(
    async (account: Account) => {
      console.log("Fetching balance for: " + account.publicKey);
      const fetchedBalance = await connection.getBalance(account.publicKey);
      console.log("Balance fetched: " + fetchedBalance);
      setBalance(fetchedBalance);
    },
    [connection]
  );

  useEffect(() => {
    if (!selectedAccount) {
      return;
    }
    fetchAndUpdateBalance(selectedAccount);
  }, [fetchAndUpdateBalance, selectedAccount]);

  console.log("Selected Acccount");
  console.log(selectedAccount);

  return (
    <View style={styles.mainContainer}>
      <Text
        style={{ fontWeight: "bold", marginBottom: 12 }}
        variant="displaySmall"
      >
        Solana Mobile Expo Template
      </Text>
      {selectedAccount ? (
        <AccountDetailFeature />
      ) : (
        <>
          <Section
            title="Solana SDKs"
            description="Configured with Solana SDKs like Mobile Wallet Adapter and web3.js."
          />
          <Section
            title="UI Kit and Navigation"
            description="Utilizes React Native Paper components and the React Native Navigation library."
          />
          <Section
            title="Get started!"
            description="Connect or Sign in with Solana (SIWS) to link your wallet account."
          />
          <SignInFeature />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 16,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: "column",
    paddingVertical: 4,
  },
});
