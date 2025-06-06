import { Fragment, useCallback, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CaretDownIcon,
  CloseIcon,
  CheckmarkIcon,
  LoaderIcon,
} from "../../images/shapes";
import Button from "../Button/Button";

const Dropdown = ({
  name,
  options,
  isLoading,
  value,
  onChange,
  onBlur,
  label,
  disabled,
  emptyText,
  search,
  isTop,
  helpText,
  error,
}) => {
  const [query, setQuery] = useState("");

  const handleChange = useCallback(
    (value) => {
      onChange({
        target: { value, name },
      });
      onBlur({ target: { name } });
    },
    [onChange, name, onBlur]
  );

  const filteredOptions = useMemo(
    () =>
      (options || []).filter(
        (option) =>
          query === "" ||
          (option.label ?? option.value)
            ?.toLowerCase()
            .includes(query.toLowerCase())
      ),
    [query, options]
  );

  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      handleChange("");
    },
    [handleChange]
  );

  const renderOptions = useMemo(() => {
    if (isLoading)
      return (
        <div className="loader">
          <LoaderIcon />
        </div>
      );

    if (filteredOptions.length === 0) {
      return <div className="empty-options">{emptyText}</div>;
    }
    return filteredOptions.map((option) => (
      <Listbox.Option
        key={option.value}
        className={({ active }) => (active ? "active" : "")}
        value={option.value}
      >
        {({ selected }) => (
          <div>
            <span className="label">{option.label || option.value}</span>
            <span className="icon">{selected && <CheckmarkIcon />}</span>
          </div>
        )}
      </Listbox.Option>
    ));
  }, [isLoading, filteredOptions, emptyText]);

  return (
    <Listbox value={value} onChange={handleChange} disabled={disabled}>
      {({ open }) => (
        <div className={`dropdown-container ${isTop ? "top" : ""}`}>
          {label && <label>{label}</label>}
          <div>
            <Listbox.Button
              as="div"
              role="button"
              className={`dropdown-button ${error ? "error" : ""}`}
              disabled={disabled}
            >
              {value}
              <CaretDownIcon className={open ? "open" : ""} />
            </Listbox.Button>
            {value && (
              <span className="clear">
                <Button
                  className="borderless"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClear(e);
                  }}
                  type="button"
                >
                  <CloseIcon />
                </Button>
              </span>
            )}
          </div>
          <Transition as={Fragment} afterLeave={() => setQuery("")}>
            <Listbox.Options className="scrollbar-sm">
              {!isLoading && search && (
                <div>
                  <input
                    type="search"
                    name="query"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </div>
              )}
              {renderOptions}
            </Listbox.Options>
          </Transition>
          {helpText && <div className="help-text">{helpText}</div>}
          {error && <div className="error-text">{error}</div>}
        </div>
      )}
    </Listbox>
  );
};

export default Dropdown;
