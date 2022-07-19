import { ChangeEventHandler, forwardRef, InputHTMLAttributes } from "react";

type CustomProps = {
  value?: number | string;
  label?: string;
  onChange?: (value: string) => void;
};

type Props = CustomProps & Omit<InputHTMLAttributes<HTMLInputElement>, keyof CustomProps>;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ value, label, onChange, ...rest }, ref) => {
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      onChange?.(e.currentTarget.value);
    };

    return (
      <label>
        {label}
        <input value={value} onChange={handleChange} ref={ref} {...rest} />
      </label>
    );
  },
);

Input.displayName = "Input";
