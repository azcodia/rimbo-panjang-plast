"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { MaterialDesignContent, SnackbarProvider } from "notistack";
import { store } from "../store";
import "../styles/globals.css";
import { ColorProvider } from "@/context/ColorContext";
import { SizeProvider } from "@/context/SizeContext";
import { HeavyProvider } from "@/context/HeavyContext";

import { styled } from "@mui/material/styles";
import { ReStockProvider } from "@/context/RestockContext";
import { DeliveryProvider } from "@/context/DeliveryContext";
import { CustomerProvider } from "@/context/CustomerContext";
import { BankProvider } from "@/context/BankContext";
const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-success": {
    backgroundColor: "#7bb927",
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: "#d00e0c",
  },
}));

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3000}
          Components={{
            success: StyledMaterialDesignContent,
            error: StyledMaterialDesignContent,
          }}
        >
          <DeliveryProvider>
            <ReStockProvider>
              <BankProvider>
                <CustomerProvider>
                  <HeavyProvider>
                    <SizeProvider>
                      <ColorProvider>
                        <Provider store={store}>{children}</Provider>
                      </ColorProvider>
                    </SizeProvider>
                  </HeavyProvider>
                </CustomerProvider>
              </BankProvider>
            </ReStockProvider>
          </DeliveryProvider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
