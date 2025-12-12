// src/lib/products/filterConfig.ts
import type { FilterConfig } from "./types";

export const CATEGORY_FILTER_CONFIG: Record<string, FilterConfig[]> = {
  // Laptop (1)
  "1": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [
        { value: "1", label: "Laptop" },
        { value: "2", label: "PC" },
        { value: "3", label: "Màn hình" },
        { value: "4", label: "Bàn phím" },
        { value: "5", label: "Chuột" },
      ],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-5000000", label: "Dưới 5 triệu" },
        { value: "5000000-10000000", label: "5 - 10 triệu" },
        { value: "10000000-20000000", label: "10 - 20 triệu" },
        { value: "20000000-999999999", label: "Trên 20 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "dell", label: "Dell" },
        { value: "asus", label: "ASUS" },
        { value: "hp", label: "HP" },
        { value: "lenovo", label: "Lenovo" },
        { value: "acer", label: "Acer" },
        { value: "gigabyte", label: "Gigabyte" },
        { value: "msi", label: "MSI" },
      ],
    },
    {
      key: "cpu",
      label: "CPU",
      placeholder: "CPU",
      options: [
        { value: "intel core i5", label: "Intel Core i5" },
        { value: "intel core i7", label: "Intel Core i7" },
        { value: "ryzen 5", label: "AMD Ryzen 5" },
        { value: "ryzen 7", label: "AMD Ryzen 7" },
        { value: "intel đời 13", label: "Core Intel 13th" },
      ],
    },
    {
      key: "screenSize",
      label: "Kích thước màn hình",
      placeholder: "Kích thước màn hình",
      options: [
        { value: '13"', label: '13"' },
        { value: '14"', label: '14"' },
        { value: '15.6"', label: '15.6"' },
      ],
    },
    {
      key: "ram",
      label: "RAM",
      placeholder: "RAM",
      options: [
        { value: "8gb", label: "8GB" },
        { value: "16gb", label: "16GB" },
        { value: "32gb", label: "32GB" },
      ],
    },
    {
      key: "ssd",
      label: "SSD",
      placeholder: "SSD",
      options: [
        { value: "512gb", label: "512GB" },
        { value: "1tb", label: "1TB" },
      ],
    },
    {
      key: "vga",
      label: "VGA",
      placeholder: "VGA",
      options: [
        { value: "rtx 2050", label: "RTX 2050" },
        { value: "rtx 3050", label: "RTX 3050" },
        { value: "rtx 4060", label: "RTX 4060" },
        { value: "intel iris xe", label: "Intel Iris Xe" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "văn phòng", label: "Văn phòng" },
        { value: "đồ họa", label: "Đồ họa" },
        { value: "mỏng nhẹ", label: "Mỏng nhẹ" },
        { value: "học sinh", label: "Học sinh - Sinh viên" },
      ],
    },
  ],

  // PC (2)
  "2": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [{ value: "2", label: "PC" }],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-10000000", label: "Dưới 10 triệu" },
        { value: "10000000-20000000", label: "10 - 20 triệu" },
        { value: "20000000-30000000", label: "20 - 30 triệu" },
        { value: "30000000-999999999", label: "Trên 30 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "asus", label: "ASUS" },
        { value: "gigabyte", label: "Gigabyte" },
        { value: "msi", label: "MSI" },
      ],
    },
    {
      key: "cpu",
      label: "CPU",
      placeholder: "CPU",
      options: [
        { value: "amd ryzen 9", label: "AMD Ryzen 9" },
        { value: "intel core i9", label: "Intel Core i9" },
      ],
    },
    {
      key: "ram",
      label: "RAM",
      placeholder: "RAM",
      options: [
        { value: "32gb", label: "32GB" },
        { value: "64gb", label: "64GB" },
        { value: "96gb", label: "96GB" },
      ],
    },
    {
      key: "ssd",
      label: "SSD",
      placeholder: "SSD",
      options: [
        { value: "1tb", label: "1TB" },
        { value: "2tb", label: "2TB" },
      ],
    },
    {
      key: "vga",
      label: "VGA",
      placeholder: "VGA",
      options: [
        { value: "rtx 5090", label: "RTX 5090" },
        { value: "rtx 3060", label: "RTX 3060" },
      ],
    },
    {
      key: "psu",
      label: "Nguồn (PSU)",
      placeholder: "Nguồn (PSU)",
      options: [
        { value: "1200w", label: "1200W" },
        { value: "1000w", label: "1000W" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "workstation", label: "Workstation" },
      ],
    },
  ],

  // Màn hình (3)
  "3": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [{ value: "3", label: "Màn hình" }],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-2000000", label: "Dưới 2 triệu" },
        { value: "2000000-5000000", label: "2 - 5 triệu" },
        { value: "5000000-10000000", label: "5 - 10 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "viewsonic", label: "Viewsonic" },
        { value: "lg", label: "LG" },
        { value: "asus", label: "ASUS" },
      ],
    },
    {
      key: "screenSize",
      label: "Kích thước",
      placeholder: "Kích thước",
      options: [
        { value: "23.8 inch", label: "23.8 inch" },
        { value: "24 inch", label: "24 inch" },
        { value: "27 inch", label: "27 inch" },
      ],
    },
    {
      key: "resolution",
      label: "Độ phân giải",
      placeholder: "Độ phân giải",
      options: [
        { value: "full hd", label: "Full HD (1920x1080)" },
        { value: "2k", label: "2K (2560x1440)" },
        { value: "4k", label: "4K (3840x2160)" },
      ],
    },
    {
      key: "panelType",
      label: "Tấm nền",
      placeholder: "Tấm nền",
      options: [
        { value: "va", label: "VA" },
        { value: "ips", label: "IPS" },
        { value: "oled", label: "OLED" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "văn phòng", label: "Văn phòng" },
      ],
    },
  ],

  // Bàn phím (4)
  "4": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [{ value: "4", label: "Bàn phím" }],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-500000", label: "Dưới 500k" },
        { value: "500000-1000000", label: "500k - 1 triệu" },
        { value: "1000000-2000000", label: "1 - 2 triệu" },
        { value: "2000000-5000000", label: "2 - 5 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "corsair", label: "Corsair" },
        { value: "dare-u", label: "Dare-U" },
        { value: "filco", label: "Filco" },
        { value: "keychron", label: "Keychron" },
        { value: "razer", label: "Razer" },
        { value: "royal", label: "Royal" },
        { value: "logitech", label: "Logitech" },
        { value: "akko", label: "AKKO" },
      ],
    },
    {
      key: "keyboardType",
      label: "Loại bàn phím",
      placeholder: "Loại bàn phím",
      options: [
        { value: "low-profile", label: "Low-Profile" },
        { value: "mechanical", label: "Mechanical" },
      ],
    },
    {
      key: "layout",
      label: "Layout",
      placeholder: "Layout",
      options: [
        { value: "75%", label: "75%" },
        { value: "fullsize", label: "Fullsize" },
        { value: "tenkeyless", label: "Tenkeyless" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "văn phòng", label: "Văn phòng" },
      ],
    },
  ],

  // Chuột (5)
  "5": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [{ value: "5", label: "Chuột" }],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-500000", label: "Dưới 500k" },
        { value: "500000-1000000", label: "500k - 1 triệu" },
        { value: "1000000-3000000", label: "1 - 3 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "logitech", label: "Logitech" },
        { value: "razer", label: "Razer" },
        { value: "steelseries", label: "SteelSeries" },
      ],
    },
    {
      key: "dpi",
      label: "DPI",
      placeholder: "DPI",
      options: [
        { value: "8000", label: "≤ 8.000 DPI" },
        { value: "16000", label: "≤ 16.000 DPI" },
        { value: "25000", label: "≤ 25.000 DPI" },
        { value: "30000", label: "≤ 30.000 DPI" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "văn phòng", label: "Văn phòng" },
      ],
    },
  ],

  // Mainboard & VGA (6)
  "6": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [{ value: "6", label: "Main, CPU, VGA" }],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-20000000", label: "Dưới 20 triệu" },
        { value: "20000000-30000000", label: "20 - 30 triệu" },
        { value: "30000000-40000000", label: "30 - 40 triệu" },
        { value: "40000000-999999999", label: "Trên 40 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "asus", label: "ASUS" },
        { value: "msi", label: "MSI" },
        { value: "gigabyte", label: "Gigabyte" },
      ],
    },
    {
      key: "series",
      label: "Series",
      placeholder: "Series",
      options: [
        { value: "rtx 5060", label: "RTX 5060" },
        { value: "rtx 5060 ti", label: "RTX 5060Ti" },
        { value: "rtx 5070", label: "RTX 5070" },
        { value: "rtx 5070 ti", label: "RTX 5070Ti" },
        { value: "rtx 5080", label: "RTX 5080" },
        { value: "rtx 5090", label: "RTX 5090" },
        { value: "z790", label: "Z790" },
        { value: "z890", label: "Z890" },
      ],
    },
    {
      key: "socket",
      label: "Socket (cho Mainboard)",
      placeholder: "Socket",
      options: [
        { value: "lga 1700", label: "LGA 1700" },
        { value: "am5", label: "AM5" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "overclock", label: "Overclock" },
      ],
    },
  ],

  // Case, PSU, Cooling (7)
  "7": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [{ value: "7", label: "Vỏ case, Nguồn, Tản nhiệt" }],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-2000000", label: "Dưới 2 triệu" },
        { value: "2000000-5000000", label: "2 - 5 triệu" },
        { value: "5000000-10000000", label: "5 - 10 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "corsair", label: "Corsair" },
        { value: "lian li", label: "Lian Li" },
        { value: "asus", label: "ASUS" },
        { value: "deepcool", label: "Deepcool" },
      ],
    },
    {
      key: "watt",
      label: "Công suất (PSU)",
      placeholder: "Công suất",
      options: [
        { value: "850w", label: "850W" },
        { value: "1000w", label: "1000W" },
        { value: "1500w", label: "1500W" },
        { value: "1600w", label: "1600W" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "workstation", label: "Workstation" },
      ],
    },
  ],

  // RAM & Storage (8)
  "8": [
    {
      key: "category",
      label: "Danh mục",
      placeholder: "Bộ lọc (Danh mục)",
      options: [{ value: "8", label: "RAM & Ổ cứng" }],
    },
    {
      key: "price",
      label: "Giá",
      placeholder: "Giá",
      options: [
        { value: "0-1000000", label: "Dưới 1 triệu" },
        { value: "1000000-3000000", label: "1 - 3 triệu" },
        { value: "3000000-5000000", label: "3 - 5 triệu" },
        { value: "5000000-999999999", label: "Trên 5 triệu" },
      ],
    },
    {
      key: "brand",
      label: "Hãng",
      placeholder: "Hãng",
      options: [
        { value: "corsair", label: "Corsair" },
        { value: "kingston", label: "Kingston" },
        { value: "samsung", label: "Samsung" },
        { value: "wd", label: "WD" },
        { value: "gigabyte", label: "Gigabyte" },
      ],
    },
    {
      key: "capacity",
      label: "Dung lượng",
      placeholder: "Dung lượng",
      options: [
        { value: "128gb", label: "128GB" },
        { value: "500gb", label: "500GB" },
        { value: "1tb", label: "1TB" },
        { value: "2tb", label: "2TB" },
        { value: "32gb", label: "32GB (RAM)" },
        { value: "64gb", label: "64GB (RAM)" },
      ],
    },
    {
      key: "usage",
      label: "Nhu cầu sử dụng",
      placeholder: "Nhu cầu sử dụng",
      options: [
        { value: "gaming", label: "Gaming" },
        { value: "workstation", label: "Workstation" },
      ],
    },
  ],
};