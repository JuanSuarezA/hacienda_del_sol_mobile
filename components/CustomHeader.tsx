import LogoHorizontal from "@/assets/images/logo/Logo-Horizontal.svg";
import NotificacionesActivo from "@/assets/images/logo/Notificaciones-Activo.svg";
import Notificaciones from "@/assets/images/logo/Notificaciones-Inactivo.svg";
import { useAuth } from "@/context/AuthContext";
import { Link, useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Notificaciones {
  id: number;
  tipo: string;
  empleado_id: number;
  solicitante: string;
  titulo: string;
  estado_id: number;
  estado: string;
  codigo: string;
  fecha: string;
  hora: string;
  a: string;
  n: string;
}

export default function CustomHeader() {
  const router = useRouter();
  const { user, setUser, loadingUser } = useAuth();

  if (loadingUser) return null;

  // 2. Definir estados para los datos, la carga y el error
  const [notificaciones, setNotificaciones] = useState<Notificaciones[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotificaciones = async () => {
    try {
      setLoading(true);
      // Reemplaza esta URL por la de tu API real
      const response = await fetch(
        "https://kleurdigital.xyz/util/alertas/notificaciones_mobile.php",
      );
      const json = await response.json();

      setNotificaciones(json.data || []); // Guardamos los datos en el estado
    } catch (error) {
      console.error("Error obteniendo ordenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotificaciones();
    }, []),
  );

  if (loading && notificaciones.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E6B34D" />
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, salir",
        onPress: async () => {
          try {
            // Eliminamos el token y los datos del usuario
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("user");

            setUser(null);

            // Redirigimos al login (asegúrate de que la ruta coincida con tu estructura)
            router.replace("/(auth)/login");
          } catch (error) {
            Alert.alert("Error", "No se pudo cerrar la sesión");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <LogoHorizontal />
        </View>
        <View style={styles.actions}>
          {(user?.rol_id === 1 || user?.rol_id === 22) && (
            <Link href="/notificaciones">
              {notificaciones.length === 0 ? (
                <Notificaciones />
              ) : (
                <NotificacionesActivo />
              )}
            </Link>
          )}
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
              <Image
                source={require("@/assets/images/varios/user.png")}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.nombre || "Usuario"}</Text>
              {/* <Text style={styles.userRole}>
                {user?.rol_id === 1 ? "Administrador" : "Personal"}
              </Text> */}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
  },
  container: {
    backgroundColor: "#F5F5F5",
  },
  profileContainer: {
    alignItems: "center", // Centra el texto debajo del avatar
    justifyContent: "center",
  },
  userInfo: {
    alignItems: "center",
    marginTop: 4,
  },
  userName: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  userRole: {
    color: "#E0E0E0",
    fontSize: 8,
    textAlign: "center",
    textTransform: "uppercase",
  },

  header: {
    backgroundColor: "#12521C",
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
