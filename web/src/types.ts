export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Resource = {
  id: string; slug: string; titleOriginal?: string; titleZh: string; descriptionZh: string; howToUseZh?: string;
  primaryCategory: string; tags: string[]; levels: Level[]; levelBasis: 'official' | 'editorial' | 'unspecified';
  skills: string[]; exams: string[]; formats: string[]; price: 'free' | 'freemium' | 'paid' | 'unknown';
  access: 'open' | 'registration' | 'exam-registration' | 'unknown'; languages: string[]; sourceName: string;
  url: string; canonicalUrl: string; rights: 'link-only' | 'owned' | 'licensed'; status: 'published' | 'draft' | 'archived';
  linkStatus: 'unchecked' | 'ok' | 'restricted' | 'broken'; lastEditorialCheckedAt?: string;
};
export type Category = { id: string; name: string; description: string; accent: string };
