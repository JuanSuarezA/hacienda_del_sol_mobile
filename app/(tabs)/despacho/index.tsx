import CustomFechaActual from "@/components/CustomFechaActual";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { Link, Redirect, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OrdenCompraReciente {
  id: number;
  codigo: string;
  color_estado: string;
  estado_id: number;
  linea: string;
}

interface OrdenResumen {
  PENDIENTE: string;
  POR_CARGAR: string;
  POR_DESPACHAR: string;
}

const ComprasScreen = () => {
  const [resumen, setResumen] = useState<OrdenResumen | null>(null);
  const [ordenes, setOrdenes] = useState<OrdenCompraReciente[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdenesRecientes = async () => {
    try {
      setLoading(true);
      // Reemplaza esta URL por la de tu API real

      const [resumenRes, ordenesRes] = await Promise.all([
        fetch(
          `https://kleurdigital.xyz/util/orden-de-despacho/query_resumen_mobile.php`,
        ),
        fetch(
          `https://kleurdigital.xyz/util/orden-de-despacho/query_actividad_reciente_mobile.php`,
        ),
      ]);
      const resumenJson = await resumenRes.json();
      const ordenesJson = await ordenesRes.json();

      setResumen(resumenJson.data?.[0] || null);
      setOrdenes(ordenesJson.data || []); // Guardamos los datos en el estado
    } catch (error) {
      console.error("Error obteniendo ordenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrdenesRecientes();
    }, []),
  );

  if (loading && ordenes.length === 0) {
    return (
      <View style={styles3.loadingContainer}>
        <ActivityIndicator size="large" color="#E6B34D" />
      </View>
    );
  }

  if (!resumen) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomHeader />
        <View style={styles2.content}>
          <Text style={styles2.title}>Ordenes de Despacho</Text>
          <CustomFechaActual />

          {/* BOTONES */}
          <View style={styles2.buttons}>
            <Link href={"/despacho/listado"} asChild>
              <TouchableOpacity style={styles2.button}>
                <Ionicons name="document-text-outline" size={20} color="#fff" />
                <Text style={styles2.buttonText}>LISTADO</Text>
              </TouchableOpacity>
            </Link>
            <Link href={"/despacho/pendiente"} asChild>
              <TouchableOpacity style={styles2.button}>
                <Ionicons name="clipboard-outline" size={20} color="#fff" />
                <Text style={styles2.buttonText}>PENDIENTES</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Ordenes</Text>
          <View style={styles.row}>
            <Link href={"/despacho/pendiente"} asChild>
              <Item label="Pendientes" value={resumen.PENDIENTE} />
            </Link>
            <Link href={"/despacho/por-cargar"} asChild>
              <Item label="Por Cargar" value={resumen.POR_CARGAR} />
            </Link>
            <Link href={"/despacho/por-despachar"} asChild>
              <Item label="Por Despachar" value={resumen.POR_DESPACHAR} />
            </Link>
          </View>
        </View>
        <View style={styles3.card}>
          <Text style={styles3.title}>Actividad reciente</Text>
          {ordenes.map((item) => (
            <View key={item.id} style={styles3.row}>
              <View
                style={[styles3.dot, { backgroundColor: item.color_estado }]}
              />

              <Text style={styles3.text}>
                <Text style={styles3.code}>{item.codigo}</Text> {item.linea}.
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Item = ({
  label,
  value,
  ...props
}: {
  label: string;
  value: string;
  [key: string]: any;
}) => (
  <TouchableOpacity {...props} style={[styles.item, props.style]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
    <View style={styles.button}>
      <Text style={styles.buttonText}>Revisar</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContainer: { padding: 0 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  item: {
    alignItems: "center",
    width: "30%",
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 6,
  },

  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },

  button: {
    borderWidth: 1.5,
    borderColor: "#12521C",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  buttonText: {
    color: "#12521C",
    fontWeight: "600",
    fontSize: 13,
  },
});

const styles2 = StyleSheet.create({
  content: {
    padding: 20,
    marginTop: -10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  button: {
    backgroundColor: "#12521C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 30,
    width: "48%",
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

const styles3 = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    paddingBottom: 20,
    marginHorizontal: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#000",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

  text: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },

  code: {
    fontWeight: "600",
    color: "#555",
  },
});

export default ComprasScreen;
