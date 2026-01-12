import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OrdenCompra {
  id: number;
  codigo: string;
  proveedor: string;
  nit: string;
  color_estado: string;
  solicitante: string;
  estado_id: number;
  estado: string;
  tipo_orden: string;
  tipo_pago: string;
  fecha: string;
}

const OrdenesCompraScreen = () => {
  // 2. Definir estados para los datos, la carga y el error
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      // Reemplaza esta URL por la de tu API real
      const response = await fetch(
        "https://kleurdigital.xyz/util/orden-de-compra/query_mobile.php"
      );
      const json = await response.json();

      setOrdenes(json.data || []); // Guardamos los datos en el estado
    } catch (error) {
      console.error("Error obteniendo ordenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrdenes();
    }, [])
  );

  if (loading && ordenes.length === 0) {
    return (
      <View style={styles3.loadingContainer}>
        <ActivityIndicator size="large" color="#E6B34D" />
      </View>
    );
  }

  // if (!ordenes) {
  //   return <Redirect href="/" />;
  // }

  return (
    <SafeAreaView style={styles2.container}>
      <CustomHeader />

      {/* Fila de Título y Botón Atrás */}
      <View style={styles3.headerContainer}>
        <View style={styles3.topRow}>
          {/* <TouchableOpacity
            style={styles3.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity> */}

          <Link style={styles3.backButton} href={"/orden-de-compra"}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Link>
          <View style={styles3.titleWrapper}>
            <Text style={styles3.headerTitle}>Ordenes de Compra</Text>
            <Text style={styles3.headerSubtitle}>
              Listado de Ordenes de Compra
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
          />
        </View>
      </View>

      <View style={styles2.scrollContainer}>
        <FlatList
          data={ordenes}
          renderItem={({ item }) => (
            <View style={styles3.card}>
              <View style={styles3.cardHeader}>
                <View style={styles3.codeContainer}>
                  <Text style={styles3.codeText}>{item.codigo}</Text>
                  <View
                    style={[
                      styles3.badge,
                      { backgroundColor: item.color_estado },
                    ]}
                  >
                    <Text style={styles3.badgeText}>{item.estado}</Text>
                  </View>
                </View>

                <Link
                  href={{
                    pathname: "/orden-de-compra/listado/[id]",
                    params: { id: item.id },
                  }}
                >
                  <Ionicons name="eye-outline" size={24} color="#888" />
                </Link>
              </View>

              <View style={styles3.infoRow}>
                <Text style={styles3.label}>Solicitante: </Text>
                <Text style={styles3.value}>{item.solicitante}</Text>
              </View>
              <View style={styles3.infoRow}>
                <Text style={styles3.label}>Proveedor: </Text>
                <Text style={styles3.value}>{item.proveedor}</Text>
              </View>
            </View>

            // <View style={styles.caja}>
            //   <Text style={styles.title}>{item.codigo}</Text>
            //   <Text>{item.tipo_orden}</Text>
            //   <View style={styles.caja2}>
            //     <Text style={styles.precio}>{item.solicitante}</Text>
            //     <Link
            //       href={{
            //         pathname: "/ordenes_compra/[id]",
            //         params: { id: item.id },
            //       }}
            //     >
            //       Ver Detalle
            //     </Link>
            //   </View>
            // </View>
          )}
          onRefresh={fetchOrdenes}
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
  label: { fontSize: 16, color: "#888", width: 90 },
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

// const styles = StyleSheet.create({
//   precio: {
//     fontWeight: "bold",
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: 20,
//   },
//   caja: {
//     marginTop: 10,
//     marginLeft: 20,
//     marginRight: 20,
//     marginBottom: 10,
//   },
//   caja2: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 8,
//   },
// });

export default OrdenesCompraScreen;
