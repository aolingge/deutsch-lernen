const favoriteId = /^[a-z0-9-]{1,100}$/;

export const favoriteBackupVersion = 1;

/** @param {unknown} value */
export function validFavoriteIds(value) {
  if (!Array.isArray(value) || value.length > 500) return false;
  return value.every((id) => typeof id === 'string' && favoriteId.test(id));
}

/** @param {unknown} value */
export function normalizeFavoriteIds(value) {
  if (!validFavoriteIds(value)) throw Error('收藏备份格式不正确');
  return [...new Set(/** @type {string[]} */ (value))];
}

/** @param {unknown} favorites @param {string} [exportedAt] */
export function createFavoritesBackup(favorites, exportedAt = new Date().toISOString()) {
  return { version: favoriteBackupVersion, favorites: normalizeFavoriteIds(favorites), exportedAt };
}

/** @param {unknown} input */
export function parseFavoritesBackup(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('收藏备份格式不正确');
  const backup = /** @type {{version?: unknown, favorites?: unknown}} */ (input);
  if (backup.version !== favoriteBackupVersion) throw Error('不支持的收藏备份版本');
  return normalizeFavoriteIds(backup.favorites);
}

/** @param {unknown} current @param {unknown} incoming */
export function mergeFavoriteIds(current, incoming) {
  return [...new Set([...normalizeFavoriteIds(current), ...normalizeFavoriteIds(incoming)])].slice(0, 500);
}
