import categoriesJson from '../data/categories.json';
import resourcesJson from '../data/resources.json';
import type { Category, Resource } from './types';

export const categories = categoriesJson as Category[];
export const resources = resourcesJson as Resource[];
export const categoryById = new Map(categories.map((category) => [category.id, category]));

export const levelLabels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export const priceLabels = { free: '免费', freemium: '部分免费', paid: '付费', unknown: '费用待核实' } as const;
export const accessLabels = { open: '免注册', registration: '需注册', 'exam-registration': '需报名条件', unknown: '条件待核实' } as const;

export function filterResources(items: Resource[], query = '', level = '', category = '', skill = '', exam = '') {
  const normalized = query.trim().toLocaleLowerCase();
  return items.filter((item) => {
    const haystack = [item.titleZh, item.titleOriginal, item.descriptionZh, item.sourceName, ...item.tags, ...item.skills, ...item.exams].filter(Boolean).join(' ').toLocaleLowerCase();
    return (!normalized || haystack.includes(normalized)) && (!level || item.levels.includes(level as Resource['levels'][number])) && (!category || item.primaryCategory === category) && (!skill || item.skills.includes(skill)) && (!exam || item.exams.includes(exam));
  });
}
