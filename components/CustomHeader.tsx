import LogoHorizontal from "@/assets/images/logo/Logo-Horizontal.svg";
import Notificaciones from "@/assets/images/logo/Notificaciones-Inactivo.svg";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function CustomHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Link href="/(tabs)">
            <LogoHorizontal />
          </Link>
        </View>
        <View style={styles.actions}>
          <Link href="/notificaciones">
            <Notificaciones />
          </Link>
          <Image
            source={require("@/assets/images/varios/user.png")}
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
