import { getIn } from "formik";
import { useCallback, useMemo } from "react";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import SettingsItem from "./SettingsItem/SettingsItem";

const SettingsField = ({
  formId,
  arrayHelpers,
  disabled,
  contentTypes,
  ctdFieldsDict,
}) => {
  const { t } = useTranslation();

  const settings = useMemo(() => {
    return getIn(arrayHelpers.form.values, arrayHelpers.name) || [];
  }, [arrayHelpers.name, arrayHelpers.form]);

  const onAddSetting = useCallback(() => {
    arrayHelpers.push({
      content_type: "",
      source: "",
      target: "",
    });
  }, [arrayHelpers]);

  const onRemoveSetting = useCallback(
    (idx) => {
      arrayHelpers.remove(idx);
    },
    [arrayHelpers]
  );

  return (
    <>
      <div className="content">
        {settings.length > 0
          ? settings.map((_, idx) => (
              <SettingsItem
                key={idx}
                onDelete={onRemoveSetting}
                disabled={disabled}
                idx={idx}
                contentTypes={contentTypes}
                ctdFieldsDict={ctdFieldsDict}
              />
            ))
          : t("Empty")}
      </div>
      <div className="buttons">
        <Button
          color="blueBordered"
          type="button"
          onClick={onAddSetting}
          disabled={disabled}
        >
          {t("Add")}
        </Button>
        <Button color="blue" type="submit" form={formId} disabled={disabled}>
          {t("SaveChanges")}
        </Button>
      </div>
    </>
  );
};

export default SettingsField;
