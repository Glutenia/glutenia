import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import Screen from "../../components/Screen";
import Field from "../../components/Field";
import { PrimaryButton, SecondaryButton } from "../../components/Buttons";
import { useAuth } from "../../context/AuthContext";
import { Colors, Radius, Shadow, Spacing } from "../../theme/colors";
import { useState } from "react";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@glutenia.tn");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await login({ email: email.trim(), password });
    } catch (error) {
      Alert.alert("Login failed", error.message);
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
        <View style={styles.brandBlock}>
          <Image source={require("../../../assets/logo.png")} style={styles.brandLogo} />
          <Text style={styles.title}>Glutenia</Text>
          <Text style={styles.subtitle}>Gluten-free shopping for everyday comfort.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
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
          <PrimaryButton
            title="Login"
            icon="log-in"
            loading={loading}
            onPress={handleLogin}
          />
          <SecondaryButton
            title="Create customer account"
            icon="person-add"
            onPress={() => navigation.navigate("Register")}
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
  brandBlock: {
    alignItems: "center",
    gap: 8,
  },
  brandLogo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  title: {
    color: Colors.textDark,
    fontSize: 38,
    fontWeight: "900",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow,
  },
  cardTitle: {
    color: Colors.textDark,
    fontSize: 24,
    fontWeight: "900",
  },
});
