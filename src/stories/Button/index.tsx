// Button.tsx ..
import { buttonStyle, buttonVars } from "./Button.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import Icon from "../Icon";
import { ButtonProps } from "./types";
import { getColorValue } from "../../styles/colorMap";

export type { ButtonProps } from "./types";

const Button = ({
  leftIcon,
  variant = "solid",
  color = "primary",
  size = "md",
  type = "button",
  label,
  full = false,
  disabled = false,
  onClick,
}: ButtonProps) => {
  const colorValue = getColorValue(color);

  const vars = assignInlineVars({
    [buttonVars.backgroundColor]: colorValue,
    [buttonVars.color]: variant === "solid" ? "#ffffff" : colorValue,
    [buttonVars.borderColor]: colorValue,
  });

  return (
    <button
      type={type}
      className={buttonStyle({
        variant,
        size,
        full,
        withIcon: !!leftIcon,
      })}
      style={vars}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <Icon name={leftIcon} size={size !== "xs" ? 20 : 16} />}
      <span>{label}</span>
    </button>
  );
};

export default Button;
