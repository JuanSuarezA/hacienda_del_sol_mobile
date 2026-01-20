import CustomCheckbox from "@/components/CustomCheckBox";
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import {
  Link,
  Redirect,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- INTERFACES ---
interface Orden {
  id: number;
  codigo: string;
  tipo_pedido: string;
  tipo_pago: string;
  propietario: string;
  destino: string;
  despachador: string;
  cargador: string;
  aprobador: string;
  estado: string;
  observacion: string;
  comprador_destino: string;
  cliente: string;
  nit: string;
  telefono: string;
  direccion: string;
  email: string;
  solicitante: string;
  email_solicitante: string;
  telefono_solicitante: string;
  fecha: string;
  color_estado: string;
}

interface Detalle {
  id: number;
  nombre_categoria: string;
  nombre_subcategoria: string;
  nombre_producto: string;
  ubicacion: string;
  costo: string;
  cantidad: string;
  total: string;
  n: string;
}

interface Transporte {
  id: number;
  nombre_chofer: string;
  ci_chofer: string;
  placa_camion: string;
  cantidad: string;
  estado: string;
  n: string;
  estado_id: number;
}

const OrdenesCompraScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  // --- ESTADOS DE DATOS ---
  const [orden, setOrden] = useState<Orden | null>(null);
  const [detalle, setDetalle] = useState<Detalle[]>([]);
  const [transporte, setTransporte] = useState<Transporte[]>([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADO PARA CHECKBOXES (NUEVO) ---
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // --- ESTADOS DE ACORDEÓN ---
  const [openSolicitud, setOpenSolicitud] = useState(false);
  const [openSolicitante, setOpenSolicitante] = useState(false);
  const [openProveedor, setOpenProveedor] = useState(false);
  const [openObservaciones, setOpenObservaciones] = useState(false);
  const [openProducto, setOpenProducto] = useState(false);
  const [openTransporte, setOpenTransporte] = useState(true); // Abierto por defecto para ver los checkboxes

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      const baseUrl = "https://kleurdigital.xyz/util/despachos-od";
      const [ordenRes, detalleRes, transporteRes] = await Promise.all([
        fetch(`${baseUrl}/queryPedidoId_mobile.php?id=${id}`),
        fetch(`${baseUrl}/queryPedidoDetalleId_mobile.php?id=${id}`),
        fetch(
          `${baseUrl}/queryPedidoDetalleTransportistaId_mobile.php?id=${id}`,
        ),
      ]);
      const ordenJson = await ordenRes.json();
      const detalleJson = await detalleRes.json();
      const transporteJson = await transporteRes.json();

      setOrden(ordenJson.data?.[0] || null);
      setDetalle(detalleJson.data || []);
      setTransporte(transporteJson.data || []);
    } catch (error) {
      console.error("Error obteniendo ordenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrdenes();
    }, [id]),
  );

  // --- MANEJO DE SELECCIÓN (NUEVO) ---
  const toggleTransporte = (transportId: number) => {
    setSelectedIds((prev) =>
      prev.includes(transportId)
        ? prev.filter((idItem) => idItem !== transportId)
        : [...prev, transportId],
    );
  };

  // --- ENVÍO DE DATOS POST (ACTUALIZADO) ---
  const handleUpdateStatus = async (tipo: string) => {
    // Validación: Si es aprobar (tipo 1), debe haber seleccionado al menos un transporte
    if (tipo === "1" && selectedIds.length === 0) {
      Alert.alert(
        "Atención",
        "Debes seleccionar al menos un transporte para proceder con la aprobación.",
      );
      return;
    }

    try {
      setLoading(true);
      // Endpoint para procesar la aprobación/rechazo
      const response = await fetch(
        `https://kleurdigital.xyz/util/despachos-od/editarPedido_mobile.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_pedido: id,
            tipo_accion: tipo, // "1" aprobar, "2" rechazar
            transportes_seleccionados: selectedIds, // Enviamos el array de IDs
          }),
        },
      );

      const result = await response.json();

      if (result.estado == "1") {
        Alert.alert("Éxito", result.mensaje);
        router.push("/despacho/por-despachar");
      } else {
        Alert.alert(
          "Error",
          result.message || "No se pudo actualizar la orden.",
        );
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      Alert.alert("Error", "Ocurrió un error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E6B34D" />
      </View>
    );
  }

  if (!orden) return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />

      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Link style={styles.backButton} href={"/despacho/por-despachar"}>
            <Ionicons name="arrow-back" size={23} color="white" />
          </Link>
          <Text style={styles.headerTitle}>{orden.codigo}</Text>
          <View style={[styles.badge, { backgroundColor: orden.color_estado }]}>
            <Text style={styles.badgeText}>{orden.estado}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* SECCIÓN ORDEN */}
        <Section
          title="Orden de Despacho"
          open={openSolicitud}
          onToggle={() => setOpenSolicitud(!openSolicitud)}
        >
          <RowTwoCols
            leftLabel="NRO"
            leftValue={orden.codigo}
            rightLabel="Tipo Venta"
            rightValue={orden.tipo_pedido}
          />
          <RowTwoCols
            leftLabel="Propietario"
            leftValue={orden.propietario}
            rightLabel="Mercado"
            rightValue={orden.destino}
          />
          <RowTwoCols
            leftLabel="Fecha"
            leftValue={orden.fecha}
            rightLabel="Tipo de Pago"
            rightValue={orden.tipo_pago}
          />
          <RowBadge
            label="Estado"
            value={orden.estado}
            color={orden.color_estado}
          />
        </Section>

        {/* SECCIÓN DATOS COMPRADOR */}
        <Section
          title="Datos del Comprador"
          open={openProveedor}
          onToggle={() => setOpenProveedor(!openProveedor)}
        >
          <RowTwoCols
            leftLabel="Comprador"
            leftValue={orden.cliente}
            rightLabel="NIT"
            rightValue={orden.nit}
          />
          <RowTwoCols
            leftLabel="Direccion"
            leftValue={orden.direccion}
            rightLabel="Destino"
            rightValue={orden.comprador_destino}
          />
          <RowTwoCols
            leftLabel="Telefono"
            leftValue={orden.telefono}
            rightLabel="Email"
            rightValue={orden.email}
          />
        </Section>

        {/* SECCIÓN TRANSPORTE */}
        <Section
          title="Datos del Transportista"
          open={openTransporte}
          onToggle={() => setOpenTransporte(!openTransporte)}
        >
          {transporte.map((item) => {
            // LÓGICA TRADUCIDA DE PHP:
            const mostrarCheckbox = item.estado_id === 105;
            const estaDeshabilitado = false;

            return (
              <View key={item.id} style={{ gap: 8, marginBottom: 10 }}>
                <RowThreeCols
                  leftLabel="Chofer"
                  leftValue={item.nombre_chofer}
                  centerLabel="Cedula"
                  centerValue={item.ci_chofer}
                  rightLabel="Placa"
                  rightValue={item.placa_camion}
                />
                <RowThreeCols
                  leftLabel="Nro."
                  leftValue={`Camion ${item.n}`}
                  centerLabel="Cantidad"
                  centerValue={`${item.cantidad} CBZ`}
                  rightLabel="Estado"
                  rightValue={item.estado}
                />

                {/* EQUIVALENTE AL IF DE PHP PARA MOSTRAR EL CHECKBOX */}
                {mostrarCheckbox && (
                  <View style={{ marginTop: 5 }}>
                    <CustomCheckbox
                      label={
                        estaDeshabilitado
                          ? "Entrada pendiente"
                          : "Seleccionar para cargado"
                      }
                      value={selectedIds.includes(item.id)}
                      onChange={() => toggleTransporte(item.id)}
                      color="#2ecc71"
                      disabled={estaDeshabilitado} // EQUIVALENTE AL 'disabled' DE PHP
                    />
                  </View>
                )}

                <View style={styles.separator} />
              </View>
            );
          })}
        </Section>

        {/* SECCIÓN PRODUCTOS */}
        <Section
          title="Datos del Producto"
          open={openProducto}
          onToggle={() => setOpenProducto(!openProducto)}
        >
          {detalle.map((item) => (
            <View key={item.id} style={{ gap: 8 }}>
              <RowFull
                label={`Producto ${item.n}`}
                value={item.nombre_producto}
              />
              <RowFull label="Ubicacion" value={item.ubicacion} />
              <RowThreeCols
                leftLabel="Cantidad"
                leftValue={item.cantidad}
                centerLabel="Precio"
                centerValue={item.costo}
                rightLabel="Total"
                rightValue={item.total}
              />
              <View style={styles.separator} />
            </View>
          ))}
        </Section>

        {/* SECCIÓN OBSERVACIONES */}
        <Section
          title="Observaciones"
          open={openObservaciones}
          onToggle={() => setOpenObservaciones(!openObservaciones)}
        >
          <RowFull label="" value={orden.observacion} />
        </Section>

        {/* FOOTER DE ACCIONES */}
        <View style={styles2.container}>
          <View style={styles2.row}>
            <View style={styles2.card}>
              <Text style={styles2.label}>ELABORADA:</Text>
              <Text style={styles2.value}>{orden.solicitante}</Text>
            </View>
            <View style={styles2.card}>
              <Text style={styles2.label}>AUTORIZADA POR:</Text>
              <Text style={styles2.value}>{orden.aprobador || "-"}</Text>
            </View>
          </View>

          <View style={styles2.buttonsRow}>
            <TouchableOpacity
              style={[styles2.button, styles2.reject]}
              onPress={() => handleUpdateStatus("2")}
            >
              <Text style={styles2.buttonText}>RECHAZAR</Text>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles2.button, styles2.approve]}
              onPress={() => handleUpdateStatus("1")}
            >
              <Text style={styles2.buttonText}>
                DESPACHAR ({selectedIds.length})
              </Text>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- COMPONENTES AUXILIARES ---

const Section: React.FC<{
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, open, onToggle, children }) => (
  <View style={styles.card}>
    <TouchableOpacity style={styles.cardHeader} onPress={onToggle}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Ionicons
        name={open ? "chevron-up" : "chevron-down"}
        size={20}
        color="#fff"
      />
    </TouchableOpacity>
    {open && <View style={styles.cardBody}>{children}</View>}
  </View>
);

const RowFull: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.rowFull}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const RowBadge: React.FC<{ label: string; value: string; color?: string }> = ({
  label,
  value,
  color = "#2563EB",
}) => (
  <View style={styles.row}>
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.statusBadge, { backgroundColor: color }]}>
        <Text style={styles.statusText}>{value}</Text>
      </View>
    </View>
  </View>
);

const RowTwoCols: React.FC<{
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}> = ({ leftLabel, leftValue, rightLabel, rightValue }) => (
  <View style={styles.rowTwoCols}>
    <View style={styles.col}>
      <Text style={styles.label}>{leftLabel}</Text>
      <Text style={styles.value}>{leftValue}</Text>
    </View>
    <View style={styles.col}>
      <Text style={styles.label}>{rightLabel}</Text>
      <Text style={styles.value}>{rightValue}</Text>
    </View>
  </View>
);

const RowThreeCols: React.FC<{
  leftLabel: string;
  leftValue: string;
  centerLabel: string;
  centerValue: string;
  rightLabel: string;
  rightValue: string;
}> = ({
  leftLabel,
  leftValue,
  centerLabel,
  centerValue,
  rightLabel,
  rightValue,
}) => (
  <View style={styles.rowTwoCols}>
    <View style={styles.col}>
      <Text style={styles.label}>{leftLabel}</Text>
      <Text style={styles.value}>{leftValue}</Text>
    </View>
    <View style={styles.col}>
      <Text style={styles.label}>{centerLabel}</Text>
      <Text style={styles.value}>{centerValue}</Text>
    </View>
    <View style={styles.col}>
      <Text style={styles.label}>{rightLabel}</Text>
      <Text style={styles.value}>{rightValue}</Text>
    </View>
  </View>
);

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: { margin: 20 },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backButton: {
    backgroundColor: "#E6B34D",
    padding: 10,
    borderRadius: 25,
    marginRight: 15,
  },
  headerTitle: { flex: 1, color: "#000", fontSize: 20, fontWeight: "bold" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  content: { padding: 16, gap: 14 },
  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" },
  cardHeader: {
    backgroundColor: "#1F7A29",
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  cardBody: { padding: 14, gap: 12 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowFull: { marginTop: 4 },
  label: { color: "#6B7280", fontSize: 12 },
  value: { fontSize: 14, fontWeight: "600", color: "#111827" },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  rowTwoCols: { flexDirection: "row", justifyContent: "space-between" },
  col: { flex: 1 },
  separator: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    marginVertical: 12,
  },
});

const styles2 = StyleSheet.create({
  container: { marginTop: 16, paddingBottom: 20 },
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  card: { flex: 1, backgroundColor: "#F2EDE6", borderRadius: 10, padding: 12 },
  label: { fontSize: 11, color: "#9B9B9B", marginBottom: 4 },
  value: { fontSize: 14, fontWeight: "600", color: "#000" },
  buttonsRow: { flexDirection: "row", gap: 12 },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  reject: { backgroundColor: "#AFAFAF" },
  approve: { backgroundColor: "#1E8E3E" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});

export default OrdenesCompraScreen;
