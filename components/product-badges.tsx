'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface ProductBadgesProps {
  isNew: boolean
  isLaunch: boolean
  isPromotion: boolean
  onNewChange: (value: boolean) => void
  onLaunchChange: (value: boolean) => void
  onPromotionChange: (value: boolean) => void
}

export default function ProductBadges({
  isNew,
  isLaunch,
  isPromotion,
  onNewChange,
  onLaunchChange,
  onPromotionChange
}: ProductBadgesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🏷️</span>
          Badges do Produto
        </CardTitle>
        <CardDescription>
          Configure os badges que aparecerão no produto para destacá-lo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Badge Novo */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor="badge-new" className="font-medium">Badge "Novo"</Label>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                Novo
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Destaca produtos recém-cadastrados
            </p>
          </div>
          <Switch
            id="badge-new"
            checked={isNew}
            onCheckedChange={onNewChange}
          />
        </div>

        {/* Badge Lançamento */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor="badge-launch" className="font-medium">Badge "Lançamento"</Label>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Lançamento
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Destaca produtos em lançamento especial
            </p>
          </div>
          <Switch
            id="badge-launch"
            checked={isLaunch}
            onCheckedChange={onLaunchChange}
          />
        </div>

        {/* Badge Promoção */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor="badge-promotion" className="font-medium">Badge "Promoção"</Label>
              <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                Promoção
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Destaca produtos em promoção
            </p>
          </div>
          <Switch
            id="badge-promotion"
            checked={isPromotion}
            onCheckedChange={onPromotionChange}
          />
        </div>

        {/* Preview dos badges ativos */}
        {(isNew || isLaunch || isPromotion) && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-3">Preview dos badges:</h4>
            <div className="flex flex-wrap gap-2">
              {isNew && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  Novo
                </Badge>
              )}
              {isLaunch && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  Lançamento
                </Badge>
              )}
              {isPromotion && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                  Promoção
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
 
 
 