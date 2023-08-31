import { FC } from "react";

const Label: FC<{ labelName: string }> = ({ labelName }): JSX.Element => (
  <label className="block text-gray-600 text-left text-sm mb-2">
    {labelName}
  </label>
);

export default Label;
