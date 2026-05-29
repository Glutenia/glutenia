import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import Screen from "../../components/Screen";
import Field from "../../components/Field";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";
import { useAuth } from "../../context/AuthContext";
import { Colors, Radius, Shadow, Spacing } from "../../theme/colors";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || password.length < 6) {
      Alert.alert("Check details", "Name, email, and a 6 character password are required.");
      return;
    }

    try {
      setLoading(true);
      await register({ name: name.trim(), email: email.trim(), password, role });
    } catch (error) {
      Alert.alert("Register failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Choose customer for shopping or admin for management.</Text>
        </View>

        <View style={styles.card}>
          <Field label="Name" value={name} onChangeText={setName} />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.roleWrap}>
            <Text style={styles.roleLabel}>Role</Text>
            <View style={styles.segment}>
              {["customer", "admin"].map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setRole(option)}
                  style={[styles.segmentButton, role === option && styles.segmentActive]}
                >
                  <Text
                    style={[styles.segmentText, role === option && styles.segmentTextActive]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <PrimaryButton
            title="Register"
            icon="checkmark-circle"
            loading={loading}
            onPress={handleRegister}
          />
          <SecondaryButton
            title="Back to login"
            icon="arrow-back"
            onPress={() => navigation.goBack()}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  header: {
    gap: 8,
  },
  title: {
    color: Colors.textDark,
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow,
  },
  roleWrap: {
    gap: 8,
  },
  roleLabel: {
    color: Colors.textDark,
    fontSize: 13,
    fontWeight: "700",
  },
  segment: {
    flexDirection: "row",
    padding: 4,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryPale,
  },
  segmentButton: {
    flex: 1,
    height: 42,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: {
    backgroundColor: Colors.primary,
  },
  segmentText: {
    color: Colors.textMuted,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  segmentTextActive: {
    color: Colors.surface,
  },
});
