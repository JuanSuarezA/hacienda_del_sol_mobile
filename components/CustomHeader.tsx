import LogoHorizontal from "@/assets/images/logo/Logo-Horizontal.svg";
import Notificaciones from "@/assets/images/logo/Notificaciones-Inactivo.svg";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function CustomHeader() {
  return (
    <View style={styles.container}>
      {/* HEADER VERDE */}
      <View style={styles.header}>
        {/* Logo y título */}
        <View style={styles.logoContainer}>
          <LogoHorizontal />
          {/* <View style={{ marginLeft: 8 }}>
            <Text style={styles.logoText}>HACIENDA</Text>
            <Text style={styles.logoText}>DEL SOL</Text>
          </View> */}
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          <Notificaciones />
          <Image
            source={{ uri: "https://i.pravatar.cc/150" }}
            style={styles.avatar}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
  },

  header: {
    backgroundColor: "#12521C",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
