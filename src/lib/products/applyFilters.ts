// src/lib/products/applyFilters.ts
import type { FrontendProduct, FilterState } from "./types";

const extractMaxDpi = (value: string): number | null => {
  const cleaned = value.replace(/[.,]/g, "");
  const matches = cleaned.match(/\d+/g);
  if (!matches) return null;
  const nums = matches.map((n) => parseInt(n, 10));
  return Math.max(...nums);
};

export const applyFiltersAndSort = (
  products: FrontendProduct[],
  filters: FilterState,
  sortBy: string
): FrontendProduct[] => {
  let result = [...products];

  const {
    category,
    brand,
    cpu,
    price,
    usage,
    series,
    screenSize,
    ram,
    ssd,
    vga,
    dpi,
    resolution,
    panelType,
    keyboardType,
    layout,
    psu,
  } = filters;

  // Category
  if (category) {
    result = result.filter((p) => {
      if (p.categoryId !== null && String(p.categoryId) === category) {
        if (category === "2" && p.name.toLowerCase().includes("laptop")) {
          return false;
        }
        return true;
      }

      let keyword = "";
      if (category === "1") keyword = "laptop";
      else if (category === "2") keyword = "pc";
      else if (category === "3") keyword = "màn hình";
      else if (category === "4") keyword = "bàn phím";
      else if (category === "5") keyword = "chuột";

      const name = p.name.toLowerCase();
      const desc = p.description.toLowerCase();
      return keyword && (name.includes(keyword) || desc.includes(keyword));
    });
  }

  // Brand
  if (brand) {
    const b = brand.toLowerCase();
    result = result.filter((p) => {
      const name = p.name.toLowerCase();
      const desc = p.description.toLowerCase();
      return name.includes(b) || desc.includes(b);
    });
  }

  // CPU
  if (cpu) {
    const c = cpu.toLowerCase();
    result = result.filter(
      (p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("cpu") &&
            s.SpecValue.toLowerCase().includes(c)
        ) || p.description.toLowerCase().includes(c)
    );
  }

  // Series
  if (series) {
    const s = series.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(s));
  }

  // Usage
  if (usage) {
    const nameDescFilter = (p: FrontendProduct, keyword: string) => {
      const kw = keyword.toLowerCase();
      const name = p.name.toLowerCase();
      const desc = p.description.toLowerCase();
      return name.includes(kw) || desc.includes(kw);
    };

    const usageList = Array.isArray(usage)
      ? usage.map((u) => u.toLowerCase())
      : [usage.toLowerCase()];

    result = result.filter((p) => usageList.some((u) => nameDescFilter(p, u)));
  }

  // Screen size
  if (screenSize) {
    const size = screenSize.toLowerCase();
    result = result.filter(
      (p) =>
        p.specs?.some((s) => {
          const name = s.SpecName.toLowerCase();
          const value = s.SpecValue.toLowerCase();
          return (
            (name.includes("màn hình") ||
              name.includes("screen") ||
              name.includes("kích thước")) &&
            value.includes(size)
          );
        }) || p.description.toLowerCase().includes(size)
    );
  }

  // RAM
  if (ram) {
    const r = ram.toLowerCase();
    result = result.filter(
      (p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("ram") &&
            s.SpecValue.toLowerCase().includes(r)
        ) || p.description.toLowerCase().includes(r)
    );
  }

  // SSD
  if (ssd) {
    const ssdVal = ssd.toLowerCase();
    result = result.filter(
      (p) =>
        p.specs?.some((s) => {
          const name = s.SpecName.toLowerCase();
          const value = s.SpecValue.toLowerCase();
          return (
            (name.includes("ssd") || name.includes("ổ cứng")) &&
            value.includes(ssdVal)
          );
        }) || p.description.toLowerCase().includes(ssdVal)
    );
  }

  // VGA
  if (vga) {
    const v = vga.toLowerCase();
    result = result.filter(
      (p) =>
        p.specs?.some(
          (s) =>
            s.SpecName.toLowerCase().includes("vga") &&
            s.SpecValue.toLowerCase().includes(v)
        ) || p.description.toLowerCase().includes(v)
    );
  }

  // DPI
  if (dpi) {
    const dpiLimit = parseInt(dpi, 10);
    result = result.filter((p) =>
      p.specs?.some((s) => {
        const specName = s.SpecName.toLowerCase();
        if (!(specName.includes("độ phân giải") || specName.includes("dpi"))) {
          return false;
        }
        const maxDpi = extractMaxDpi(s.SpecValue);
        if (maxDpi == null) return false;
        return maxDpi <= dpiLimit;
      })
    );
  }

  // Resolution
  if (resolution) {
    const res = resolution.toLowerCase();
    result = result.filter((p) =>
      p.specs?.some(
        (s) =>
          s.SpecName.toLowerCase().includes("độ phân giải") &&
          s.SpecValue.toLowerCase().includes(res)
      )
    );
  }

  // Panel type
  if (panelType) {
    const panel = panelType.toLowerCase();
    result = result.filter((p) =>
      p.specs?.some(
        (s) =>
          s.SpecName.toLowerCase().includes("tấm nền") &&
          s.SpecValue.toLowerCase().includes(panel)
      )
    );
  }

  // Keyboard type
  if (keyboardType) {
    const k = keyboardType.toLowerCase();
    result = result.filter((p) =>
      p.specs?.some(
        (s) =>
          s.SpecName.toLowerCase().includes("loại bàn phím") &&
          s.SpecValue.toLowerCase().includes(k)
      )
    );
  }

  // Layout
  if (layout) {
    const l = layout.toLowerCase();
    result = result.filter((p) =>
      p.specs?.some(
        (s) =>
          s.SpecName.toLowerCase().includes("layout") &&
          s.SpecValue.toLowerCase().includes(l)
      )
    );
  }

  // PSU
  if (psu) {
    const pVal = psu.toLowerCase();
    result = result.filter((p) =>
      p.specs?.some(
        (s) =>
          s.SpecName.toLowerCase().includes("psu") &&
          s.SpecValue.toLowerCase().includes(pVal)
      )
    );
  }

  // Price
  if (price) {
    const [min, max] = price.split("-").map(Number);
    result = result.filter((p) => {
      const realPrice = p.discountPrice || p.price;
      return realPrice >= min && (max ? realPrice <= max : true);
    });
  }

  // Sort
  if (sortBy === "price-asc") {
    result.sort(
      (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
    );
  } else if (sortBy === "price-desc") {
    result.sort(
      (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
    );
  }

  return result;
};
