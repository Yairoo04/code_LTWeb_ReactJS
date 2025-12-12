import type { FrontendProduct, FilterState } from "./types";

const extractMaxDpi = (value: string): number | null => {
  const cleaned = (value ?? "").replace(/[.,]/g, "");
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

  const safe = (v: any) => (typeof v === "string" ? v : "").toLowerCase();
  const safeVal = (v: any) => (typeof v === "string" ? v : "");

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
    socket,
    watt,
    capacity,
  } = filters;

  // CATEGORY
  if (category) {
    result = result.filter((p) => {
      const name = safe(p.name);
      const desc = safe(p.description);

      if (p.categoryId !== null && String(p.categoryId) === category) {
        if (category === "2" && name.includes("laptop")) return false;
        return true;
      }

      let keyword = "";
      if (category === "1") keyword = "laptop";
      else if (category === "2") keyword = "pc";
      else if (category === "3") keyword = "màn hình";
      else if (category === "4") keyword = "bàn phím";
      else if (category === "5") keyword = "chuột";

      return keyword && (name.includes(keyword) || desc.includes(keyword));
    });
  }

  // BRAND
  if (brand) {
    const b = safe(brand);
    result = result.filter((p) => {
      const name = safe(p.name);
      const desc = safe(p.description);
      return name.includes(b) || desc.includes(b);
    });
  }

  // CPU
  if (cpu) {
    const c = safe(cpu);
    result = result.filter(
      (p) =>
        p.specs?.some(
          (s) =>
            safe(s.SpecName).includes("cpu") &&
            safe(s.SpecValue).includes(c)
        ) || safe(p.description).includes(c)
    );
  }

  // SERIES
  if (series) {
    const s = safe(series);
    result = result.filter((p) => safe(p.name).includes(s));
  }

  // USAGE
  if (usage) {
    const usageList = Array.isArray(usage)
      ? usage.map((u) => safe(u))
      : [safe(usage)];

    result = result.filter((p) => {
      const name = safe(p.name);
      const desc = safe(p.description);
      return usageList.some((u) => name.includes(u) || desc.includes(u));
    });
  }

  // SCREEN SIZE
  if (screenSize) {
    const size = safe(screenSize);
    result = result.filter(
      (p) =>
        p.specs?.some((s) => {
          const name = safe(s.SpecName);
          const value = safe(s.SpecValue);
          return (
            (name.includes("màn hình") ||
              name.includes("screen") ||
              name.includes("kích thước")) &&
            value.includes(size)
          );
        }) || safe(p.description).includes(size)
    );
  }

  // RAM
  if (ram) {
    const r = safe(ram);
    result = result.filter(
      (p) =>
        p.specs?.some(
          (s) =>
            safe(s.SpecName).includes("ram") &&
            safe(s.SpecValue).includes(r)
        ) || safe(p.description).includes(r)
    );
  }

  // SSD
  if (ssd) {
    const ssdVal = safe(ssd);
    result = result.filter(
      (p) =>
        p.specs?.some((s) => {
          const name = safe(s.SpecName);
          const value = safe(s.SpecValue);
          return (
            (name.includes("ssd") || name.includes("ổ cứng")) &&
            value.includes(ssdVal)
          );
        }) || safe(p.description).includes(ssdVal)
    );
  }

  // VGA
  if (vga) {
    const v = safe(vga);
    result = result.filter(
      (p) =>
        p.specs?.some(
          (s) =>
            safe(s.SpecName).includes("vga") &&
            safe(s.SpecValue).includes(v)
        ) || safe(p.description).includes(v)
    );
  }

  // DPI
  if (dpi) {
    const dpiLimit = parseInt(dpi, 10);
    result = result.filter((p) =>
      p.specs?.some((s) => {
        const specName = safe(s.SpecName);
        if (!(specName.includes("độ phân giải") || specName.includes("dpi"))) {
          return false;
        }
        const maxDpi = extractMaxDpi(safeVal(s.SpecValue));
        return maxDpi != null && maxDpi <= dpiLimit;
      })
    );
  }

  // RESOLUTION
  if (resolution) {
    const res = safe(resolution);
    result = result.filter((p) =>
      p.specs?.some(
        (s) =>
          safe(s.SpecName).includes("độ phân giải") &&
          safe(s.SpecValue).includes(res)
      )
    );
  }

  // PANEL TYPE
  if (panelType) {
    const panel = safe(panelType);
    result = result.filter((p) =>
      p.specs?.some(
        (s) =>
          safe(s.SpecName).includes("tấm nền") &&
          safe(s.SpecValue).includes(panel)
      )
    );
  }

  // KEYBOARD TYPE
  if (keyboardType) {
    const k = safe(keyboardType);
    result = result.filter((p) =>
      p.specs?.some(
        (s) =>
          safe(s.SpecName).includes("loại bàn phím") &&
          safe(s.SpecValue).includes(k)
      )
    );
  }

  // LAYOUT
  if (layout) {
    const l = safe(layout);
    result = result.filter((p) =>
      p.specs?.some(
        (s) =>
          safe(s.SpecName).includes("layout") &&
          safe(s.SpecValue).includes(l)
      )
    );
  }

  // PSU
  if (psu) {
    const pVal = safe(psu);
    result = result.filter((p) =>
      p.specs?.some(
        (s) =>
          safe(s.SpecName).includes("psu") &&
          safe(s.SpecValue).includes(pVal)
      )
    );
  }

  // SOCKET
  if (socket) {
    const sock = safe(socket);
    result = result.filter(
      (p) =>
        p.specs?.some(
          (s) =>
            safe(s.SpecName).includes("socket") &&
            safe(s.SpecValue).includes(sock)
        ) || safe(p.description).includes(sock)
    );
  }

  // WATT
  if (watt) {
    const w = safe(watt);
    result = result.filter(
      (p) =>
        p.specs?.some(
          (s) =>
            safe(s.SpecName).includes("công suất") &&
            safe(s.SpecValue).includes(w)
        ) || safe(p.description).includes(w)
    );
  }

  // CAPACITY
  if (capacity) {
    const cap = safe(capacity);
    result = result.filter(
      (p) =>
        p.specs?.some(
          (s) =>
            (safe(s.SpecName).includes("dung lượng") ||
              safe(s.SpecName).includes("capacity")) &&
            safe(s.SpecValue).includes(cap)
        ) || safe(p.description).includes(cap)
    );
  }

  // PRICE
  if (price) {
    const [min, max] = price.split("-").map(Number);
    result = result.filter((p) => {
      const realPrice = p.discountPrice || p.price;
      return realPrice >= min && (max ? realPrice <= max : true);
    });
  }

  // SORT
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
