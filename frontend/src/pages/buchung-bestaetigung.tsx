import { CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function BuchungBestaetigungPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Buchungsbestätigung</h1>
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <CheckCircle className="size-12 text-green-500" />
          <p className="text-lg font-medium">Deine Buchung war erfolgreich!</p>
          <p className="text-muted-foreground">
            Der Konferenzraum wurde für dich reserviert.
          </p>
          <Button asChild variant="outline">
            <Link to="/buchungen">Zu meinen Buchungen</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
