"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { store } from "../store";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <Provider store={store}>{children}</Provider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
