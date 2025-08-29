"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, ExternalLink, Check } from "lucide-react"
import type { Gift as GiftType } from "@/lib/supabase/client" // Caminho do import atualizado

interface GiftCardProps {
  gift: GiftType
  onPurchase: (giftId: number, purchaserName: string) => void
}

export function GiftCard({ gift, onPurchase }: GiftCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaserName, setPurchaserName] = useState("")

  const handlePurchase = () => {
    if (!purchaserName.trim()) return
    setIsPurchasing(true)
    onPurchase(gift.id, purchaserName)
    setIsPurchasing(false)
  }

  return (
    <Card
      className={`bg-white border-[#3CB371]/30 transition-all duration-300 hover:shadow-lg hover:scale-105 ${gift.is_purchased ? "opacity-75" : ""}`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Gift className={`text-[#3CB371] ${gift.is_purchased ? "text-gray-400" : ""}`} size={48} />
            {gift.is_purchased && (
              <Check className="absolute -top-2 -right-2 text-green-600 bg-white rounded-full p-1" size={24} />
            )}
          </div>

          <div>
            <h3 className="font-serif text-xl text-[#2d5a3d] mb-2">{gift.name}</h3>
            {gift.description && <p className="text-sm text-gray-600 mb-2">{gift.description}</p>}
            {gift.price_range && <p className="text-[#DAA520] font-medium">{gift.price_range}</p>}
          </div>

          {gift.is_purchased ? (
            <div className="text-center">
              <p className="text-green-600 font-medium">Já foi presenteado!</p>
              {gift.purchased_by && <p className="text-sm text-gray-500">Por: {gift.purchased_by}</p>}
            </div>
          ) : (
            <div className="space-y-3 w-full">
              {gift.store_link && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#3CB371] text-[#3CB371] hover:bg-[#3CB371] hover:text-white bg-transparent"
                  onClick={() => window.open(gift.store_link!, "_blank")}
                >
                  <ExternalLink size={16} className="mr-2" />
                  Ver na loja
                </Button>
              )}

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={purchaserName}
                  onChange={(e) => setPurchaserName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#3CB371]/30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371]"
                />
                <Button
                  size="sm"
                  className="w-full bg-[#3CB371] hover:bg-[#2d5a3d] text-white"
                  onClick={handlePurchase}
                  disabled={!purchaserName.trim() || isPurchasing}
                >
                  {isPurchasing ? "Marcando..." : "Marcar como presenteado"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}