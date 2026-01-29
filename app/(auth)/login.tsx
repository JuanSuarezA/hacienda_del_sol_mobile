import LoginIcon from "@/assets/images/varios/login.svg";
import { useAuth } from "@/context/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { loginApi } from "@/services/authService";
import { saveToken } from "@/services/saveToken";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Login() {
  const { expoPushToken } = usePushNotifications();
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      const data = await loginApi(email, password);
      const userObject = data.user[0];

      // Guardar token
      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(userObject));

      setUser(userObject);

      const tk = await saveToken(userObject.id, expoPushToken);

      console.log(tk);

      switch (userObject.rol_id) {
        case 27:
          router.replace("/(tabs)/porteria");
          break;
        default:
          router.replace("/(tabs)");
          break;
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Credenciales incorrectas",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* LOGO */}
            <View style={styles.logoContainer}>
              <LoginIcon width={400} height={200} />
            </View>

            {/* TITULO */}
            <Text style={styles.title}>Inicia sesión</Text>
            <Text style={styles.subtitle}>Inicia sesión con tu cuenta</Text>

            {/* EMAIL */}
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Ingresa tu correo electrónico"
                placeholderTextColor="#8c8c8c"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD */}
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#8c8c8c"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#2e7d32"
                />
              </TouchableOpacity>
            </View>

            {/* BOTON */}

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>INGRESAR</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#145A23",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    width: 220,
    height: 80,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },

  subtitle: {
    color: "#cfcfcf",
    textAlign: "center",
    marginBottom: 30,
  },

  label: {
    color: "#fff",
    marginBottom: 6,
    marginTop: 12,
  },

  inputContainer: {
    backgroundColor: "#f3efe8",
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    color: "#333",
  },

  eyeIcon: {
    paddingLeft: 10,
  },

  button: {
    backgroundColor: "#2E7D32",
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
