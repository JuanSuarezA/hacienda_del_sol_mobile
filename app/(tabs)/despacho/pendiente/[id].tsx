import CustomHeader from "@/components/CustomHeader";
import { useAuth } from "@/context/AuthContext";
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
  potrero: string;
  costo: string;
  cantidad: string;
  total: string;
  n: string;
  codigo_categoria: string;
}

interface Transporte {
  id: number;
  nombre_chofer: string;
  ci_chofer: string;
  placa_camion: string;
  cantidad: string;
  estado: string;
  n: string;
}

interface SectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface RowProps {
  label: string;
  value: string;
}

interface RowFullProps {
  label: string;
  value: string;
}

interface RowBadgeProps {
  label: string;
  value: string;
  color?: string;
}

interface RowTwoColsProps {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}

interface RowThreeColsProps {
  leftLabel: string;
  leftValue: string;
  centerLabel: string;
  centerValue: string;
  rightLabel: string;
  rightValue: string;
}

const OrdenesCompraScreen = () => {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <Text>Cargando usuario...</Text>;
  const { id } = useLocalSearchParams<{ id: string }>();

  const [openSolicitud, setOpenSolicitud] = useState(true);
  const [openSolicitante, setOpenSolicitante] = useState(true);
  const [openProveedor, setOpenProveedor] = useState(true);
  const [openObservaciones, setOpenObservaciones] = useState(true);
  const [openProducto, setOpenProducto] = useState(true);
  const [openTransporte, setOpenTransporte] = useState(true);

  // 2. Definir estados para los datos, la carga y el error
  const [orden, setOrden] = useState<Orden | null>(null);
  const [detalle, setDetalle] = useState<Detalle[]>([]);
  const [transporte, setTransporte] = useState<Transporte[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      // Reemplaza esta URL por la de tu API real
      const [ordenRes, detalleRes, transporteRes] = await Promise.all([
        fetch(
          `https://kleurdigital.xyz/util/orden-de-despacho/queryPedidoId_mobile.php?id=${id}`,
        ),
        fetch(
          `https://kleurdigital.xyz/util/orden-de-despacho/queryPedidoDetalleId_mobile.php?id=${id}`,
        ),
        fetch(
          `https://kleurdigital.xyz/util/orden-de-despacho/queryPedidoDetalleTransportistaId_mobile.php?id=${id}`,
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

  const handleUpdateStatus = async (tipo: string) => {
    const accion = tipo === "1" ? "aprobar" : "rechazar";
    Alert.alert(
      "Confirmación",
      `¿Estás seguro de que quieres ${accion} esta orden de despacho?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: `Sí, ${accion}`,
          onPress: async () => {
            try {
              setLoading(true); // Opcional: mostrar loading mientras la API responde

              const response = await fetch(
                `https://kleurdigital.xyz/util/aprobaciones-od/editarPedido_mobile.php?id=${id}&tipo=${tipo}&u=${user?.id}`,
              );

              const result = await response.json();

              if (result.estado == "1") {
                Alert.alert("Éxito", result.mensaje);
                // Recargar los datos para ver el cambio de estado y color
                router.push("/despacho/pendiente");
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
      ],
    );
  };

  useFocusEffect(
    useCallback(() => {
      if (id) fetchOrdenes();
    }, [id]),
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E6B34D" />
      </View>
    );
  }

  if (!orden) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />

      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Link style={styles.backButton} href={"/despacho/pendiente"}>
            <Ionicons name="arrow-back" size={23} color="white" />
          </Link>
          <Text style={styles.headerTitle}>{orden.codigo}</Text>
          <View style={[styles.badge, { backgroundColor: orden.color_estado }]}>
            <Text style={styles.badgeText}>{orden.estado}</Text>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* SOLICITUD */}
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

        {/* PROVEEDOR */}
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

        {/* SOLICITANTE */}
        <Section
          title="Datos del Solicitante"
          open={openSolicitante}
          onToggle={() => setOpenSolicitante(!openSolicitante)}
        >
          <RowTwoCols
            leftLabel="Solicitante"
            leftValue={orden.solicitante}
            rightLabel="Ciudad"
            rightValue="Santa Cruz, Bolivia"
          />
          <RowTwoCols
            leftLabel="Telefono"
            leftValue={orden.telefono_solicitante}
            rightLabel="Correo Electronico"
            rightValue={orden.email_solicitante}
          />
        </Section>

        {/* OBSERVACIONES */}
        <Section
          title="Observaciones"
          open={openObservaciones}
          onToggle={() => setOpenObservaciones(!openObservaciones)}
        >
          <RowFull label="" value={orden.observacion} />
        </Section>

        {/* TRANSPORTE */}
        <Section
          title="Datos del Transportista"
          open={openTransporte}
          onToggle={() => setOpenTransporte(!openTransporte)}
        >
          {transporte.map((item) => (
            <View key={item.id} style={{ gap: 8 }}>
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
                rightLabel=""
                rightValue=""
              />
              <RowFull label="Estado" value={orden.estado} />

              <View style={styles.separator} />
            </View>
          ))}
        </Section>

        {/* PRODUCTOS */}
        <Section
          title="Datos del Producto"
          open={openProducto}
          onToggle={() => setOpenProducto(!openProducto)}
        >
          {detalle.map((item) => (
            <View key={item.id} style={{ gap: 8 }}>
              <RowFull label="Nro." value={item.n} />
              <RowThreeCols
                leftLabel="Codigo"
                leftValue={item.codigo_categoria}
                centerLabel="Raza"
                centerValue={item.nombre_subcategoria}
                rightLabel="Genero"
                rightValue={item.nombre_producto}
              />

              <RowThreeCols
                leftLabel="Cantidad"
                leftValue={item.cantidad}
                centerLabel="Precio"
                centerValue={item.costo}
                rightLabel="Potrero"
                rightValue={item.potrero}
              />
              <View style={styles.separator} />
            </View>
          ))}
        </Section>

        <View style={styles.container}>
          {/* Creadores */}
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

          <View style={styles2.row}>
            <View style={styles2.card}>
              <Text style={styles2.label}>CARGADA POR:</Text>
              <Text style={styles2.value}>{orden.cargador || "-"}</Text>
            </View>

            <View style={styles2.card}>
              <Text style={styles2.label}>DESPACHADA POR:</Text>
              <Text style={styles2.value}>{orden.despachador || "-"}</Text>
            </View>
          </View>

          {/* Botones */}
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
              <Text style={styles2.buttonText}>APROBAR</Text>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section: React.FC<SectionProps> = ({
  title,
  open,
  onToggle,
  children,
}) => (
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

const Row: React.FC<RowProps> = ({ label, value }) => (
  <View style={styles.row}>
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const RowFull: React.FC<RowFullProps> = ({ label, value }) => (
  <View style={styles.rowFull}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const RowBadge: React.FC<RowBadgeProps> = ({
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

const RowTwoCols: React.FC<RowTwoColsProps> = ({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}) => (
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

const RowThreeCols: React.FC<RowThreeColsProps> = ({
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

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    marginVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
  },
  scrollContainer: { padding: 0 },
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  header: {
    backgroundColor: "#1F2937",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerContainer: {
    marginBottom: 0,
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
  headerTitle: {
    flex: 1,
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#1F7A29",
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  cardBody: {
    padding: 14,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowFull: {
    marginTop: 4,
  },
  label: {
    color: "#6B7280",
    fontSize: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  statusBadge: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  rowTwoCols: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
  },
});

const styles2 = StyleSheet.create({
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
    backgroundColor: "#AFAFAF",
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

export default OrdenesCompraScreen;
