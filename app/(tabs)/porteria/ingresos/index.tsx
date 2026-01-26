import CamionIngresar from "@/assets/images/varios/ingresar.svg";
import CamionSalir from "@/assets/images/varios/salir.svg";
import CustomHeader from "@/components/CustomHeader";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IngresoSalida {
  id: number;
  codigo: string;
  cantidad: number;
  ci_chofer: string;
  descripcion: string;
  entrada: string;
  estado: string;
  estado_id: number;
  nombre_chofer: string;
  placa_camion: string;
  salida: string;
}

const IngresosScreen = () => {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <Text>Cargando usuario...</Text>;

  // 2. Definir estados para los datos, la carga y el error
  const [ingresos, setOrdenes] = useState<IngresoSalida[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchIngresos = async () => {
    try {
      setLoading(true);
      // Reemplaza esta URL por la de tu API real
      const response = await fetch(
        "https://kleurdigital.xyz/util/ingresos-salidas/query_mobile.php",
      );
      const json = await response.json();

      setOrdenes(json.data || []); // Guardamos los datos en el estado
    } catch (error) {
      console.error("Error obteniendo ordenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const ingresosFiltrados = ingresos.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.codigo.toLowerCase().includes(query) ||
      item.nombre_chofer.toLowerCase().includes(query) ||
      item.ci_chofer.toLowerCase().includes(query) ||
      item.placa_camion.toLowerCase().includes(query)
    );
  });

  const handleUpdateStatus = async (id: string, tipo: string) => {
    const accion =
      tipo === "106"
        ? "registrar el ingreso"
        : tipo === "107"
          ? "registrar la salida"
          : "pendiente";
    Alert.alert("Confirmación", `¿Estás seguro de que quieres ${accion} ?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: `Sí, registrar`,
        onPress: async () => {
          try {
            setLoading(true); // Opcional: mostrar loading mientras la API responde

            const response = await fetch(
              `https://kleurdigital.xyz/util/ingresos-salidas/ingreso_mobile.php?id=${id}&tipo=${tipo}&u=${user?.id}`,
            );

            const result = await response.json();

            if (result.estado == "1") {
              Alert.alert("Éxito", result.mensaje, [
                {
                  text: "OK",
                  onPress: () => fetchIngresos(), // <--- ESTO REFRESCARÁ LOS DATOS
                },
              ]);
            } else {
              Alert.alert(
                "Error",
                result.message || "No se pudo actualizar la orden.",
              );
            }
          } catch (error) {
            console.error("Error al actualizar:", error);
            Alert.alert("Error", "Ocurrió un error de conexión.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderButtons = (item: any) => {
    switch (item.estado_id) {
      case 81:
        switch (item.entrada) {
          case "":
            return (
              <TouchableOpacity
                style={[styles4.button, styles4.approve]}
                onPress={() => handleUpdateStatus(item.id, "106")}
              >
                <Text style={styles4.buttonText}>REGISTRAR INGRESO</Text>
                <CamionIngresar />
              </TouchableOpacity>
            );

          default:
            return (
              <>
                <View style={styles3.codeContainer}>
                  <View style={[styles3.badge, { backgroundColor: "green" }]}>
                    <Text style={styles3.badgeText}>INGRESADO</Text>
                  </View>
                </View>
              </>
            );
        }

      case 102:
        switch (item.salida) {
          case "":
            return (
              <TouchableOpacity
                style={[styles4.button, styles4.reject]}
                onPress={() => handleUpdateStatus(item.id, "107")}
              >
                <Text style={styles4.buttonText}>REGISTRAR SALIDA</Text>
                <CamionSalir />
              </TouchableOpacity>
            );

          default:
            return (
              <>
                <View style={styles3.codeContainer}>
                  <View style={[styles3.badge, { backgroundColor: "gray" }]}>
                    <Text style={styles3.badgeText}>DESPACHADO</Text>
                  </View>
                </View>
              </>
            );
        }

      case 105:
        return (
          <>
            <View style={styles3.codeContainer}>
              <View style={[styles3.badge, { backgroundColor: "orange" }]}>
                <Text style={styles3.badgeText}>{item.estado}</Text>
              </View>
            </View>
          </>
        );
      default:
        return null;
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchIngresos();
    }, []),
  );

  if (loading && ingresos.length === 0) {
    return (
      <View style={styles3.loadingContainer}>
        <ActivityIndicator size="large" color="#E6B34D" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles2.container}>
      <CustomHeader />

      {/* Fila de Título y Botón Atrás */}
      <View style={styles3.headerContainer}>
        <View style={styles3.topRow}>
          <Link style={styles3.backButton} href={"/porteria"}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Link>
          <View style={styles3.titleWrapper}>
            <Text style={styles3.headerTitle}>Camiones</Text>
            <Text style={styles3.headerSubtitle}>
              Ingreso y Despacho de Camiones
            </Text>
          </View>
        </View>
        {/* Buscador */}
        <View style={styles3.searchSection}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#888"
            style={styles3.searchIcon}
          />
          <TextInput
            style={styles3.input}
            placeholder="Busca aquí..."
            placeholderTextColor="#888"
            value={searchQuery} // Conectamos el valor
            onChangeText={(text) => setSearchQuery(text)} // Actualizamos el estado
          />
        </View>
      </View>

      <View style={styles2.scrollContainer}>
        <FlatList
          data={ingresosFiltrados}
          renderItem={({ item }) => (
            <View style={styles3.card}>
              <View style={styles3.cardHeader}>
                <View style={styles3.codeContainer}>
                  <Text style={styles3.codeText}>{item.placa_camion}</Text>
                </View>
              </View>
              <View style={styles3.infoRow}>
                <Text style={styles3.label}>Nro. de Orden: </Text>
                <Text style={styles3.value}>{item.codigo}</Text>
              </View>
              <View style={styles3.infoRow}>
                <Text style={styles3.label}>Chofer: </Text>
                <Text style={styles3.value}>{item.nombre_chofer}</Text>
              </View>
              <View style={styles3.infoRow}>
                <Text style={styles3.label}>Cédula: </Text>
                <Text style={styles3.value}>{item.ci_chofer}</Text>
              </View>
              <View style={styles3.infoRow}>
                <Text style={styles3.label}>Cantidad: </Text>
                <Text style={styles3.value}>{item.cantidad} CBZ</Text>
              </View>
              <View style={styles3.infoRow}>
                <Text style={styles3.label}>Entrada: </Text>
                <Text style={styles3.value}>{item.entrada}</Text>
              </View>
              <View style={styles3.infoRow}>
                <Text style={styles3.label}>Salida: </Text>
                <Text style={styles3.value}>{item.salida}</Text>
              </View>
              <View style={styles4.buttonsRow}>{renderButtons(item)}</View>
            </View>
          )}
          onRefresh={fetchIngresos}
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles3 = StyleSheet.create({
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
  label: { fontSize: 16, color: "#888", width: 110 },
  value: { fontSize: 16, color: "#333", fontWeight: "500" },
});

const styles2 = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 250,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const styles4 = StyleSheet.create({
  container: {
    marginTop: 16,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  card: {
    flex: 1,
    backgroundColor: "#F2EDE6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  label: {
    fontSize: 11,
    color: "#9B9B9B",
    marginBottom: 4,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 20,
  },

  button: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  reject: {
    backgroundColor: "#00C7BE",
  },

  approve: {
    backgroundColor: "#1E8E3E",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default IngresosScreen;
