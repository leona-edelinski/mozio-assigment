import Button from "./Button";
import ErrorLabel from "./ErrorLabel";
import Label from "./Label";

type Props = {
  onClickAdd: () => void;
  onClickRemove: () => void;
  value: any;
  errorMessage?: string;
  label?: string;
};

const Counter = ({
  onClickAdd,
  onClickRemove,
  value,
  errorMessage = "",
  label = "",
}: Props): JSX.Element => {
  return (
    <>
      <Label labelName={label} />
      <div
        className={`flex justify-center border h-10 rounded p-2 w-28 ${
          errorMessage && "border-red-600"
        }`}
      >
        <Button
          name="-"
          onClick={onClickRemove}
          className="text-white rounded bg-gray-300 w-6 h-6 hover:bg-sky-700"
        />

        <div className="text-gray-700 mx-3">{value}</div>
        <Button
          name="+"
          onClick={onClickAdd}
          className="text-white rounded bg-gray-300 w-6 h-6 hover:bg-sky-700"
        />
      </div>
      <ErrorLabel errorMessage={errorMessage} />
    </>
  );
};

export default Counter;
