import { useId, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import { cx } from "./cx";
import { controlClasses, describedBy, Field } from "./field";

interface FieldTextProps {
  label: string;
  helper?: string | undefined;
  error?: string | undefined;
}

type TextInputProps = FieldTextProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    type?: "text" | "email" | "tel" | "number" | "password" | "search" | "url";
  };

export function TextInput({ label, helper, error, id, className, ...rest }: TextInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field id={inputId} label={label} helper={helper} error={error}>
      <input
        id={inputId}
        className={cx(controlClasses, className)}
        {...describedBy(inputId, helper, error)}
        {...rest}
      />
    </Field>
  );
}

type DateInputProps = FieldTextProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/** Native date picker: best on mobile and for assistive tech. Display format follows the browser. */
export function DateInput({ label, helper, error, id, className, ...rest }: DateInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field id={inputId} label={label} helper={helper} error={error}>
      <input
        id={inputId}
        type="date"
        className={cx(controlClasses, className)}
        {...describedBy(inputId, helper, error)}
        {...rest}
      />
    </Field>
  );
}

type SelectProps = FieldTextProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: { value: string; label: string }[];
    placeholder?: string | undefined;
  };

/** Native <select> styled like the other fields. */
export function Select({
  label,
  helper,
  error,
  id,
  className,
  options,
  placeholder,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <Field id={selectId} label={label} helper={helper} error={error}>
      <div className="relative">
        <select
          id={selectId}
          className={cx(controlClasses, "appearance-none pr-12", className)}
          {...describedBy(selectId, helper, error)}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <CaretDownIcon
          size={24}
          aria-hidden
          className="pointer-events-none absolute top-3 right-4 text-fg"
        />
      </div>
    </Field>
  );
}
