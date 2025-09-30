import slug from 'slug';
import pluginInfo from '../../plugin-manifest.json';

export const handleFormFieldListenersAdd = (
  { contentType, form, name, isEditing },
  getPluginSettings,
) => {
  if (name && contentType?.id === pluginInfo.id && contentType?.nonCtdSchema) {
    const { index, type } =
      name.match(/config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index != null && type === 'content_type') {
      return {
        onChange: () => {
          form.setFieldValue(`config[${index}].source`, '');
          form.setFieldValue(`config[${index}].target`, '');
        },
      };
    }
    return;
  }

  if (isEditing) return;

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || '{}');

  const slugSettings = parsedSettings?.config?.filter(
    ({ content_type }) => content_type === contentType?.name,
  );

  if (!slugSettings?.length) return;

  const sourceSettings = slugSettings
    .filter(({ source }) => source === name)
    .map(({ target }) => target);

  return {
    onBlur: ({ value }) => {
      sourceSettings.forEach(async (fieldName) => {
        const targetType =
          contentType.schemaDefinition.allOf[1].properties?.[fieldName]?.type;

        if (form.getValue(fieldName) || targetType !== 'string') return;

        const newValue = slug(value);
        await form.setFieldValue(fieldName, newValue);
        form.setFieldTouched(fieldName);
      });
    },
  };
};
