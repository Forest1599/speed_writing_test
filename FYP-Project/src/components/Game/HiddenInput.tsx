import React, { forwardRef } from "react";

type HiddenInputProps = {
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>((props, ref) => {
  const { onKeyDown } = props;

  return (
    <input
      ref={ref}
      type="text"
      onKeyDown={onKeyDown} // Directly use the onKeyDown prop
      className="absolute opacity-0"
      autoFocus
    />
  );
});

export default HiddenInput