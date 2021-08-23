import { ReactNode } from "react";
import { GetUserSettingsDto } from "@evergarden/shared";

export const SIZES = ["S", "M", "L", "XL"];

interface Font {
  family: string;
  name: string;
}

export const FONTS: { value: Font; label: ReactNode }[] = [
  {
    label: "Roboto",
    value: {
      family: "Roboto",
      name: "Roboto",
    },
  },
  {
    label: "Noto",
    value: {
      family: '"Noto Serif", serif',
      name: "Noto+Serif",
    },
  },
  {
    label: "Quicksand",
    value: {
      family: '"Quicksand", serif',
      name: "Quicksand",
    },
  },
  {
    label: "Asap",
    value: {
      family: '"Asap", serif',
      name: "Asap",
    },
  },
  {
    label: "Farsan",
    value: {
      family: '"Farsan", serif',
      name: "Farsan",
    },
  },
  {
    label: "Open Sans",
    value: {
      family: '"Open Sans", serif',
      name: "Open+Sans",
    },
  },
  {
    label: "Cabin",
    value: {
      family: '"Cabin Condensed", serif',
      name: "Cabin+Condensed",
    },
  },
  {
    label: "Lora",
    value: {
      family: '"Lora", serif',
      name: "Lora",
    },
  },
];

export function getFont(name: string): Font {
  return (FONTS.find((font) => font.value.name === name) || FONTS[0]).value;
}

export const defaultUserSettings: GetUserSettingsDto = {
  readingFont: "Roboto",
  readingFontSize: "M",
  readingLineSpacing: "M",
};
