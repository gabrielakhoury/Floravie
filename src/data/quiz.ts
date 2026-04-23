export interface Question {
  id: string;
  text: string;
  options: Option[];
  multiple?: boolean;
}

export interface Option {
  label: string;
  value: string;
  filter: (product: any) => boolean;
}

export const quizQuestions: Question[] = [
  {
    id: "age",
    text: "Qual é a idade da sua pele?",
    options: [
      { label: "Jovem", value: "jovem", filter: (p) => !p.skinType.includes("Pele Madura") || p.skinType.includes("Todos os tipos") },
      { label: "Madura", value: "madura", filter: (p) => p.skinType.includes("Pele Madura") || p.skinType.includes("Todos os tipos") },
    ]
  },
  {
    id: "skinType",
    text: "Como você descreveria seu tipo de pele?",
    options: [
      { label: "Seca", value: "seca", filter: (p) => p.skinType.includes("Pele Seca") || p.skinType.includes("Todos os tipos") },
      { label: "Oleosa", value: "oleosa", filter: (p) => p.skinType.includes("Pele Oleosa") || p.skinType.includes("Todos os tipos") },
      { label: "Mista", value: "mista", filter: (p) => p.skinType.includes("Pele Mista") || p.skinType.includes("Todos os tipos") },
    ]
  },
  {
    id: "concerns",
    text: "Qual é a sua principal preocupação?",
    multiple: true,
    options: [
      { label: "Hidratação", value: "hidratacao", filter: (p) => p.purpose.toLowerCase().includes("hidratante") || p.purpose.toLowerCase().includes("reparação") || p.purpose.toLowerCase().includes("nutre") },
      { label: "Oleosidade/Poros", value: "oleosidade", filter: (p) => p.purpose.toLowerCase().includes("oleosidade") || p.purpose.toLowerCase().includes("poros") || p.purpose.toLowerCase().includes("acne") || p.purpose.toLowerCase().includes("imperfeições") },
      { label: "Antissinais/Firmeza", value: "antissinais", filter: (p) => p.purpose.toLowerCase().includes("firmador") || p.purpose.toLowerCase().includes("firmeza") || p.purpose.toLowerCase().includes("antissinais") || p.purpose.toLowerCase().includes("envelhecimento") || p.purpose.toLowerCase().includes("elasticidade") },
      { label: "Uniformizar Tom/Brilho", value: "uniformizar", filter: (p) => p.purpose.toLowerCase().includes("uniformizar") || p.purpose.toLowerCase().includes("iluminador") || p.purpose.toLowerCase().includes("brilho") || p.purpose.toLowerCase().includes("viço") || p.purpose.toLowerCase().includes("luminosidade") },
      { label: "Pele Sensível", value: "sensivel", filter: (p) => p.skinType.includes("Pele Sensível") || p.skinType.includes("Todos os tipos") },
    ]
  },
  {
    id: "goal",
    text: "O que você está procurando hoje?",
    options: [
      { label: "Um produto específico", value: "single", filter: (p) => p.category !== "Kit" },
      { label: "Uma rotina completa (Kits)", value: "kit", filter: (p) => p.category === "Kit" },
      { label: "Tudo o que for ideal para mim", value: "all", filter: (p) => true },
    ]
  }
];
