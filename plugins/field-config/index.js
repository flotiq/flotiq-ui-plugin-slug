import slug from 'slug';
import pluginInfo from '../../plugin-manifest.json';
import {
  addElementToCache,
  getCachedElement,
} from '../../common/plugin-element-cache';
import { validFieldsCacheKey } from '../../common/valid-fields';

const regenerate = async (formik, fieldName, slugFieldName) => {
  const source = formik.values[slugFieldName];
  if (source) {
    await formik.setFieldValue(fieldName, slug(source));
    formik.setFieldTouched(fieldName);
  }
};

export const handleFormFieldConfig = (
  { contentType, formik, config, name },
  getPluginSettings,
) => {
  if (contentType?.id === pluginInfo.id && contentType?.nonCtdSchema) {
    const { index, type } =
      name.match(/config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index == null || !type) return;

    if (type !== 'content_type') {
      const { fieldOptions } = getCachedElement(validFieldsCacheKey) || {};
      const ctd = formik.values.config[index].content_type;
      config.options = fieldOptions[ctd] || [];
    }
    return;
  }

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || '{}');

  const slugSettings = parsedSettings?.config?.filter(
    ({ content_type }) => content_type === contentType?.name,
  );

  if (!slugSettings?.length) return;

  const targetSettings = slugSettings.find(({ target }) => target === name);

  if (targetSettings) {
    const cacheKey = `${pluginInfo.id}-${contentType.name}-${name}`;
    let button = getCachedElement(cacheKey)?.element;

    const cacheData = {
      formik,
      fieldName: name,
      slugFieldName: targetSettings.source,
    };

    if (!button) {
      button = document.createElement('button');
      button.setAttribute('class', 'plugin-slug refresh-icon');
      button.addEventListener('click', () => {
        regenerate(
          cacheData.formik,
          cacheData.fieldName,
          cacheData.slugFieldName,
        );
      });
      button.type = 'button';

      addElementToCache(button, cacheData, cacheKey);
    }

    config.additionalElements = [button];
  }
};
