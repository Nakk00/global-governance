import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import "./styles/motion.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/contexts/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <App />
    </ThemeProvider>
  </StrictMode>
)
