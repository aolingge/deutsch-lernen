import test from 'node:test';
import assert from 'node:assert/strict';
import { createFavoritesBackup, mergeFavoriteIds, parseFavoritesBackup } from '../src/lib/favorites-backup.mjs';

test('favorites backup is versioned, deduplicated and excludes private fields by construction', () => {
  const backup = createFavoritesBackup(['anki', 'anki', 'duden-mentor'], '2026-10-04T00:00:00.000Z');
  assert.deepEqual(backup, { version: 1, favorites: ['anki', 'duden-mentor'], exportedAt: '2026-10-04T00:00:00.000Z' });
  assert.deepEqual(parseFavoritesBackup(backup), ['anki', 'duden-mentor']);
  assert.equal('tasks' in backup, false);
  assert.equal('goal' in backup, false);
});

test('favorites import rejects unknown versions and invalid identifiers without changing current values', () => {
  assert.throws(() => parseFavoritesBackup({ version: 2, favorites: ['anki'] }), /版本/);
  assert.throws(() => parseFavoritesBackup({ version: 1, favorites: ['../private'] }), /格式/);
  assert.deepEqual(mergeFavoriteIds(['anki'], ['duden-mentor', 'anki']), ['anki', 'duden-mentor']);
});
