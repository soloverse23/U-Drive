"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { cx } from "./cx";
import { controlClasses, describedBy, Field } from "./field";

type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  helper?: string | undefined;
  error?: string | undefined;
};

/**
 * File picker styled like the other fields. The native input stays in the DOM (visually
 * hidden) for keyboard and screen readers; our own text replaces the browser's untranslated
 * "No file chosen".
 */
export function FileInput({
  label,
  helper,
  error,
  id,
  onChange,
  disabled,
  ...rest
}: FileInputProps) {
  const t = useTranslations("ui.file");
  const autoId = useId();
  const inputId = id ?? autoId;
  const [fileNames, setFileNames] = useState<string[]>([]);
  const preview = rest["data-preview" as keyof typeof rest] as string | undefined;

  return (
    <Field id={inputId} label={label} helper={helper} error={error}>
      <div className="relative">
        <input
          id={inputId}
          type="file"
          disabled={disabled}
          className="peer sr-only"
          {...describedBy(inputId, helper, error)}
          onChange={(event) => {
            setFileNames([...(event.target.files ?? [])].map((file) => file.name));
            onChange?.(event);
          }}
          {...rest}
        />
        {/* A second <label> for the same input: clicking anywhere opens the picker. */}
        <label
          htmlFor={inputId}
          data-preview={preview}
          className={cx(
            controlClasses,
            "flex cursor-pointer items-center gap-4 pl-2",
            "peer-focus-visible:border-fg peer-aria-invalid:border-error",
            "peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled",
          )}
        >
          <span className="rounded-control bg-bg px-3 py-1 text-body-sm font-medium">
            {t("choose")}
          </span>
          <span className={cx("truncate", fileNames.length === 0 && "text-fg-muted")}>
            {fileNames.length > 0 ? fileNames.join(", ") : t("none")}
          </span>
        </label>
      </div>
    </Field>
  );
}
