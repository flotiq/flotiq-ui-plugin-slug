import slug from "slug";
import { addElementToCache, getCachedElement } from "../common/plugin-helpers";

const regenerate = (formik, fieldName, slugFieldName) => {
  const keyValue = formik.values[slugFieldName];
  if (keyValue) formik.setFieldValue(fieldName, slug(keyValue));
};

const handleCoForm = (
  { contentType, name, value, config, formik, isEditing },
  slugSettings,
  pluginInfo
) => {
  const settingsForKeyField = slugSettings
    .filter(({ key }) => key === name)
    .map(({ label }) => label);

  const settingsForLabelField = slugSettings.find(
    ({ label }) => label === name
  );

  if (!isEditing && settingsForKeyField.length) {
    config.onBlur = (e) => {
      settingsForKeyField.forEach((fieldName) => {
        const labelType =
          contentType.schemaDefinition.allOf[1].properties?.[fieldName]?.type;

        if (formik.values[fieldName] || labelType !== "string") return;

        const newValue = slug(value);
        formik.setFieldValue(fieldName, newValue);
      });

      formik.handleBlur(e);
    };
  }

  if (settingsForLabelField) {
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
        slugFieldName: settingsForLabelField.key,
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
  { contentType, userPlugins, config, ...data },
  pluginInfo
) {
  if (!config) return;

  const slugSettings = JSON.parse(
    userPlugins?.find(({ id }) => id === pluginInfo.id)?.settings || "[]"
  )?.filter(({ content_type }) => content_type === contentType.name);

  if (slugSettings?.length > 0)
    return handleCoForm(
      { contentType, config, ...data },
      slugSettings,
      pluginInfo
    );

  return null;
}
