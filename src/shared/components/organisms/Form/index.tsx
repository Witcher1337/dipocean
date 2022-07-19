import { PropsWithChildren } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";

type Props<T = unknown> = PropsWithChildren<{
  form: UseFormReturn<T, object>;
  onSubmit: (value: T) => void;
  className?: string;
}>;

function Form<T = object>({ form, onSubmit, className, children }: Props<T>) {
  return (
    <FormProvider {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
}
export { Form };
