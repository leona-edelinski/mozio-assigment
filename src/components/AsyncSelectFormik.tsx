import { useField } from "formik";
import AsyncSelect from "react-select/async";
import ErrorLabel from "./ErrorLabel";
import Label from "./Label";

type Props = {
  formikFieldName: string;
  placeholder?: string;
  loadFunction: (e: any) => void;
  onBlur: (e: any) => void;
  onClear: () => void;
  value: any;
  errorMessage?: string;
  label?: string;
};

const AsyncFormikSelect = ({
  formikFieldName,
  placeholder = "",
  loadFunction,
  onBlur,
  onClear,
  value,
  errorMessage = "",
  label = "",
}: Props): JSX.Element => {
  const [field, m, helpers] = useField(formikFieldName);
  const { setValue } = helpers;
  console.log(m);

  const onChange = (option: any, action: any) => {
    setValue(option);

    if (action.action === "clear") {
      onClear();
    }
  };

  return (
    <div className="w-full">
      {label && <Label labelName={label} />}
      <AsyncSelect
        loadOptions={loadFunction}
        placeholder={placeholder}
        onChange={onChange}
        name={field.name}
        getOptionValue={(option) => option.name}
        getOptionLabel={(option) => option.name}
        onBlur={onBlur}
        className={"w-full"}
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: () => null,
        }}
        isClearable
        value={value}
        styles={{
          control: (baseStyle) => ({
            ...baseStyle,
            borderColor: errorMessage && "red",
          }),
        }}
      />
      <ErrorLabel errorMessage={errorMessage} />
    </div>
  );
};

export default AsyncFormikSelect;
