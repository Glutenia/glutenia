import { Alert, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import SectionHeader from "../components/SectionHeader";
import { PrimaryButton, SecondaryButton } from "../components/Buttons";
import { useAuth } from "../context/AuthContext";
import { Colors, Radius, Shadow, Spacing } from "../theme/colors";
import { getApiBaseUrl } from "../api/client";

export default function AccountScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Sign out of Glutenia?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <SectionHeader eyebrow="Profile" title="Account" />
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.roleText}>{user?.role}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>API connection</Text>
          <Text style={styles.infoValue}>{getApiBaseUrl()}</Text>
        </View>

        <SecondaryButton title="Refresh app data from tabs" icon="refresh" onPress={() => {}} />
        <PrimaryButton title="Logout" icon="log-out" onPress={handleLogout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  card: {
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: 8,
    ...Shadow,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: Colors.primaryPale,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  name: {
    color: Colors.textDark,
    fontSize: 22,
    fontWeight: "900",
  },
  email: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  rolePill: {
    borderRadius: Radius.pill,
    backgroundColor: Colors.secondaryPale,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 6,
  },
  roleText: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  infoCard: {
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryPale,
    padding: Spacing.md,
    gap: 5,
  },
  infoLabel: {
    color: Colors.primary,
    fontWeight: "900",
  },
  infoValue: {
    color: Colors.textMuted,
    lineHeight: 20,
  },
});
