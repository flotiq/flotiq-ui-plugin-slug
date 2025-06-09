import {
  addObjectToCache,
  getCachedElement,
  removeRoot,
} from '../../common/plugin-element-cache';
import { getValidFields, validFieldsCacheKey } from '../../common/valid-fields';
import pluginInfo from '../../plugin-manifest.json';
import { getSchema, getValidator } from './form-schema';

export const handleManagePlugin = ({ contentTypes, modalInstance }) => {
  const formSchemaCacheKey = `${pluginInfo.id}-form-schema`;
  let formSchema = getCachedElement(formSchemaCacheKey);

  if (!formSchema) {
    const validFields = getValidFields(contentTypes);
    addObjectToCache(validFieldsCacheKey, validFields);

    const ctds = contentTypes
      ?.filter(({ internal }) => !internal)
      .map(({ name, label }) => ({ value: name, label }));

    formSchema = {
      options: {
        disabledBuildInValidation: true,
        onValidate: getValidator(validFields.fieldKeys),
      },
      schema: getSchema(ctds),
    };

    addObjectToCache(formSchema);
  }

  modalInstance.promise.then(() => removeRoot(formSchemaCacheKey));

  return formSchema;
};
