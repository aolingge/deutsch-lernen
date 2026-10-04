export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Resource = {
  id: string; slug: string; titleOriginal?: string; titleZh: string; descriptionZh: string; howToUseZh?: string;
  primaryCategory: string; tags: string[]; levels: Level[]; levelBasis: 'official' | 'editorial' | 'unspecified';
  skills: string[]; exams: string[]; formats: string[]; price: 'free' | 'freemium' | 'paid' | 'unknown';
  access: 'open' | 'registration' | 'exam-registration' | 'unknown'; languages: string[]; sourceName: string;
  url: string; canonicalUrl: string; rights: 'link-only' | 'owned' | 'licensed'; status: 'published' | 'draft' | 'archived';
  linkStatus: 'unchecked' | 'ok' | 'restricted' | 'broken'; lastEditorialCheckedAt?: string;
  providerId?: string; providerType?: 'institution'|'public-media'|'publisher'|'community'|'commercial'|'independent'|'unspecified';
  mediaTypes?: string[]; costNoteZh?: string; accessNoteZh?: string; interfaceLanguages?: string[];
  levelScope?: 'learning'|'any'|'information'; readingDifficultyZh?: string; aliases?: string[];
  lastLinkCheckedAt?: string; editorialStatus?: 'verified'|'partial'|'unverified'; editorialNoteZh?: string;
  evidence?: {url:string; fields:string[]; checkedAt:string}[];
};
export type Category = { id: string; name: string; description: string; accent: string };
