// Reuse the existing browser key so previously saved resources and private plans survive.
const key = 'deutsch-hub.study.v1';
function read(): Record<string, unknown> {
  const raw = localStorage.getItem(key);
  if (!raw) return { goal: { level: '', exam: '', hours: '' }, favorites: [], tasks: [] };
  const value = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value) || !Array.isArray(value.favorites)) throw Error('收藏数据格式不正确');
  return value;
}
export function getFavorites(): string[] {
  return (read().favorites as unknown[]).filter((id): id is string => typeof id === 'string' && /^[a-z0-9-]{1,100}$/.test(id));
}
export function toggleFavorite(id: string): boolean {
  const value = read();
  const favorites = getFavorites();
  const saved = !favorites.includes(id);
  value.favorites = saved ? [...favorites, id] : favorites.filter((item) => item !== id);
  localStorage.setItem(key, JSON.stringify(value));
  return saved;
}
export function exportFavorites(): string {
  return JSON.stringify({ version: 1, favorites: getFavorites(), exportedAt: new Date().toISOString() }, null, 2);
}
export function importFavorites(input: unknown): number {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('收藏备份格式不正确');
  const values = (input as { favorites?: unknown }).favorites;
  if (!Array.isArray(values) || values.length > 500 || values.some((id) => typeof id !== 'string' || !/^[a-z0-9-]{1,100}$/.test(id))) throw Error('收藏备份格式不正确');
  const value = read();
  value.favorites = [...new Set([...getFavorites(), ...values])].slice(0, 500);
  localStorage.setItem(key, JSON.stringify(value));
  return (value.favorites as string[]).length;
}
