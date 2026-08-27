const categories = [
  "Stofzuiger",
  "Grasmaaier",
  "Barbeque",
  "Bakfiets",
  "Aanhangwagen",
] as const;

export type Category = (typeof categories)[number];

export default categories;
