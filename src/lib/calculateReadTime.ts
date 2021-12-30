import { RichText } from "prismic-dom";

export function calculateReadTime(content: any) {
  const text = RichText.asText(content);
  const wordCount = text.split(/\s+/gi).length;

  return `${Math.ceil(wordCount / 200)}min`;
}
