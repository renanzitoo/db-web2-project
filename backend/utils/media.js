function resolveAssetUrl(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value) || value.startsWith('/assets/') || value.startsWith('/media/')) return value;
  const normalized = String(value).replace(/\\/g, '/').replace(/^\/+/, '');
  return `/media/${normalized}`;
}

function mapGameMedia(game) {
  if (!game) return null;
  return {
    ...game,
    capa_url: resolveAssetUrl(game.capa_url),
    banner_url: resolveAssetUrl(game.banner_url)
  };
}

function mapUserMedia(user) {
  if (!user) return null;
  return {
    ...user,
    avatar_url: resolveAssetUrl(user.avatar_url)
  };
}

function mapAchievementMedia(achievement) {
  if (!achievement) return null;
  return {
    ...achievement,
    icone_url: resolveAssetUrl(achievement.icone_url)
  };
}

function mapScreenshotMedia(screenshot) {
  if (!screenshot) return null;
  return {
    ...screenshot,
    imagem_url: resolveAssetUrl(screenshot.imagem_url)
  };
}

module.exports = {
  resolveAssetUrl,
  mapGameMedia,
  mapUserMedia,
  mapAchievementMedia,
  mapScreenshotMedia
};