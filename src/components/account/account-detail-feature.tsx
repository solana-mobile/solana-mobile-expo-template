import { useAuthorization } from "../../utils/useAuthorization";

export default function AccountDetailFeature() {
  const { selectedAccount } = useAuthorization();
}
