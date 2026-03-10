import { cn } from "@/lib/utils";
import type { PokemonCard, CardRarity } from "@/lib/db/types";

const rarityConfig: Record<
  CardRarity,
  { label: string; cardClass: string; badgeClass: string; stars: string }
> = {
  Common: {
    label: "Comum",
    cardClass:
      "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-gray-400",
    badgeClass: "bg-gray-500 text-white",
    stars: "○",
  },
  Uncommon: {
    label: "Incomum",
    cardClass:
      "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-500",
    badgeClass: "bg-green-600 text-white",
    stars: "◇",
  },
  Rare: {
    label: "Raro",
    cardClass:
      "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-500",
    badgeClass: "bg-blue-600 text-white",
    stars: "★",
  },
  "Holo Rare": {
    label: "Holo Raro",
    cardClass:
      "from-cyan-50 via-blue-50 to-cyan-100 dark:from-cyan-950 dark:via-blue-950 dark:to-cyan-900 border-cyan-400",
    badgeClass: "bg-cyan-500 text-white",
    stars: "★★",
  },
  "Ultra Rare": {
    label: "Ultra Raro",
    cardClass:
      "from-purple-50 via-violet-50 to-purple-100 dark:from-purple-950 dark:via-violet-950 dark:to-purple-900 border-purple-500",
    badgeClass: "bg-purple-600 text-white",
    stars: "★★★",
  },
  "Secret Rare": {
    label: "Secreto Raro",
    cardClass:
      "from-yellow-50 via-amber-50 to-orange-100 dark:from-yellow-950 dark:via-amber-950 dark:to-orange-950 border-yellow-400",
    badgeClass:
      "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    stars: "✦✦✦",
  },
};

interface PokemonCardDisplayProps {
  card: PokemonCard;
  onClick?: () => void;
  className?: string;
}

export function PokemonCardDisplay({
  card,
  onClick,
  className,
}: PokemonCardDisplayProps) {
  const config = rarityConfig[card.rarity];

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer select-none",
        "transition-transform duration-200 hover:scale-[1.03] hover:-translate-y-1",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-2xl border-2 bg-gradient-to-b p-3 shadow-md",
          "flex flex-col gap-2 w-full",
          config.cardClass,
          card.rarity === "Secret Rare" &&
            "shadow-yellow-300/50 shadow-lg",
          card.rarity === "Ultra Rare" &&
            "shadow-purple-400/40 shadow-lg",
          card.rarity === "Holo Rare" && "shadow-cyan-300/30 shadow-md",
        )}
      >
        {/* Card inner border */}
        <div className="rounded-xl border border-yellow-400/60 bg-white/30 dark:bg-black/20 p-2 flex flex-col gap-2">
          {/* Header: name + HP */}
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-sm leading-tight truncate max-w-[60%] text-gray-900 dark:text-white">
              {card.name}
            </span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 shrink-0">
              <span className="text-[10px] font-normal">HP</span>{" "}
              <span className="text-sm text-red-600 dark:text-red-400">
                {card.hp}
              </span>
            </span>
          </div>

          {/* Image */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-white/50 dark:bg-black/30 border border-yellow-300/40 flex items-center justify-center">
            {card.photo_url ? (
              <img
                src={card.photo_url}
                alt={card.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
                <span className="text-4xl font-bold opacity-20">
                  {card.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-[10px] opacity-40">sem imagem</span>
              </div>
            )}
          </div>

          {/* Footer: rarity */}
          <div className="flex items-center justify-between px-1">
            <span
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                config.badgeClass,
              )}
            >
              {config.label}
            </span>
            <span className="text-[11px] text-yellow-500 tracking-widest">
              {config.stars}
            </span>
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 group-hover:ring-primary/50 transition-all duration-200 pointer-events-none" />
    </div>
  );
}
