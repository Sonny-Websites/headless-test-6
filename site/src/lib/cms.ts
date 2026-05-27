import * as items from "@wix/wix-data-items-sdk";
import { auth } from "@wix/essentials";

export interface AboutContent {
  heading: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  sortOrder: number;
}

const queryItems = auth.elevate(items.query);

export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const { items: results } = await queryItems("about-content").limit(1).find();
    const first = results[0] as Partial<AboutContent> | undefined;
    if (!first) return null;
    return {
      heading: first.heading ?? "About test",
      body: first.body ?? "This content will be editable from Wix CMS.",
    };
  } catch (error) {
    console.error("[cms] getAboutContent failed:", error);
    return null;
  }
}

export async function getFaqItems(): Promise<FaqItem[]> {
  try {
    const { items: results } = await queryItems("faq")
      .ascending("sortOrder")
      .limit(50)
      .find();
    return (results as Array<Partial<FaqItem>>).map((entry, index) => ({
      question: entry.question ?? `Question ${index + 1}`,
      answer: entry.answer ?? "Answer pending.",
      sortOrder: entry.sortOrder ?? index + 1,
    }));
  } catch (error) {
    console.error("[cms] getFaqItems failed:", error);
    return [];
  }
}
