import CustomHeader from "@/components/CustomHeader";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Double, Int32 } from "react-native/Libraries/Types/CodegenTypes";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomHeader></CustomHeader>
        {/* Banner de Notificación */}
        <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>
            🔔 Tienes{" "}
            <Text style={styles.boldUnderline}>1 notificación sin leer</Text>.
          </Text>
          <Text style={styles.closeIcon}>✕</Text>
        </View>

        {/* Contenedor Principal de Tarjetas */}
        <View style={styles.cardWrapper}>
          {/* Tarjeta Principal (Total) */}
          <View style={styles.mainCard}>
            <View>
              <Text style={styles.mainTitle}>Ganado</Text>
              <Text style={styles.subTitleSmall}>TOTAL CABEZAS</Text>
            </View>
            <Text style={styles.totalNumber}>30.251</Text>
          </View>

          {/* Fila de Tarjetas Secundarias */}
          <View style={styles.row2}>
            <View style={[styles.secondaryCard, styles.flex1]}>
              <Text style={styles.subTitleSmall}>PROPIOS</Text>
              <Text style={styles.secondaryNumber}>10.251</Text>
            </View>

            <View
              style={[
                styles.secondaryCard,
                styles.flex1,
                { marginHorizontal: 10 },
              ]}
            >
              <Text style={styles.subTitleSmall}>HOTELERÍA</Text>
              <Text style={styles.secondaryNumber}>10.000</Text>
            </View>

            <View style={[styles.secondaryCard, styles.flex1]}>
              <Text style={styles.subTitleSmall}>PARCERÍA</Text>
              <Text style={styles.secondaryNumber}>10.000</Text>
            </View>
          </View>
        </View>

        {/* SECCIÓN MEDIA: GANADO POR POTRERO */}
        <View style={styles.potreroCard}>
          <Text style={styles.sectionTitle}>Ganado por potrero</Text>
          <PotreroRow
            label="POTRERO 1"
            value={690}
            color="#D9A347"
            percentage={0.7}
          />
          <PotreroRow
            label="POTRERO 2"
            value={950}
            color="#1E732E"
            percentage={0.9}
          />
          <PotreroRow
            label="POTRERO 3"
            value={690}
            color="#0A2E14"
            percentage={0.7}
          />
          <PotreroRow
            label="POTRERO 4"
            value={950}
            color="#D9A347"
            percentage={0.9}
          />
          <PotreroRow
            label="POTRERO 5"
            value={690}
            color="#1E732E"
            percentage={0.7}
          />
        </View>

        {/* SECCIÓN INFERIOR: RECURSOS */}
        <View style={styles.recursos}>
          <View style={styles.row}>
            <ResourceCard icon="⭕" label="HENO" value="300" unit="rollos" />
            <ResourceCard icon="➕" label="NÚCLEO" value="48,50" unit="t" />
          </View>
          <View style={styles.row}>
            <ResourceCard icon="🌱" label="SORGO" value="1500" unit="t" />
            <ResourceCard icon="⛽" label="DIÉSEL" value="198" unit="l" />
          </View>
        </View>

        {/*SECCION FINANZAS*/}
        <View style={styles2.container}>
          <Text style={styles2.headerTitle}>Finanzas</Text>

          <View style={styles2.grid}>
            {/* Fila 1 */}
            <View style={styles2.row}>
              <FinanceCard label="INGRESOS" value="18.000.000" />
              <FinanceCard label="EGRESOS" value="10.500.000" />
            </View>

            {/* Fila 2 */}
            <View style={styles2.row}>
              <FinanceCard label="CUENTAS POR PAGAR" value="800.000" />
              <FinanceCard label="CUENTAS POR COBRAR" value="10.500.000" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PotreroRow = ({
  label,
  value,
  color,
  percentage,
}: {
  label: string;
  value: Int32;
  color: string;
  percentage: Double;
}) => (
  <View style={styles.potreroRowContainer}>
    <Text style={styles.potreroLabel}>{label}</Text>
    <View style={styles.barBackground}>
      <View
        style={[
          styles.barFill,
          { backgroundColor: color, width: `${percentage * 100}%` },
        ]}
      />
    </View>
    <Text style={styles.potreroValue}>{value}</Text>
  </View>
);

