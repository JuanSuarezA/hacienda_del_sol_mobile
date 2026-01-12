import React from "react";
import { StyleSheet, Text } from "react-native";

const obtenerFechaActual = () => {
  const fecha = new Date();
  return fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Para que la primera letra sea mayúscula (ej: "Lunes...")
const fechaFormateada =
  obtenerFechaActual().charAt(0).toUpperCase() + obtenerFechaActual().slice(1);

const CustomFechaActual = () => {
  return <Text style={styles2.subtitle}>{fechaFormateada}</Text>;
};

const styles2 = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default CustomFechaActual;
