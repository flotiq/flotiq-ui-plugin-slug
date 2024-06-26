import { useCallback, useState } from "react";
import { Field, getIn, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import Button from "../../Button/Button";
import { DeleteIcon } from "../../../images/shapes";
import Dropdown from "../../Dropdown/Dropdown";

const SettingsItem = ({
  onDelete,
  disabled,
  idx,
  contentTypes,
  ctdFieldsDict,
}) => {
  const formik = useFormikContext();
  const { t } = useTranslation();

  const [selectedType, setSelectedType] = useState(
    getIn(formik.values, `settings[${idx}].content_type`) || ""
  );

  const onContentTypeChange = useCallback(
    (e) => {
      const ctdName = e.target.value;
      formik.handleChange(e);

      setSelectedType((prevCtd) => {
        if (prevCtd !== ctdName) {
          formik.setFieldValue(`settings[${idx}].source`, "");
          formik.setFieldValue(`settings[${idx}].target`, "");
        }
        return ctdName;
      });
    },
    [formik, idx]
  );

  return (
    <div className="settings-field">
      <div className="delete">
        <Button
          color="borderless"
          onClick={() => onDelete(idx)}
          disabled={disabled}
          type="button"
        >
          <DeleteIcon />
        </Button>
      </div>
      <div className="inputs">
        <Dropdown
          name={`settings[${idx}].content_type`}
          options={contentTypes
            .filter(({ internal }) => !internal)
            .map(({ name, label }) => ({ value: name, label }))}
          value={formik.values.settings[idx].content_type}
          onChange={onContentTypeChange}
          onBlur={formik.handleBlur}
          label={t("ContentType")}
          disabled={disabled}
          emptyText={t("NoContentTypes")}
          search
        />

        <Field name={`settings[${idx}].source`}>
          {({ field, meta }) => {
            return (
              <Dropdown
                name={field.name}
                options={(ctdFieldsDict[selectedType] || []).map((key) => ({
                  value: key,
                  label: key,
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label={t("Source")}
                disabled={disabled}
                emptyText={t("NoFields")}
                helpText={t("SourceHelpText")}
                error={meta.touched && meta.error}
              />
            );
          }}
        </Field>

        <Field name={`settings[${idx}].target`}>
          {({ field, meta }) => {
            return (
              <Dropdown
                name={field.name}
                options={(ctdFieldsDict[selectedType] || []).map((key) => ({
                  value: key,
                  label: key,
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label={t("Target")}
                disabled={disabled}
                emptyText={t("NoFields")}
                helpText={t("TargetHelpText")}
                error={meta.touched && meta.error}
                isTop
              />
            );
          }}
        </Field>
      </div>
    </div>
  );
};

export default SettingsItem;
