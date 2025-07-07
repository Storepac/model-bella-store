import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Moeda e Fuso Horário</CardTitle>
          <CardDescription>Defina a moeda e o fuso horário para sua loja.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select defaultValue="BRL">
                <SelectTrigger className="w-full" />
                <SelectContent>
                  <SelectItem value="BRL">Real (BRL)</SelectItem>
                  <SelectItem value="USD">Dólar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select defaultValue="America/Sao_Paulo">
                <SelectTrigger className="w-full" />
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">(GMT-03:00) São Paulo</SelectItem>
                  <SelectItem value="America/New_York">(GMT-04:00) Nova Iorque</SelectItem>
                  <SelectItem value="Europe/London">(GMT+01:00) Londres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button className="w-full md:w-auto py-3 text-base md:py-2">Salvar</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
