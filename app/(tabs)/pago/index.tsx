import CustomFechaActual from "@/components/CustomFechaActual";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Actividad = {
  id: string;
  codigo: string;
  accion: string;
  usuario: string;
  color: string;
};

const actividades: Actividad[] = [
  {
    id: "1",
    codigo: "SC-0001",
    accion: "abierta",
    usuario: "Juan Suárez",
    color: "#1A73E8",
  },
  {
    id: "2",
    codigo: "SC-0002",
    accion: "editada",
    usuario: "Juan Suárez",
    color: "#29B6F6",
  },
  {
    id: "3",
    codigo: "SC-0003",
    accion: "generada",
    usuario: "Juan Suárez",
    color: "#FBC02D",
  },
  {
    id: "4",
    codigo: "SC-0004",
    accion: "aprobada",
    usuario: "Marco Aurelio",
    color: "#34A853",
  },
  {
    id: "5",
    codigo: "SC-0005",
    accion: "rechazada",
    usuario: "Marco Aurelio",
    color: "#EA4335",
  },
  {
    id: "6",
    codigo: "OC-0001",
    accion: "abierta",
    usuario: "Juan Suárez",
    color: "#1A73E8",
  },
  {
    id: "7",
    codigo: "OC-0002",
    accion: "editada",
    usuario: "Juan Suárez",
    color: "#29B6F6",
  },
  {
    id: "8",
    codigo: "OC-0003",
    accion: "generada",
    usuario: "Juan Suárez",
    color: "#FBC02D",
  },
  {
    id: "9",
    codigo: "OC-0004",
    accion: "aprobada",
    usuario: "Marco Aurelio",
    color: "#34A853",
  },
  {
    id: "10",
    codigo: "OC-0004",
    accion: "aprobada",
    usuario: "Marco Aurelio",
    color: "#34A853",
  },
  {
    id: "11",
    codigo: "OC-0004",
    accion: "aprobada",
    usuario: "Marco Aurelio",
    color: "#34A853",
  },
  {
    id: "12",
    codigo: "OC-0004",
    accion: "aprobada",
    usuario: "Marco Aurelio",
    color: "#34A853",
  },
];

const ComprasScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomHeader />
        <View style={styles2.content}>
          <Text style={styles2.title}>Pagos</Text>
          <CustomFechaActual />

          {/* BOTONES */}
          <View style={styles2.buttons}>
            <TouchableOpacity
              style={styles2.button}
              //onPress={() => router.push("/ordenes_compra")}
            >
              <Ionicons name="document-text-outline" size={20} color="#fff" />
              <Text style={styles2.buttonText}>LISTADO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles2.button}
              //onPress={() => router.push("/ordenes_compra/pendientes")}
            >
              <Ionicons name="clipboard-outline" size={20} color="#fff" />
              <Text style={styles2.buttonText}>PENDIENTES</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Aprobaciones</Text>
          <View style={styles.row}>
            <Item label="Solicitudes" value="1" />
            <Item label="Órdenes" value="2" />
            <Item label="Recepciones" value="3" />
          </View>
        </View>
        <View style={styles3.card}>
          <Text style={styles3.title}>Actividad reciente</Text>
          {actividades.map((item) => (
            <View key={item.id} style={styles3.row}>
              <View style={[styles3.dot, { backgroundColor: item.color }]} />

              <Text style={styles3.text}>
                <Text style={styles3.code}>{item.codigo}</Text> {item.accion}{" "}
                por {item.usuario}.
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Item = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>

    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Revisar</Text>
    </TouchableOpacity>
  </View>
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
    fontSize: 14,
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
