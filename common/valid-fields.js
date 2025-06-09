import pluginInfo from '../plugin-manifest.json';

export const getValidFields = (contentTypes) => {
  const fieldOptions = {};
  const fieldKeys = {};

  contentTypes.forEach(({ name, metaDefinition, schemaDefinition }) => {
    fieldOptions[name] = [];
    fieldKeys[name] = [];

    Object.entries(metaDefinition?.propertiesConfig || {}).forEach(
      ([key, value]) => {
        const fieldConfig = value;
        const fieldSchema = schemaDefinition?.allOf?.[1]?.properties?.[key];

        if (fieldSchema.type === 'string') {
          fieldOptions[name].push({ value: key, label: fieldConfig.label });
          fieldKeys[name].push(key);
        }
      },
    );
  });

  return { fieldOptions, fieldKeys };
};

export const validFieldsCacheKey = `${pluginInfo.id}-form-valid-fields`;
