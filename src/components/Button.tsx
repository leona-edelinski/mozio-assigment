import { FC } from "react";

interface Props {
  name: string | JSX.Element;
  className: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
}

const Button: FC<Props> = ({
  name,
  className,
  onClick,
  type = "button",
}): JSX.Element => {
  return (
    <button type={type} onClick={onClick} className={className}>
      {name}
    </button>
  );
};

export default Button;
