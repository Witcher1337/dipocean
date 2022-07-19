import { cloneElement, ReactElement } from "react";
import { Controller, useFormContext, UseControllerProps } from "react-hook-form";

type Props<T> = Pick<UseControllerProps, "defaultValue" | "shouldUnregister"> & {
  children: ReactElement;
  name: T;
};

export function Field<T extends string>({
  shouldUnregister,
  name,
  defaultValue,
  children,
}: Props<T>) {
  const form = useFormContext();

  return (
    <Controller
      control={form.control}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      name={name}
      render={({ field, fieldState }) =>
        cloneElement(children, {
          value: field.value,
          onBlur: field.onBlur,
          onChange: field.onChange,
          error: fieldState.error?.message,
          ref: field.ref,
        })
      }
    />
  );
}
