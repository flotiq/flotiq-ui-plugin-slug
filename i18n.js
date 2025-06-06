import i18n from 'i18next';

i18n.init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'pl'],
  resources: {
    en: {
      translation: {
        ContentType: 'Content type',
        FieldNotFound: 'This field is no longer available',
        FieldRequired: 'This value should not be blank',
        Source: 'Slug source field',
        SourceHelpText: 'The field on which the slug is based',
        Target: 'Target field',
        TargetHelpText: 'The field into which the slug should be entered',
        Unique: 'The target cannot be the same field as the slug source',
      },
    },
    pl: {
      translation: {
        ContentType: 'Definicja typu',
        FieldNotFound: 'To pole nie jest już dostępne',
        FieldRequired: 'Ta wartość nie powinna być pusta',
        Source: 'Pole źródłowe sluga',
        SourceHelpText: 'Pole, na bazie którego tworzony jest slug',
        Target: 'Pole docelowe',
        TargetHelpText: 'Pole, do którego slug zostanie wpisany',
        Unique: 'Pole docelowe nie może być tym samym polem, co źródło sluga',
      },
    },
  },
});

export default i18n;
