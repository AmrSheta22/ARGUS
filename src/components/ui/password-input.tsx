import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type ChangeEvent, type ComponentProps, type ReactNode, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "#/components/ui/input-group.tsx";

import type { Input } from "./input";

export function PasswordInput({
  onChange,
  value,
  defaultValue,
  ...props
}: Omit<ComponentProps<typeof Input>, "type">) {
  const [showPassword, setShowPassword] = useState(false);

  const Icon = showPassword ? EyeOffIcon : EyeIcon;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        value={value}
        defaultValue={defaultValue}
        type={showPassword ? "text" : "password"}
        onChange={handleChange}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" onClick={() => setShowPassword((p) => !p)}>
          <Icon className="size-4.5" />
          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
