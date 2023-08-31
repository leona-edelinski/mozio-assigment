import { FC } from "react";
import Label from "./Label";
import ErrorLabel from "./ErrorLabel";

interface Props {
  label: string;
  name: string;
  value: string;
  type?: string;
  min?: string;
  onChange: (e: any) => void;
  index?: number;
  errorMessage?: string;
}

const Input: FC<Props> = ({
  label,
  name,
  value,
  type = "text",
  min,
  onChange,
  errorMessage = "",
}) => {
  return (
    <div>
      <Label labelName={label} />

      <input
        className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          errorMessage && "border-red-600"
        }`}
        name={name}
        type={type}
        value={value}
        min={min}
        onChange={onChange}
      />

      <ErrorLabel errorMessage={errorMessage} />
    </div>
  );
};

export default Input;
