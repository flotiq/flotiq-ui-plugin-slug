import semver from "semver";

const settingsMigrations = [
  {
    from: "1.0.1",
    to: "1.1.0",
    migration: async (settings) =>
      settings.map(({ content_type, key, label }) => ({
        content_type: content_type,
        source: key,
        target: label,
      })),
  },
];

export const handleMigrate = async ({ previousVersion }) => {
  let settings = previousVersion.settings
    ? JSON.parse(previousVersion.settings)
    : [];

  let versionNumber = previousVersion.version;
  let migration;

  const isNext = (m) =>
    semver.gte(m.from, versionNumber) && semver.lt(versionNumber, m.to);

  while ((migration = settingsMigrations.find(isNext))) {
    settings = await migration.migration(settings);
    versionNumber = migration.to;
  }

  return JSON.stringify(settings);
};
