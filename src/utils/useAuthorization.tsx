import AsyncStorage from "@react-native-async-storage/async-storage";
import { PublicKey, PublicKeyInitData } from "@solana/web3.js";
import {
  Account as AuthorizedAccount,
  AuthorizationResult,
  AuthorizeAPI,
  AuthToken,
  Base64EncodedAddress,
  DeauthorizeAPI,
  ReauthorizeAPI,
} from "@solana-mobile/mobile-wallet-adapter-protocol";
import { toUint8Array } from "js-base64";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import React from "react";

const RPC_ENDPOINT = "devnet";

export type Account = Readonly<{
  address: Base64EncodedAddress;
  label?: string;
  publicKey: PublicKey;
}>;

type WalletAuthorization = Readonly<{
  accounts: Account[];
  authToken: AuthToken;
  selectedAccount: Account;
}>;

function getAccountFromAuthorizedAccount(account: AuthorizedAccount): Account {
  return {
    ...account,
    publicKey: getPublicKeyFromAddress(account.address),
  };
}

function getAuthorizationFromAuthorizationResult(
  authorizationResult: AuthorizationResult,
  previouslySelectedAccount?: Account
): WalletAuthorization {
  let selectedAccount: Account;
  if (
    // We have yet to select an account.
    previouslySelectedAccount == null ||
    // The previously selected account is no longer in the set of authorized addresses.
    !authorizationResult.accounts.some(
      ({ address }) => address === previouslySelectedAccount.address
    )
  ) {
    const firstAccount = authorizationResult.accounts[0];
    selectedAccount = getAccountFromAuthorizedAccount(firstAccount);
  } else {
    selectedAccount = previouslySelectedAccount;
  }
  return {
    accounts: authorizationResult.accounts.map(getAccountFromAuthorizedAccount),
    authToken: authorizationResult.auth_token,
    selectedAccount,
  };
}

function getPublicKeyFromAddress(address: Base64EncodedAddress): PublicKey {
  const publicKeyByteArray = toUint8Array(address);
  return new PublicKey(publicKeyByteArray);
}

export interface AuthorizationProviderContext {
  accounts: Account[] | null;
  authorizeSession: (wallet: AuthorizeAPI & ReauthorizeAPI) => Promise<Account>;
  deauthorizeSession: (wallet: DeauthorizeAPI) => void;
  selectedAccount: Account | null;
  isFetchingAuthorizationCache: boolean;
}

const AuthorizationContext = React.createContext<AuthorizationProviderContext>({
  accounts: null,
  authorizeSession: (_wallet: AuthorizeAPI & ReauthorizeAPI) => {
    throw new Error("AuthorizationProvider not initialized");
  },
  deauthorizeSession: (_wallet: DeauthorizeAPI) => {
    throw new Error("AuthorizationProvider not initialized");
  },
  selectedAccount: null,
  isFetchingAuthorizationCache: false,
});

function cacheReviver(key: string, value: any) {
  if (key === "publicKey") {
    return new PublicKey(value as PublicKeyInitData); // the PublicKeyInitData should match the actual data structure stored in AsyncStorage
  } else {
    return value;
  }
}

const STORAGE_KEY = "app-cache";

async function fetchAuthorization(): Promise<WalletAuthorization | null> {
  const cacheFetchResult = await AsyncStorage.getItem(STORAGE_KEY);
  if (cacheFetchResult !== null) {
    // Return prior authorization, if found.
    return JSON.parse(cacheFetchResult, cacheReviver);
  }
  return cacheFetchResult;
}

async function useAuthorization() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["wallet-authorization"],
    queryFn: () => fetchAuthorization,
  });
}

function AuthorizationProvider(props: {
  appIdentity: Readonly<{
    uri?: string | undefined;
    icon?: string | undefined;
    name?: string | undefined;
  }>;
  children: ReactNode;
}) {
  const { children } = props;
  const [authorization, setAuthorization] =
    useState<WalletAuthorization | null>(null);
  const [isFetchingAuthorizationCache, setIsFetchingAuthorizationCache] =
    useState<boolean>(true);

  useEffect(() => {
    // On initial load, get the prior authorization from AsyncStorage.
    (async () => {
      try {
        setIsFetchingAuthorizationCache(true);
        const cacheFetchResult = await AsyncStorage.getItem(STORAGE_KEY);
        if (cacheFetchResult !== null) {
          const priorAuthorization: WalletAuthorization = JSON.parse(
            cacheFetchResult,
            cacheReviver
          );
          setAuthorization(priorAuthorization);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingAuthorizationCache(false);
      }
    })();
  }, []);

  const persistAuthResult = useCallback(async (auth: WalletAuthorization) => {
    try {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const clearAuthCache = useCallback(async () => {
    try {
      AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleAuthorizationResult = useCallback(
    async (
      authorizationResult: AuthorizationResult
    ): Promise<WalletAuthorization> => {
      const nextAuthorization = getAuthorizationFromAuthorizationResult(
        authorizationResult,
        authorization?.selectedAccount
      );
      setAuthorization(nextAuthorization);
      await persistAuthResult(nextAuthorization);
      return nextAuthorization;
    },
    [authorization, persistAuthResult]
  );
  const authorizeSession = useCallback(
    async (wallet: AuthorizeAPI & ReauthorizeAPI) => {
      const authorizationResult = await (authorization
        ? wallet.reauthorize({
            auth_token: authorization.authToken,
            identity: props.appIdentity,
          })
        : wallet.authorize({
            cluster: RPC_ENDPOINT,
            identity: props.appIdentity,
          }));
      return (await handleAuthorizationResult(authorizationResult))
        .selectedAccount;
    },
    [authorization, handleAuthorizationResult]
  );
  const deauthorizeSession = useCallback(
    async (wallet: DeauthorizeAPI) => {
      if (authorization?.authToken == null) {
        return;
      }
      await wallet.deauthorize({ auth_token: authorization.authToken });
      setAuthorization(null);
      await clearAuthCache();
    },
    [authorization, setAuthorization, clearAuthCache]
  );
  const value = useMemo(
    () => ({
      accounts: authorization?.accounts ?? null,
      authorizeSession,
      deauthorizeSession,
      selectedAccount: authorization?.selectedAccount ?? null,
      isFetchingAuthorizationCache,
    }),
    [
      authorization,
      authorizeSession,
      deauthorizeSession,
      isFetchingAuthorizationCache,
    ]
  );

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
}

// const useAuthorization = () => React.useContext(AuthorizationContext);

export { AuthorizationProvider, useAuthorization };
