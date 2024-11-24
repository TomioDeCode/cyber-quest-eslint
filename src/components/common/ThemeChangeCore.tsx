"use client";

import { useEffect, useState } from "react";
import { ThemeChange } from "../core/ThemeChange";

const ThemeChangeComponent = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ThemeChange />;
};

export default ThemeChangeComponent;
