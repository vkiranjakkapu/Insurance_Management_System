import type { ActionButtonProps, WithParamActionButtonProps } from "../ActionButton";

export function isParamButton(
    btn: ActionButtonProps | WithParamActionButtonProps,
): btn is WithParamActionButtonProps {
    // If the function expects 1 or more arguments, it's a param button
    return typeof btn.onClick === "function" && btn.onClick.length > 0;
}
