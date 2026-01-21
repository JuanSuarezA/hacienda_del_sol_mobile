import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import {
  Link,
  Redirect,
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
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

interface Orden {
  id: number;
  codigo: string;
  tipo_orden: string;
  tipo_pago: string;
  fecha: string;
  color_estado: string;
  estado: string;
  observacion: string;
  proveedor: string;
  nit: string;
  telefono: string;
  email: string;
  solicitante: string;
  email_solicitante: string;
  telefono_solicitante: string;
  aprobador: string;
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
  const { id } = useLocalSearchParams<{ id: string }>();

  const navigation = useNavigation();

  const [openSolicitud, setOpenSolicitud] = useState(false);
  const [openSolicitante, setOpenSolicitante] = useState(false);
  const [openProveedor, setOpenProveedor] = useState(false);
  const [openObservaciones, setOpenObservaciones] = useState(false);
  const [openProducto, setOpenProducto] = useState(true);

  // 2. Definir estados para los datos, la carga y el error
  const [orden, setOrden] = useState<Orden | null>(null);
  const [detalle, setDetalle] = useState<Detalle[]>([]);
  const [loading, setLoading] = useState(true);

  const resumen = React.useMemo(() => {
    const totalGeneral = detalle.reduce(
      (acc, item) => acc + Number(item.total),
      0,
    );

    return {
      totalGeneral,
    };
  }, [detalle]);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      // Reemplaza esta URL por la de tu API real
      const [ordenRes, detalleRes] = await Promise.all([
        fetch(
          `https://kleurdigital.xyz/util/orden-de-compra/queryOrdenId_mobile.php?id=${id}`,
        ),
        fetch(
          `https://kleurdigital.xyz/util/orden-de-compra/queryOrdenDetalleId_mobile.php?id=${id}`,
        ),
      ]);
      const ordenJson = await ordenRes.json();
      const detalleJson = await detalleRes.json();

      setOrden(ordenJson.data?.[0] || null);
      setDetalle(detalleJson.data || []);
    } catch (error) {
      console.error("Error obteniendo ordenes:", error);
    } finally {
      setLoading(false);
    }
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
          <Link
            style={styles.backButton}
            href={"/orden-de-compra/recepcionada"}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
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
          title="Orden de Compra"
          open={openSolicitud}
          onToggle={() => setOpenSolicitud(!openSolicitud)}
        >
          <RowTwoCols
            leftLabel="NRO"
            leftValue={orden.codigo}
            rightLabel="Tipo de Orden"
            rightValue={orden.tipo_orden}
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
          title="Datos del Proveedor"
          open={openProveedor}
          onToggle={() => setOpenProveedor(!openProveedor)}
        >
          <RowTwoCols
            leftLabel="Proveedor"
            leftValue={orden.proveedor}
            rightLabel="NIT"
            rightValue={orden.nit}
          />
          <RowTwoCols
            leftLabel="Telefono"
            leftValue={orden.telefono}
            rightLabel="Correo Electronico"
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

        {/* PRODUCTOS */}
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
          <RowThreeCols
            leftLabel=""
            leftValue=""
            centerLabel=""
            centerValue="Total"
            rightLabel=""
            rightValue={resumen.totalGeneral.toFixed(2)}
          />
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

          {/* Botones */}
          <View style={styles2.buttonsRow}>
            <TouchableOpacity
              style={[styles2.button, styles2.reject]}
              onPress={() => router.push("/(tabs)/orden-de-compra/listado")}
            >
              <Text style={styles2.buttonText}>CERRAR</Text>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles2.button, styles2.approve]}
              onPress={() => router.push("/(tabs)/orden-de-compra/listado")}
            >
              <Text style={styles2.buttonText}>PDF</Text>
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