const ResourceCard = ({
  icon,
  label,
  value,
  unit,
}: {
  icon: string;
  label: string;
  value: string;
  unit: string;
}) => (
  <View style={styles.resourceCard}>
    <View style={styles.resourceHeader}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text style={styles.resourceLabel}>{label}</Text>
    </View>
    <Text style={styles.resourceValue}>
      {value} <Text style={styles.resourceUnit}>{unit}</Text>
    </Text>
  </View>
);

const FinanceCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles2.card}>
    <Text style={styles2.label}>{label}</Text>
    <View style={styles2.valueContainer}>
      <Text style={styles2.currency}>Bs</Text>
      <Text style={styles2.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContainer: { padding: 0 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  notificationBanner: {
    backgroundColor: "#E6B34D",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },

  notificationText: { color: "#000", fontSize: 16 },
  boldUnderline: { fontWeight: "bold", textDecorationLine: "underline" },
  closeIcon: { fontSize: 18, color: "#FFF" },

  // Estilos de Ganado
  mainCard: {
    backgroundColor: "#0A3D14",
    borderRadius: 25,
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mainTitle: { color: "#FFF", fontSize: 28, fontWeight: "bold" },
  totalNumber: { color: "#FFF", fontSize: 36, fontWeight: "bold" },

  totalGanadoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: { color: "white", fontSize: 22, fontWeight: "bold" },
  subtitleText: { color: "#A0A0A0", fontSize: 10 },

  // Tarjetas Verdes Pequeñas
  row2: { flexDirection: "row", justifyContent: "space-between" },
  secondaryCard: {
    backgroundColor: "#0A3D14",
    borderRadius: 20,
    padding: 15,
    height: 100,
    justifyContent: "center",
  },
  subTitleSmall: { color: "#FFF", fontSize: 10, opacity: 0.8, marginBottom: 5 },
  secondaryNumber: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  flex1: { flex: 1 },

  cardWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 40,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginLeft: 20,
    marginRight: 20,
  },

  recursos: {
    marginLeft: 20,
    marginRight: 20,
  },

  smallSummaryCard: {
    backgroundColor: "#072B0F",
    borderRadius: 15,
    padding: 12,
    width: "31%",
    alignItems: "center",
  },
  smallLabel: { color: "#A0A0A0", fontSize: 8, marginBottom: 5 },
  smallValue: { color: "white", fontSize: 16, fontWeight: "bold" },

  // Estilos de Potrero
  potreroCard: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  potreroRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  potreroLabel: { width: 80, fontSize: 12, color: "#666" },
  barBackground: {
    flex: 1,
    height: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 6,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 6 },
  potreroValue: {
    width: 30,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    color: "#333",
  },

  // Estilos de Recursos
  resourceCard: {
    backgroundColor: "#12521C",
    borderRadius: 20,
    padding: 15,
    width: "48%",
  },
  resourceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  resourceLabel: { color: "white", fontSize: 12, marginLeft: 8 },
  resourceValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
  },
  resourceUnit: { fontWeight: "normal", fontSize: 14 },
});

const styles2 = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    marginVertical: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  grid: {
    gap: 12, // Espaciado entre filas
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12, // Espaciado entre columnas
  },
  card: {
    backgroundColor: "#12521C", // Verde oscuro igual al anterior
    flex: 1,
    borderRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  label: {
    color: "#E0E0E0",
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end", // Alinea el monto a la derecha
  },
  currency: {
    color: "#A0A0A0",
    fontSize: 14,
    marginRight: 4,
  },
  value: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
