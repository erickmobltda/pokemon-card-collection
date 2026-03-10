import { cn } from "@/lib/utils";
import type { Card, CardCondition } from "@/lib/db/types";

export function conditionBadgeClass(condition: CardCondition): string {
  switch (condition) {
    case "Near Mint":
      return "bg-green-500 text-white border-green-600";
    case "Lightly Played":
      return "bg-sky-500 text-white border-sky-600";
    case "Moderately Played":
      return "bg-yellow-500 text-white border-yellow-600";
    case "Heavily Played":
      return "bg-orange-500 text-white border-orange-600";
    case "Damaged":
      return "bg-red-500 text-white border-red-600";
    default:
      return "bg-gray-500 text-white";
  }
}

const conditionAbbr: Record<CardCondition, string> = {
  "Near Mint": "NM",
  "Lightly Played": "LP",
  "Moderately Played": "MP",
  "Heavily Played": "HP",
  "Damaged": "DM",
};

interface CardThumbnailProps {
  card: Card;
  onClick?: () => void;
  className?: string;
  readOnly?: boolean;
}

export function CardThumbnail({ card, onClick, className, readOnly = false }: CardThumbnailProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-2xl overflow-hidden border-2 border-purple-200 dark:border-purple-800",
        "bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
        "shadow-md transition-all duration-200",
        !readOnly && "hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg cursor-pointer",
        className,
      )}
    >
      {/* Card image */}
      <div className="aspect-[3/4] relative bg-muted/30">
        {card.image_url ? (
          <img
            src={card.image_url}
            alt={card.name}
            className="w-full h-full object-contain p-1"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <span className="text-4xl font-bold opacity-20">
              {card.name.charAt(0).toUpperCase()}
            </span>
            <span className="text-[9px] opacity-40">sem imagem</span>
          </div>
        )}

        {/* Quantity badge (top-left) */}
        {card.quantity > 1 && (
          <div className="absolute top-1.5 left-1.5 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
            x{card.quantity}
          </div>
        )}

        {/* Condition badge (top-right) */}
        <div
          className={cn(
            "absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow",
            conditionBadgeClass(card.condition),
          )}
        >
          {conditionAbbr[card.condition]}
        </div>
      </div>

      {/* Info footer */}
      <div className="px-2 pt-1.5 pb-2 space-y-0.5">
        <p className="font-bold text-xs truncate leading-tight">{card.name}</p>
        {card.set_name && (
          <p className="text-[10px] text-muted-foreground truncate">{card.set_name}</p>
        )}
        {card.rarity && (
          <p className="text-[9px] text-purple-600 dark:text-purple-400 truncate">{card.rarity}</p>
        )}
      </div>
    </div>
  );
}
