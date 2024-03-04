import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  useGetBalance,
  useGetTokenAccountBalance,
  useGetTokenAccounts,
} from "./account-data-access";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  useTheme,
  Button,
  ActivityIndicator,
  DataTable,
} from "react-native-paper";
import { useState, useMemo } from "react";
import { ellipsify } from "../../utils/ellipsify";

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

export function AccountTokens({ address }: { address: PublicKey }) {
  let query = useGetTokenAccounts({ address });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // Items per page
  const theme = useTheme();

  const items = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return query.data?.slice(start, end) ?? [];
  }, [query.data, currentPage, itemsPerPage]);

  // Calculate the total number of pages
  const numberOfPages = useMemo(() => {
    return Math.ceil((query.data?.length ?? 0) / itemsPerPage);
  }, [query.data, itemsPerPage]);

  return (
    <>
      <Text
        variant="titleMedium"
        style={{
          color: theme.colors.onSurfaceVariant,
        }}
      >
        Token Accounts
      </Text>
      <ScrollView>
        {query.isLoading && <ActivityIndicator animating={true} />}
        {query.isError && (
          <Text
            style={{
              padding: 8,
              backgroundColor: theme.colors.errorContainer,
              color: theme.colors.error,
            }}
          >
            Error: {query.error?.message.toString()}
          </Text>
        )}
        {query.isSuccess && (
          <>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Public Key</DataTable.Title>
                <DataTable.Title>Mint</DataTable.Title>
                <DataTable.Title numeric>Balance</DataTable.Title>
              </DataTable.Header>

              {items?.map(({ account, pubkey }) => (
                <DataTable.Row key={pubkey.toString()}>
                  <DataTable.Cell>
                    {ellipsify(pubkey.toString())}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {ellipsify(account.data.parsed.info.mint)}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <AccountTokenBalance address={pubkey} />
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

              {(query.data?.length ?? 0) > 3 && (
                <DataTable.Pagination
                  page={currentPage}
                  numberOfPages={numberOfPages}
                  onPageChange={(page) => setCurrentPage(page)}
                  label={`${currentPage + 1} of ${numberOfPages}`}
                  numberOfItemsPerPage={itemsPerPage}
                  selectPageDropdownLabel={"Rows per page"}
                />
              )}
            </DataTable>
          </>
        )}
      </ScrollView>
    </>
  );
}

export function AccountTokenBalance({ address }: { address: PublicKey }) {
  const query = useGetTokenAccountBalance({ address });
  return query.isLoading ? (
    <ActivityIndicator animating={true} />
  ) : query.data ? (
    <Text>{query.data?.value.uiAmount}</Text>
  ) : (
    <Text>Error</Text>
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
  error: {
    color: "red",
    padding: 8,
  },
});
