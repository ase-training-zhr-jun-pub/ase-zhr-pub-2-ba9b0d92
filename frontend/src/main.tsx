import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App"
import { ThemeProvider } from "@/lib/theme"
import { AppProvider } from "@/lib/store"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  </StrictMode>,
)
