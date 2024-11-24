"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-theme";
import { type ThemeProviderProps } from "next-theme/dist/provider/index.props";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
