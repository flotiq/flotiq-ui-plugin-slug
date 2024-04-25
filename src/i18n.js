import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  supportedLngs: ["en", "pl"],
  resources: {
    en: {
      translation: {
        Add: "Add",
        ContentType: "Content type",
        Empty: 'There is no settings for this plugin',
        FieldNotFound: "This field is no longer available",
        FieldRequired: "This value should not be blank",
        Key: "Key",
        KeyHelpText: "The field on which the slug is based",
        Label: "Label",
        LabelHelpText: "The field into which the slug should be entered",
        NoContentTypes: "There is no content types",
        NoFields:
          "Make sure the selected content type contains fields that can be used in the plugin. Allowed types: text, textarea, email, radio, select, date time",
        SaveChanges: "Save changes",
        SavingError:
          "Something occured while updating plugin settings. Check console for more informations",
        Settings: "Settings",
        Unique: "The label cannot be the same field as the key",
      },
    },
    pl: {
      translation: {
        Add: "Dodaj",
        ContentType: "Definicja typu",
        Empty:'Nie dodano żadnych ustawień do tego pluginu',
        FieldNotFound: "To pole nie jest już dostępne",
        FieldRequired: "Ta wartość nie powinna być pusta",
        Key: "Klucz",
        KeyHelpText: "Pole, na którym bazuje slug",
        Label: "Opis",
        LabelHelpText: "Pole, do którego slug zostanie wpisany",
        NoContentTypes: "Nie znaleziono definicji typu",
        NoFields:
          "Upewnij się, że wybrany typ definicji zawiera pola, które mogą być wykorzystane we wtyczce. Dozwolone typy: tekst, długie pole tekstowe, email, pole wyboru, lista rozwijana, data i czas.",
        SaveChanges: "Zapisz zamiany",
        SavingError:
          "Coś poszło nie tak podczas zapisywania ustawień wtyczki. Sprawdź konsolę, aby uzyskać więcej informacji",
        Settings: "Ustawienia",
        Unique: "Opis nie może być tym samym polem, co klucz",
      },
    },
  },
});

export default i18n;
