import { View, StyleSheet } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useAuthorization } from "../../utils/useAuthorization";

export function AccountDetailFeature() {
  const { selectedAccount } = useAuthorization();
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
        <Text variant="displayLarge">$0.00 SOL</Text>
      </View>
      <View style={styles.accountButtonGroup}>
        <Button mode="elevated">Airdrop</Button>
        <Button mode="elevated" style={{ marginLeft: 6 }}>
          Send
        </Button>
        <Button mode="elevated" style={{ marginLeft: 6 }}>
          Receive
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  accountBalance: {},
  accountButtonGroup: {
    paddingVertical: 4,
    flexDirection: "row",
  },
});
