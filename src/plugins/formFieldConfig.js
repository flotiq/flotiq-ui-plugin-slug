import slug from "slug";
import { addElementToCache, getCachedElement } from "../common/plugin-helpers";

const regenerate = async (formik, fieldName, slugFieldName) => {
  const source = formik.values[slugFieldName];
  if (source) {
    await formik.setFieldValue(fieldName, slug(source));
    formik.setFieldTouched(fieldName);
  }
};

const handleCoForm = (
  { contentType, name, value, config, formik, isEditing },
  slugSettings,
  pluginInfo
) => {
  const sourceSettings = slugSettings
    .filter(({ source }) => source === name)
    .map(({ target }) => target);

  const targetSettings = slugSettings.find(({ target }) => target === name);

  if (!isEditing && sourceSettings.length) {
    config.onBlur = (e) => {
      sourceSettings.forEach(async (fieldName) => {
        const targetType =
          contentType.schemaDefinition.allOf[1].properties?.[fieldName]?.type;

        if (formik.values[fieldName] || targetType !== "string") return;

        const newValue = slug(value);
        await formik.setFieldValue(fieldName, newValue);
        formik.setFieldTouched(fieldName);
      });

      formik.handleBlur(e);
    };
  }

  if (targetSettings) {
    const cacheKey = `${pluginInfo.id}-${contentType.name}-${name}`;
    const cacheEntry = getCachedElement(cacheKey);

    let button;

    if (cacheEntry) {
      cacheEntry.root.formik = formik;
      button = cacheEntry.element;
    } else {
      const cacheData = {
        formik,
        fieldName: name,
        slugFieldName: targetSettings.source,
      };

      const button = document.createElement("button");
      button.setAttribute("class", "plugin-slug refresh-icon");
      button.addEventListener("click", () => {
        regenerate(
          cacheData.formik,
          cacheData.fieldName,
          cacheData.slugFieldName
        );
      });
      button.type = "button";

      addElementToCache(button, cacheData, cacheKey);
    }

    config.additionalElements = [button];
  }
};

export function handleFormFieldConfig(
  { contentType, config, ...data },
  pluginInfo,
  getPluginSettings
) {
  if (!config) return;

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || "[]");

  const slugSettings = parsedSettings?.filter(
    ({ content_type }) => content_type === contentType.name
  );

  if (slugSettings?.length > 0)
    return handleCoForm(
      { contentType, config, ...data },
      slugSettings,
      pluginInfo
    );

  return null;
}
