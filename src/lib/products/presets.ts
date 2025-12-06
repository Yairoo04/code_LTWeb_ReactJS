// src/lib/products/presets.ts
import { megaMenuData } from "@/lib/data";
import type { FilterState } from "./types";

export const buildPresetMap = () => {
  const map = new Map<string, Partial<FilterState>>();

  megaMenuData.forEach((item) => {
    item.subItems.forEach((sub) => {
      sub.filters.forEach((f) => {
        if (f.filters) {
          map.set(f.href, f.filters);
        }
      });
    });
  });

  return map;
};

export const presetMap = buildPresetMap();
