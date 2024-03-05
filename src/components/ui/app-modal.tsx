import { ViewStyle, View, StyleSheet } from "react-native";
import { Modal, Text, Button, Portal } from "react-native-paper";

interface AppModalProps {
  children: React.ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
  contentContainerStyle?: ViewStyle;
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel = "Save", // Defaulting submitLabel to "Save" here
}: AppModalProps) {
  return (
    <Portal>
      <Modal
        visible={show}
        onDismiss={hide}
        contentContainerStyle={styles.container}
      >
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          {children}
          <View style={styles.action}>
            <View style={styles.buttonGroup}>
              {submit && (
                <Button
                  mode="contained"
                  onPress={submit}
                  disabled={submitDisabled}
                  style={styles.button}
                >
                  {submitLabel}
                </Button>
              )}
              <Button onPress={hide} style={styles.button}>
                Close
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
  },
  box: {
    // Adjust layout with margin or padding in your actual styles.
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16, // Adjust spacing as needed
  },
  action: {
    marginTop: 16, // Adjust spacing as needed
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around", // Adjust based on your design requirements
  },
  button: {
    margin: 4, // Adjust as needed
  },
});
