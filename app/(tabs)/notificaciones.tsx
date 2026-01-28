import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const IngresosScreen = () => {
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

  return (
    <SafeAreaView style={styles.container2}>
      <CustomHeader />

      {/* Fila de Título y Botón Atrás */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Link style={styles.backButton} href={"/(tabs)"}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Link>
          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle}>Notificaciones</Text>
            <Text style={styles.headerSubtitle}>
              Listado de notificaciones pendientes
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.scrollContainer}>
        <FlatList
          data={notificaciones}
          keyExtractor={(item) => item.n.toString()}
          renderItem={({ item }) => (
            <>
              <Text style={styles2.sectionTitle}>{item.fecha}</Text>
              <Link href={item.a as any} asChild>
                <Pressable>
                  <NotificationCard
                    title={item.titulo}
                    description={`${item.codigo} ${item.estado}`}
                    time={item.hora}
                    icon="alert"
                  />
                </Pressable>
              </Link>
            </>
          )}
          onRefresh={fetchNotificaciones}
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
};

type Props = {
  title: string;
  description: string;
  time: string;
  icon: any;
  borderColor?: string;
};

const NotificationCard = ({
  title,
  description,
  time,
  icon,
  borderColor,
}: Props) => {
  return (
    <View
      style={[styles.card, borderColor && { borderColor, borderWidth: 1.5 }]}
    >
      <View style={styles.headerRow}>
        <View style={styles.leftGroup}>
          <View style={styles.icon}>
            <Ionicons name={icon} size={14} color="#FFF" />
          </View>

          <Text style={styles.title}>{title}</Text>
        </View>

        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles2.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // 👈 empuja la hora a la derecha
  },

  icon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E6B34D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "left",
  },

  time: {
    fontSize: 12,
    color: "#7f8c8d",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
  },
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  listContent: { padding: 20 },

  // Header
  headerContainer: {
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
    marginRight: 20,
  },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: {
    backgroundColor: "#E6B34D",
    padding: 10,
    borderRadius: 25,
    marginRight: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#000" },
  headerSubtitle: { fontSize: 14, color: "#666" },

  // Search Bar
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE7E3",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },

  titleWrapper: {
    flex: 1, // Permite que el texto tome el espacio restante
    justifyContent: "center",
  },

  // Card
  card: {
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEE",
    // Sombra para iOS/Android
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  codeContainer: { flexDirection: "row", alignItems: "center" },
  codeText: { fontSize: 18, fontWeight: "bold", marginRight: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },

  infoRow: { flexDirection: "row", marginBottom: 5 },
  label: { fontSize: 16, color: "#888", width: 130 },
  value: { fontSize: 16, color: "#333", fontWeight: "500" },

  container2: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContainer: {
    paddingTop: 0,
    paddingBottom: 170,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f3ee",
    padding: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7f8c8d",
    marginVertical: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  },

  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 0,
  },

  textContainer: {
    flex: 1,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2c3e50",
  },

  time: {
    fontSize: 12,
    color: "#7f8c8d",
  },

  description: {
    fontSize: 13,
    color: "#7f8c8d",
  },
});

export default IngresosScreen;
