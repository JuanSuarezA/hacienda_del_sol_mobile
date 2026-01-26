import Diesel from "@/assets/images/home/diesel.svg";
import Heno from "@/assets/images/home/heno.svg";
import Nucleo from "@/assets/images/home/nucleo.svg";
import Sorgo from "@/assets/images/home/sorgo.svg";
import CustomHeader from "@/components/CustomHeader";
import { useFocusEffect } from "expo-router";
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

interface Inicio {
  BOVINO: string;
  CAPACIDAD: string;
  COLOR: string;
  PROPIO: string;
  HOTELERIA: string;
  PARCERIA: string;
  DIESEL: string;
  NUCLEO: string;
  HENO: string;
  SORGO: string;
  POR_COBRAR: string;
  POR_PAGAR: string;
  EGRESO_MES: string;
  INGRESO_MES: string;
}
interface Potrero {
  id: number;
  ubicacion: string;
  stock: number;
  capacidad: number;
  color: string;
}

const HomeScreen = () => {
  const [resumen, setResumen] = useState<Inicio | null>(null);
  const [potreros, setPotreros] = useState<Potrero[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroSeleccionado, setFiltroSeleccionado] = useState<string | null>(
    null,
  );

  const fetchInicio = async () => {
    try {
      setLoading(true);
      const [inicioRes, potreroRes] = await Promise.all([
        fetch(`https://kleurdigital.xyz/util/inicio/query_inicio_mobile.php`),
        fetch(
          `https://kleurdigital.xyz/util/inicio/queryUbicacion_mobile.php?u=A`,
        ),
      ]);
      const resumenJson = await inicioRes.json();
      const potrerosJson = await potreroRes.json();

      setResumen(resumenJson.data?.[0] || null);
      const listaPotreros = potrerosJson.data || [];
      setPotreros(listaPotreros);

      if (!inicioRes.ok && !potreroRes) {
        throw new Error("Error en la respuesta del servidor");
      }

      if (listaPotreros.length > 0) {
        const inicial =
          listaPotreros[0].ubicacion.toLowerCase() === "enfermeria"
            ? "Enfermería"
            : listaPotreros[0].ubicacion.charAt(0).toUpperCase();
        setFiltroSeleccionado(inicial);
      }
    } catch (error) {
      console.error("Error obteniendo ordenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const CATEGORIAS_ESPECIALES = ["Enfermeria", "Temporal"];

  // Función auxiliar para normalizar nombres
  const obtenerCategoria = (ubicacion: string) => {
    const nombreLower = ubicacion.toLowerCase();

    // Buscamos si la ubicación empieza con alguna de nuestras palabras especiales
    const especial = CATEGORIAS_ESPECIALES.find((cat) =>
      nombreLower.startsWith(cat.toLowerCase()),
    );

    // Si es especial, devolvemos la palabra correcta (ej: "Temporal")
    // Si no, devolvemos solo la inicial (ej: "A")
    return especial
      ? especial.charAt(0).toUpperCase() + especial.slice(1)
      : ubicacion.charAt(0).toUpperCase();
  };

  const categoriasDisponibles = Array.from(
    new Set(potreros.map((p) => obtenerCategoria(p.ubicacion))),
  ).sort((a, b) => {
    // Ordenar: Letras primero, palabras especiales al final
    const aEsEspecial = CATEGORIAS_ESPECIALES.some((c) =>
      a.toLowerCase().startsWith(c.toLowerCase()),
    );
    const bEsEspecial = CATEGORIAS_ESPECIALES.some((c) =>
      b.toLowerCase().startsWith(c.toLowerCase()),
    );

    if (aEsEspecial && !bEsEspecial) return 1;
    if (!aEsEspecial && bEsEspecial) return -1;
    return a.localeCompare(b);
  });

  const potrerosFiltrados = potreros.filter((p) => {
    if (!filtroSeleccionado) return true;

    const categoriaDelItem = obtenerCategoria(p.ubicacion);

    // Solo mostramos si la categoría calculada coincide con el botón presionado
    return categoriaDelItem === filtroSeleccionado;
  });

  useFocusEffect(
    useCallback(() => {
      fetchInicio();
    }, []),
  );

  if (loading) {
    return (
      <View style={styles2.loadingContainer}>
        <ActivityIndicator size="large" color="#E6B34D" />
      </View>
    );
  }

  if (!resumen) {
    return (
      <View style={styles2.loadingContainer}>
        <Text>No se pudo cargar la información</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomHeader></CustomHeader>
        {/* Banner de Notificación */}
        {/* <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>
            🔔 Tienes{" "}
            <Text style={styles.boldUnderline}>1 notificación sin leer</Text>.
          </Text>
          <Text style={styles.closeIcon}>✕</Text>
        </View> */}

        {/* Contenedor Principal de Tarjetas */}
        <View style={styles.cardWrapper}>
          {/* Tarjeta Principal (Total) */}
          <View style={styles.mainCard}>
            <View style={styles.leftColumn}>
              <Text style={styles.mainTitle}>Ganado</Text>
              <View style={styles.labelContainer}>
                <Text style={styles.subTitleSmall}>TOTAL CABEZAS</Text>
                <Text style={styles.subTitleSmall}>CAPACIDAD</Text>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.totalNumber}>
                {Number(resumen?.BOVINO || 0).toLocaleString("es-BO")}
              </Text>
              <Text style={[styles.totalNumber, { color: resumen?.COLOR }]}>
                {`${Number(resumen?.CAPACIDAD || 0).toLocaleString("es-BO")} %`}
              </Text>
            </View>
          </View>

          {/* Fila de Tarjetas Secundarias */}
          <View style={styles.row2}>
            <View style={[styles.secondaryCard, styles.flex1]}>
              <Text style={styles.subTitleSmall}>PROPIOS</Text>
              <Text style={styles.secondaryNumber}>
                {Number(resumen?.PROPIO || 0).toLocaleString("es-BO")}
              </Text>
            </View>

            <View
              style={[
                styles.secondaryCard,
                styles.flex1,
                { marginHorizontal: 10 },
              ]}
            >
              <Text style={styles.subTitleSmall}>HOTELERÍA</Text>
              <Text style={styles.secondaryNumber}>
                {Number(resumen?.HOTELERIA || 0).toLocaleString("es-BO")}
              </Text>
            </View>

            <View style={[styles.secondaryCard, styles.flex1]}>
              <Text style={styles.subTitleSmall}>PARCERÍA</Text>
              <Text style={styles.secondaryNumber}>
                {Number(resumen?.PARCERIA || 0).toLocaleString("es-BO")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.potreroCard}>
          <Text style={styles.sectionTitle}>Ganado por potrero</Text>
          <View style={styles3.containerWrap}>
            {categoriasDisponibles.map((cat) => {
              // 1. Verificamos si esta categoría es la seleccionada actualmente
              const estaSeleccionado = filtroSeleccionado === cat;

              // 2. Si está seleccionado y es una letra (longitud 1), le ponemos el prefijo
              // Si es "Enfermería" o "Temporal", lo dejamos igual.
              const textoBoton =
                estaSeleccionado && cat.length === 1 ? `POTRERO ${cat}` : cat;

              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setFiltroSeleccionado(cat)}
                  style={[
                    styles3.potrero,
                    // 3. Ajuste dinámico de ancho: si está seleccionado o es palabra larga
                    (estaSeleccionado || cat.length > 1) && {
                      width: "auto",
                      paddingHorizontal: 16,
                    },
                    estaSeleccionado && styles3.active,
                  ]}
                >
                  <Text
                    style={[
                      styles3.potreroText,
                      estaSeleccionado && { color: "#FFF" },
                    ]}
                  >
                    {textoBoton}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {potrerosFiltrados.map((item) => (
            <PotreroRow
              key={item.id}
              label={item.ubicacion}
              value={item.stock}
              color={item.color}
              percentage={item.capacidad}
            />
          ))}
        </View>

        {/* SECCIÓN INFERIOR: RECURSOS */}
        <View style={styles.recursos}>
          <View style={styles.row}>
            <ResourceCard
              icon={<Heno />}
              label="HENO"
              value={Number(resumen?.HENO || 0).toLocaleString("es-BO")}
              unit="rollos"
            />
            <ResourceCard
              icon={<Nucleo />}
              label="NÚCLEO"
              value={Number(resumen?.NUCLEO || 0).toLocaleString("es-BO")}
              unit="toneladas"
            />
          </View>
          <View style={styles.row}>
            <ResourceCard
              icon={<Sorgo />}
              label="SORGO"
              value={Number(resumen?.SORGO || 0).toLocaleString("es-BO")}
              unit="toneladas"
            />
            <ResourceCard
              icon={<Diesel />}
              label="DIÉSEL"
              value={Number(resumen?.DIESEL || 0).toLocaleString("es-BO")}
              unit="litros"
            />
          </View>
        </View>

        {/*SECCION FINANZAS*/}
        <View style={styles2.container}>
          <Text style={styles2.headerTitle}>Finanzas</Text>

          <View style={styles2.grid}>
            {/* Fila 1 */}
            <View style={styles2.row}>
              <FinanceCard
                label="INGRESOS / MES"
                value={Number(resumen?.INGRESO_MES || 0).toLocaleString(
                  "es-BO",
                )}
              />
              <FinanceCard
                label="EGRESOS / MES"
                value={Number(resumen?.EGRESO_MES || 0).toLocaleString("es-BO")}
              />
            </View>

            {/* Fila 2 */}
            <View style={styles2.row}>
              <FinanceCard
                label="CUENTAS POR PAGAR"
                value={Number(resumen?.POR_PAGAR || 0).toLocaleString("es-BO")}
              />
              <FinanceCard
                label="CUENTAS POR COBRAR"
                value={Number(resumen?.POR_COBRAR || 0).toLocaleString("es-BO")}
              />
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
  value: number;
  color: string;
  percentage: number;
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
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) => (
  <View style={styles.resourceCard}>
    <View style={styles.resourceHeader}>
      <View style={{ width: 24, height: 24, justifyContent: "center" }}>
        {icon}
      </View>
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
  leftColumn: {
    justifyContent: "space-between",
  },
  rightColumn: {
    alignItems: "flex-end", // Alinea los números a la derecha
    paddingTop: 40,
  },
  labelContainer: {
    gap: 8, // Espacio vertical entre 'TOTAL CABEZAS' y 'CAPACIDAD'
  },
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
  mainTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  totalNumber: { color: "#FFF", fontSize: 25, fontWeight: "bold" },

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
  secondaryNumber: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
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
    marginTop: 20,
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
  potreroLabel: { width: 40, fontSize: 12, color: "#666" },
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
  },
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

const styles3 = StyleSheet.create({
  containerWrap: {
    flexDirection: "row", // Alinea los hijos en filas
    flexWrap: "wrap", // ¡ESTA ES LA CLAVE! Permite saltar de línea
    justifyContent: "flex-start", // Alinea los botones al inicio
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    marginVertical: 10,
  },

  potrero: {
    width: 45,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EBE4DC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
  },

  active: {
    backgroundColor: "#12521C",
  },

  potreroText: {
    color: "#0F0F0F",
    fontWeight: "600",
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    marginRight: 10,
  },

  cta: {
    backgroundColor: "#0f4d1c",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
});

export default HomeScreen;
