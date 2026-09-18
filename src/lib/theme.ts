// lib/theme.ts
// Tokens visuais do app. Se seu outro SaaS já tem um arquivo de tema parecido,
// só adicione essas chaves nele em vez de importar dois temas diferentes.

export type Stroke = "crawl" | "costas" | "borboleta" | "peito" | "medley";

export const strokeColors: Record<Stroke, { solid: string; soft: string; text: string }> = {
  crawl:     { solid: "#0090C3", soft: "#DCF0F8", text: "Crawl" },
  costas:    { solid: "#8B5CF6", soft: "#EDE6FE", text: "Costas" },
  borboleta: { solid: "#FF6B35", soft: "#FFE7DC", text: "Borboleta" },
  peito:     { solid: "#2EC4B6", soft: "#DBF7F4", text: "Peito" },
  medley:    { solid: "#F2C230", soft: "#FDF0C8", text: "Medley" },
};

export const theme = {
  ink: "#0B1F2A",
  inkSoft: "#5C7079",
  base: "#F5FAFB",
  card: "#FFFFFF",
  line: "#E1E9EB",
  gold: "#FFB627",
  goldSoft: "#FFF3DA",
  danger: "#C24E4E",
};

// Adicione ao tailwind.config: extend.colors com essas chaves,
// e extend.fontFamily.display = ['Oswald', 'sans-serif']
// (Inter já deve ser a fonte padrão do seu outro SaaS)