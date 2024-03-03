import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useGetBalance } from "./account-data-access";
import { View, StyleSheet } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";

function lamportsToSol(balance: number) {
  return Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000;
}

export function AccountBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address });
  const theme = useTheme();

  return (
    <>
      <View style={styles.accountBalance}>
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
          }}
        >
          Current Balance
        </Text>
        <Text variant="displayLarge">
          {query.data ? lamportsToSol(query.data) : "..."} SOL
        </Text>
      </View>
    </>
  );
}

export function AccountButtonGroup({ address }: { address: PublicKey }) {
  return (
    <>
      <View style={styles.accountButtonGroup}>
        <Button mode="contained">Airdrop</Button>
        <Button mode="contained" style={{ marginLeft: 6 }}>
          Send
        </Button>
        <Button mode="contained" style={{ marginLeft: 6 }}>
          Receive
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  accountBalance: {
    marginTop: 12,
  },
  accountButtonGroup: {
    paddingVertical: 4,
    flexDirection: "row",
  },
});
