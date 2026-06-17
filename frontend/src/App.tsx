import { Routes, Route } from "react-router-dom"

import { AppLayout } from "@/components/app-layout"
import { Toaster } from "@/components/ui/sonner"
import { DashboardPage } from "@/pages/dashboard"
import { BuchenPage } from "@/pages/buchen"
import { RaeumePage } from "@/pages/raeume"
import { MeineBuchungenPage } from "@/pages/meine-buchungen"
import { ImBueroPage } from "@/pages/im-buero"

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/buchen" element={<BuchenPage />} />
          <Route path="/raeume" element={<RaeumePage />} />
          <Route path="/buchungen" element={<MeineBuchungenPage />} />
          <Route path="/im-buero" element={<ImBueroPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
