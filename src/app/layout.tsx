"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { store } from "../store";
import "../styles/globals.css";
import { ColorProvider } from "@/context/ColorContext";
import { SizeContent } from "@/components/tabs/content/size/size";
import { SizeProvider } from "@/context/SizeContext";
import { SizeProviderNew } from "@/context/SizeContextNew";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <SizeProviderNew>
            <SizeProvider>
              <ColorProvider>
                <Provider store={store}>{children}</Provider>
              </ColorProvider>
            </SizeProvider>
          </SizeProviderNew>
        </SnackbarProvider>
      </body>
    </html>
  );
}
