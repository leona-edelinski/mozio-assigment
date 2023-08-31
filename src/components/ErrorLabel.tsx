type Props = {
  errorMessage: string;
};

const ErrorLabel = ({ errorMessage }: Props): JSX.Element => {
  return <span className="text-red-600 text-xs">{errorMessage}</span>;
};

export default ErrorLabel;
