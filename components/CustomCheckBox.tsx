import Checkbox from "expo-checkbox";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

// Definimos la forma de las propiedades
interface CustomCheckboxProps {
  label: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
  color?: string;
  disabled?: boolean; // <-- Añadir esto
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  value,
  onChange,
  color = "#4630EB",
  disabled = false,
}) => {
  return (
    <Pressable
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }]} // Se ve gris si está deshabilitado
      onPress={() => !disabled && onChange(!value)} // Solo cambia si no está disabled
    >
      <Checkbox
        value={value}
        onValueChange={(val) => !disabled && onChange(val)}
        color={value ? color : undefined}
        disabled={disabled} // Prop nativa de expo-checkbox
      />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
});

export default CustomCheckbox;
