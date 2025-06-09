import i18n from '../../i18n';
import pluginInfo from '../../plugin-manifest.json';

export const getSchema = (contentTypes) => ({
  id: pluginInfo.id,
  name: 'slug-plugin',
  label: 'Slug Plugin',
  internal: false,
  schemaDefinition: {
    type: 'object',
    allOf: [
      {
        $ref: '#/components/schemas/AbstractContentTypeSchemaDefinition',
      },
      {
        type: 'object',
        properties: {
          config: {
            type: 'array',
            items: {
              type: 'object',
              required: ['content_type', 'source', 'target'],
              properties: {
                content_type: {
                  type: 'string',
                  minLength: 1,
                },
                source: {
                  type: 'string',
                  minLength: 1,
                },
                target: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
            minItems: 1,
          },
        },
      },
    ],
    required: [],
    additionalProperties: false,
  },
  metaDefinition: {
    order: ['config'],
    propertiesConfig: {
      config: {
        items: {
          order: ['content_type', 'source', 'target'],
          propertiesConfig: {
            content_type: {
              label: i18n.t('ContentType'),
              unique: false,
              helpText: '',
              inputType: 'select',
              useOptionsWithLabels: true,
              optionsWithLabels: contentTypes,
            },
            source: {
              label: i18n.t('Source'),
              unique: false,
              helpText: i18n.t('SourceHelpText'),
              inputType: 'select',
              useOptionsWithLabels: true,
              optionsWithLabels: [],
            },
            target: {
              label: i18n.t('Target'),
              unique: false,
              helpText: i18n.t('TargetHelpText'),
              inputType: 'select',
              useOptionsWithLabels: true,
              optionsWithLabels: [],
            },
          },
        },
        label: i18n.t('Config'),
        unique: false,
        helpText: '',
        inputType: 'object',
      },
    },
  },
});

const addToErrors = (errors, index, field, error) => {
  if (!errors.config) errors.config = [];
  if (!errors.config[index]) errors.config[index] = {};
  errors.config[index][field] = error;
};

export const getValidator = (validFieldKeys) => {
  const onValidate = (values) => {
    const errors = {};

    values.config?.forEach(({ content_type, source, target }, index) => {
      if (!content_type) {
        addToErrors(errors, index, 'content_type', i18n.t('FieldRequired'));
      }

      const fieldKeys = validFieldKeys[content_type] || [];

      if (!source) {
        addToErrors(errors, index, 'source', i18n.t('FieldRequired'));
      } else if (!fieldKeys.includes(source)) {
        addToErrors(errors, index, 'source', i18n.t('FieldNotFound'));
      }

      if (!target) {
        addToErrors(errors, index, 'target', i18n.t('FieldRequired'));
      } else if (!fieldKeys.includes(target)) {
        addToErrors(errors, index, 'target', i18n.t('FieldNotFound'));
      } else if (source === target) {
        addToErrors(errors, index, 'target', i18n.t('Unique'));
      }
    });

    return errors;
  };

  return onValidate;
};
