import slug from 'slug';
import pluginInfo from '../../plugin-manifest.json';

export const handleFormFieldListenrsAdd = (
  { contentType, formik, name, isEditing },
  getPluginSettings,
) => {
  if (name && contentType?.id === pluginInfo.id && contentType?.nonCtdSchema) {
    const { index, type } =
      name.match(/config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index != null && type === 'content_type') {
      return {
        onChange: () => {
          formik.setFieldValue(`config[${index}].source`, '');
          formik.setFieldValue(`config[${index}].target`, '');
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
    onBlur: ({ value, fieldApi, formApi }) => {
      console.log(fieldApi, formApi);
      sourceSettings.forEach(async (fieldName) => {
        const targetType =
          contentType.schemaDefinition.allOf[1].properties?.[fieldName]?.type;

        if (formik.values[fieldName] || targetType !== 'string') return;

        const newValue = slug(value);
        await formik.setFieldValue(fieldName, newValue);
        formik.setFieldTouched(fieldName);
      });
    },
  };
};
