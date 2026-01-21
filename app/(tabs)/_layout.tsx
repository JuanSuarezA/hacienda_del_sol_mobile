import { Tabs } from "expo-router";
import React from "react";

import ComprasIcon from "@/assets/images/menu_icon/Compras.svg";
import DespachosIcon from "@/assets/images/menu_icon/Despachos.svg";
import HomeIcon from "@/assets/images/menu_icon/Home.svg";
import OfertasIcon from "@/assets/images/menu_icon/Ofertas.svg";
import PagosIcon from "@/assets/images/menu_icon/Pagos.svg";
import PorteriaIcon from "@/assets/images/menu_icon/Porteria.svg";
import { HapticTab } from "@/components/haptic-tab";
import { AuthProvider } from "@/context/AuthContext";

export default function TabLayout() {
  const colorScheme = "#12521C";

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colorScheme,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <HomeIcon fill={color} />,
          }}
        />
        <Tabs.Screen
          name="orden-de-compra/index"
          options={{
            title: "COMPRAS",
            tabBarIcon: ({ color }) => <ComprasIcon fill={color} />,
          }}
        />
        <Tabs.Screen
          name="pago/index"
          options={{
            title: "PAGOS",
            tabBarIcon: ({ color }) => <PagosIcon fill={color} />,
          }}
        />
        <Tabs.Screen
          name="oferta/index"
          options={{
            title: "OFERTAS",
            tabBarIcon: ({ color }) => <OfertasIcon fill={color} />,
          }}
        />
        <Tabs.Screen
          name="despacho/index"
          options={{
            title: "DESPACHOS",
            tabBarIcon: ({ color }) => <DespachosIcon fill={color} />,
          }}
        />
        <Tabs.Screen
          name="porteria/index"
          options={{
            title: "PORTERIA",
            tabBarIcon: ({ color }) => <PorteriaIcon fill={color} />,
          }}
        />
        <Tabs.Screen
          name="notificaciones"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="orden-de-compra/listado/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="orden-de-compra/pendiente/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="orden-de-compra/listado/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="orden-de-compra/pendiente/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="orden-de-compra/aprobada/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="orden-de-compra/recepcionada/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="orden-de-compra/aprobada/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="orden-de-compra/recepcionada/[id]"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="pago/aprobada/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="pago/aprobada/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="pago/listado/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="pago/listado/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="pago/pagada/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="pago/pendiente/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="pago/pendiente/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="porteria/ingresos/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="porteria/contratos/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="despacho/listado/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="despacho/listado/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="despacho/pendiente/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="despacho/pendiente/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="despacho/por-cargar/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="despacho/por-cargar/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="despacho/por-despachar/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="despacho/por-despachar/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="oferta/compra/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="oferta/compra/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="oferta/compra-pendiente/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="oferta/compra-pendiente/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="oferta/venta/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="oferta/venta/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="oferta/venta-pendiente/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="oferta/venta-pendiente/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
