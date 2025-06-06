import slug from 'slug';
import {
  addElementToCache,
  getCachedElement,
} from '../../../common/plugin-element-cache';
import pluginInfo from '../../../plugin-manifest.json';

const regenerate = async (formik, fieldName, slugFieldName) => {
  const source = formik.values[slugFieldName];
  if (source) {
    await formik.setFieldValue(fieldName, slug(source));
    formik.setFieldTouched(fieldName);
  }
};

export const handleCoFormConfig = (
  { contentType, name, config, formik },
  slugSettings,
) => {
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
