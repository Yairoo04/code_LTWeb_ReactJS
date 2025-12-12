export const categories_pc = [
  { title: 'PC I3', href: '/collections/laptop-intel-core-i3' },
  { title: 'PC I5', href: '/collections/laptop-intel-core-i5' },
  { title: 'PC I7', href: '/collections/laptop-intel-core-i7' },
  { title: 'PC I8', href: '/collections/laptop-intel-core-i8' },
  { title: 'PC I9', href: '/collections/laptop-intel-core-i9' },
  { title: 'PC R3', href: '/collections/pc-gtn-r3' },
  { title: 'PC R7', href: '/collections/pc-gtn-r7' },
  { title: 'PC R9', href: '/collections/pc-gtn-r9' },
];

export const categories_laptop = [
  { title: 'ASUS', href: '/collections/laptop-asus', filters: { category: "1", brand: "asus"}},
  { title: 'ACER', href: '/collections/laptop-acer', filters: { category: "1", brand: "acer"}},
  { title: 'MSI', href: '/collections/laptop-msi', filters: { category: "1", brand: "msi"} },
  { title: 'LENOVO', href: '/collections/laptop-lenovo', filters: { category: "1", brand: "lenovo"} },
  { title: 'GIGABYTE', href: '/collections/laptop-gigabyte', filters: { category: "1", brand: "gigabyte"} },
  { title: 'DELL', href: '/collections/laptop-dell', filters: { category: "1", brand: "dell"} },
  { title: 'HP', href: '/collections/laptop-HP', filters: { category: "1", brand: "hp"} },
];

export const categories_mouse = [
  { title: 'Logitech', href: '/collections/chuot-logitech' },
  { title: 'Razer', href: '/collections/chuot-razer' },
  { title: 'Asus', href: '/collections/chuot-asus' },
  { title: 'Corsair', href: '/collections/chuot-corsair' },
  { title: 'Dare-U', href: '/collections/chuot-dare-u' },
  { title: 'Rapoo', href: '/collections/chuot-rapoo' },
];

export const categories_keyboard = [
  { title: 'Akko', href: '/collections/ban-phim-akko' },
  { title: 'Asus', href: '/collections/ban-phim-asus' },
  { title: 'Razer', href: '/collections/ban-phim-choi-game-razer' },
  { title: 'Logitech', href: '/collections/ban-phim-logitech' },
  { title: 'Leopold', href: '/collections/ban-phim-leopold' },
  { title: 'DareU', href: '/collections/ban-phim-dare-u' },
];

export const categories_monitor = [
  { title: 'LG', href: '/collections/monitor-lg' },
  { title: 'Asus', href: '/collections/man-hinh-asus' },
  { title: 'ViewSonic', href: '/collections/man-hinh-viewsonic' },
  { title: 'Dell', href: '/collections/man-hinh-dell' },
  { title: 'Gigabyte', href: '/collections/man-hinh-gigabyte' },
  { title: 'AOC', href: '/collections/man-hinh-aoc' },
  { title: 'Acer', href: '/collections/man-hinh-acer' },
  { title: 'HKC', href: '/collections/hkc' },
];

export const megaMenuData = [
  {
    title: "Laptop",
    href: "/collections/laptop",
    icon: '<svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="path-1-inside-1_5068_8551" fill="currentcolor"><path d="M4.00002 1C3.44774 1 3.00002 1.44772 3.00002 2V8.5C3.00002 9.05229 3.44774 9.5 4.00002 9.5H16C16.5523 9.5 17 9.05229 17 8.5V2C17 1.44772 16.5523 1 16 1H4.00002ZM3.70002 0H10H16.3C16.7774 0 17.2353 0.184374 17.5728 0.512563C17.9104 0.840752 18.1 1.28587 18.1 1.75V8.75C18.1 9.21413 17.9104 9.65925 17.5728 9.98744C17.2353 10.3156 16.7774 10.5 16.3 10.5H3.70002C3.22263 10.5 2.7648 10.3156 2.42723 9.98744C2.08967 9.65925 1.90002 9.21413 1.90002 8.75V1.75C1.90002 1.28587 2.08967 0.840752 2.42723 0.512563C2.7648 0.184374 3.22263 0 3.70002 0Z"/></mask><path d="M4.00002 1C3.44774 1 3.00002 1.44772 3.00002 2V8.5C3.00002 9.05229 3.44774 9.5 4.00002 9.5H16C16.5523 9.5 17 9.05229 17 8.5V2C17 1.44772 16.5523 1 16 1H4.00002ZM3.70002 0H10H16.3C16.7774 0 17.2353 0.184374 17.5728 0.512563C17.9104 0.840752 18.1 1.28587 18.1 1.75V8.75C18.1 9.21413 17.9104 9.65925 17.5728 9.98744C17.2353 10.3156 16.7774 10.5 16.3 10.5H3.70002C3.22263 10.5 2.7648 10.3156 2.42723 9.98744C2.08967 9.65925 1.90002 9.21413 1.90002 8.75V1.75C1.90002 1.28587 2.08967 0.840752 2.42723 0.512563C2.7648 0.184374 3.22263 0 3.70002 0Z" fill="currentcolor"/><path d="M1 12L19 12" stroke="currentcolor" stroke-linecap="round"/></svg>',
    subItems: [
      {
        name: "Thương hiệu",
        nameHref: "/collections/laptop",
        filters: [
          { href: "/collections/laptop-asus-hoc-tap-va-lam-viec", text: "ASUS", filters: { category: "1", brand: "asus", usage: ["văn phòng", "học sinh"] } },
          { href: "/collections/laptop-acer-hoc-tap-va-lam-viec", text: "ACER", filters: { category: "1", brand: "acer", usage: ["văn phòng", "học sinh"] } },
          { href: "/collections/laptop-msi-hoc-tap-va-lam-viec", text: "MSI", filters: { category: "1", brand: "msi", usage: ["văn phòng", "học sinh"] } },
          { href: "/collections/laptop-lenovo-hoc-tap-va-lam-viec", text: "LENOVO", filters: { category: "1", brand: "lenovo", usage: ["văn phòng", "học sinh"] } },
          { href: "/collections/laptop-dell-hoc-tap-va-lam-viec", text: "DELL", filters: { category: "1", brand: "dell", usage: ["văn phòng", "học sinh"] } },
          { href: "/collections/laptop-hp-pavilion-hoc-tap-va-lam-viec", text: "HP - Pavilion", filters: { category: "1", brand: "hp", series: "pavilion", usage: ["văn phòng", "học sinh"] } },
          { href: "/collections/laptop-lg-gram-hoc-tap-va-lam-viec", text: "LG - Gram", filters: { category: "1", brand: "lg", series: "gram", usage: ["văn phòng", "học sinh"] } },
        ],
      },
      {
        name: "Giá bán",
        nameHref: "/collections/laptop",
        filters: [
          { href: "/collections/laptop-hoc-tap-va-lam-viec-duoi-15tr", text: "Dưới 15 triệu", filters: { category: "1", price: "0-15000000", usage: ["văn phòng", "học sinh"] } },
          { href: "/collections/laptop-hoc-tap-va-lam-viec-tu-15tr-den-20tr", text: "Từ 15 đến 20 triệu", filters: { category: "1", price: "15000000-20000000", usage: ["văn phòng", "học sinh"] } },
          { href: "/collections/laptop-hoc-tap-va-lam-viec-tren-20-trieu", text: "Trên 20 triệu", filters: { category: "1", price: "20000000-999999999", usage: ["văn phòng", "học sinh"] } },
        ],
      },
      {
        name: "CPU Intel - AMD",
        nameHref: "/collections/laptop",
        filters: [
          { href: "/collections/laptop-intel-core-i3", text: "Intel Core i3", filters: { category: "1", cpu: "intel core i3" } },
          { href: "/collections/laptop-intel-core-i5", text: "Intel Core i5", filters: { category: "1", cpu: "intel core i5" } },
          { href: "/collections/laptop-intel-core-i7", text: "Intel Core i7", filters: { category: "1", cpu: "intel core i7" } },
          { href: "/collections/laptop-cpu-amd-ryzen", text: "AMD Ryzen", filters: { category: "1", cpu: "amd ryzen" } },
        ],
      },
      {
        name: "Nhu cầu sử dụng",
        nameHref: "/collections/laptop",
        filters: [
          { href: "/collections/laptop-do-hoa", text: "Đồ họa - Studio", filters: { category: "1", usage: "đồ họa" } },
          { href: "/collections/laptop-hoc-sinh-sinh-vien", text: "Học sinh - Sinh viên", filters: { category: "1", usage: "học sinh" } },
          { href: "/collections/laptop-mong-nhe-cao-cap", text: "Mỏng nhẹ cao cấp", filters: { category: "1", usage: "mỏng nhẹ" } },
        ],
      },
      {
        name: "Linh phụ kiện Laptop",
        nameHref: "/collections/linh-kien-phu-kien-laptop",
        filters: [
          { href: "/collections/ram-laptop", text: "Ram laptop", filters: { category: "1", ram: "laptop" } },
          { href: "/collections/ssd-laptop", text: "SSD laptop", filters: { category: "1", ssd: "laptop" } },
          { href: "/collections/o-cung-di-dong-hdd-box", text: "Ổ cứng di động", filters: { category: "1", ssd: "di-dong" } },
        ],
      },
      {
        name: "Laptop ASUS",
        nameHref: "/collections/laptop-asus-hoc-tap-va-lam-viec",
        filters: [
          { href: "/collections/laptop-asus-oled", text: "ASUS OLED Series", filters: { category: "1", brand: "asus", series: "oled" } },
          { href: "/collections/laptop-asus-vivobook-series", text: "Vivobook Series", filters: { category: "1", brand: "asus", series: "vivobook" } },
          { href: "/collections/laptop-asus-zenbook-series", text: "Zenbook Series", filters: { category: "1", brand: "asus", series: "zenbook" } },
        ],
      },
      {
        name: "Laptop ACER",
        nameHref: "/collections/laptop-acer-hoc-tap-va-lam-viec",
        filters: [
          { href: "/collections/laptop-acer-aspire-series", text: "Aspire Series", filters: { category: "1", brand: "acer", series: "aspire" } },
          { href: "/collections/acer-swift-series", text: "Swift Series", filters: { category: "1", brand: "acer", series: "swift" } },
        ],
      },
      {
        name: "Laptop MSI",
        nameHref: "/collections/laptop-msi-hoc-tap-va-lam-viec",
        filters: [
          { href: "/collections/msi-modern-14-series", text: "Modern Series", filters: { category: "1", brand: "msi", series: "modern" } },
          { href: "/collections/prestige-series", text: "Prestige Series", filters: { category: "1", brand: "msi", series: "prestige" } },
        ],
      },
      {
        name: "Laptop Lenovo",
        nameHref: "/collections/laptop-lenovo-hoc-tap-va-lam-viec",
        filters: [
          { href: "/collections/lenovo-thinkbook", text: "Thinkbook Series", filters: { category: "1", brand: "lenovo", series: "thinkbook" } },
          { href: "/collections/laptop-ideapad-pro", text: "Ideapad Series", filters: { category: "1", brand: "lenovo", series: "ideapad" } },
          { href: "/collections/lenovo-thinkpad", text: "Thinkpad Series", filters: { category: "1", brand: "lenovo", series: "thinkpad" } },
          { href: "/collections/laptop-lenovo-yoga-series", text: "Yoga Series", filters: { category: "1", brand: "lenovo", series: "yoga" } },
        ],
      },
      {
        name: "Laptop Dell",
        nameHref: "/collections/laptop-dell-hoc-tap-va-lam-viec",
        filters: [
          { href: "/collections/laptop-dell-inspiron-series", text: "Inspiron Series", filters: { category: "1", brand: "dell", series: "inspiron" } },
          { href: "/collections/laptop-dell-vostro-series", text: "Vostro Series", filters: { category: "1", brand: "dell", series: "vostro" } },
          { href: "/collections/laptop-dell-latitude-series", text: "Latitude Series", filters: { category: "1", brand: "dell", series: "latitude" } },
          { href: "/collections/laptop-dell-xps-chinh-hang", text: "XPS Series", filters: { category: "1", brand: "dell", series: "xps" } },
        ],
      },
    ],
  },
  {
    title: "Laptop Gaming",
    href: "/pages/laptop-gaming",
    icon: '<svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="path-1-inside-1_5068_8558" fill="white"><path d="M3.96432 4C3.41203 4 2.96432 4.44772 2.96432 5V11.5C2.96432 12.0523 3.41203 12.5 3.96432 12.5H15.9643C16.5166 12.5 16.9643 12.0523 16.9643 11.5V4H3.96432ZM3.66432 3H9.96432H16.2643C16.7417 3 17.1995 3.18437 17.5371 3.51256C17.8747 3.84075 18.0643 4.28587 18.0643 4.75V11.75C18.0643 12.2141 17.8747 12.6592 17.5371 12.9874C17.1995 13.3156 16.7417 13.5 16.2643 13.5H3.66432C3.18693 13.5 2.72909 13.3156 2.39153 12.9874C2.05396 12.6592 1.86432 12.2141 1.86432 11.75V4.75C1.86432 4.28587 2.05396 3.84075 2.39153 3.51256C2.72909 3.18437 3.18693 3 3.66432 3Z"></path></mask><path d="M3.96432 4C3.41203 4 2.96432 4.44772 2.96432 5V11.5C2.96432 12.0523 3.41203 12.5 3.96432 12.5H15.9643C16.5166 12.5 16.9643 12.0523 16.9643 11.5V4H3.96432ZM3.66432 3H9.96432H16.2643C16.7417 3 17.1995 3.18437 17.5371 3.51256C17.8747 3.84075 18.0643 4.28587 18.0643 4.75V11.75C18.0643 12.2141 17.8747 12.6592 17.5371 12.9874C17.1995 13.3156 16.7417 13.5 16.2643 13.5H3.66432C3.18693 13.5 2.72909 13.3156 2.39153 12.9874C2.05396 12.6592 1.86432 12.2141 1.86432 11.75V4.75C1.86432 4.28587 2.05396 3.84075 2.39153 3.51256C2.72909 3.18437 3.18693 3 3.66432 3Z" fill="currentcolor"></path><path d="M0.964294 15L18.9643 15" stroke="currentcolor" stroke-linecap="round"></path><path d="M10.9754 1.87868C11.5771 1.31607 12.3931 1 13.244 1H17.8274C18.2487 1 18.6659 1.0776 19.0551 1.22836C19.4444 1.37913 19.7981 1.6001 20.096 1.87868C20.3939 2.15726 20.6303 2.48797 20.7915 2.85195C20.9527 3.21593 21.0357 3.60603 21.0357 4C21.0357 4.39397 20.9527 4.78407 20.7915 5.14805C20.6303 5.51203 20.3939 5.84274 20.096 6.12132C19.7981 6.3999 19.4444 6.62087 19.0551 6.77164C18.6659 6.9224 18.2487 7 17.8274 7H13.244C12.3931 7 11.5771 6.68393 10.9754 6.12132C10.3737 5.55871 10.0357 4.79565 10.0357 4C10.0357 3.20435 10.3737 2.44129 10.9754 1.87868Z" fill="white" stroke="white" stroke-width="2"></path><path d="M10.9754 1.87868C11.5771 1.31607 12.3931 1 13.244 1H17.8274C18.2487 1 18.6659 1.0776 19.0551 1.22836C19.4444 1.37913 19.7981 1.6001 20.096 1.87868C20.3939 2.15726 20.6303 2.48797 20.7915 2.85195C20.9527 3.21593 21.0357 3.60603 21.0357 4C21.0357 4.39397 20.9527 4.78407 20.7915 5.14805C20.6303 5.51203 20.3939 5.84274 20.096 6.12132C19.7981 6.3999 19.4444 6.62087 19.0551 6.77164C18.6659 6.9224 18.2487 7 17.8274 7H13.244C12.3931 7 11.5771 6.68393 10.9754 6.12132C10.3737 5.55871 10.0357 4.79565 10.0357 4C10.0357 3.20435 10.3737 2.44129 10.9754 1.87868Z" stroke="currentcolor"></path><path d="M17.625 3.79696C17.5852 3.75567 17.5379 3.72292 17.486 3.70056C17.434 3.67821 17.3782 3.66669 17.322 3.66667C17.2657 3.66665 17.2099 3.67813 17.1579 3.70044C17.1059 3.72276 17.0587 3.75548 17.0189 3.79674C16.9791 3.83799 16.9475 3.88698 16.9259 3.94089C16.9044 3.9948 16.8933 4.05259 16.8932 4.11096C16.8932 4.16932 16.9043 4.22712 16.9258 4.28105C16.9473 4.33498 16.9789 4.38399 17.0187 4.42527C17.099 4.50865 17.208 4.55552 17.3217 4.55556C17.4353 4.5556 17.5443 4.50882 17.6247 4.4255C17.7051 4.34218 17.7503 4.22915 17.7504 4.11127C17.7504 3.9934 17.7053 3.88034 17.625 3.79696Z" fill="currentcolor"></path><path d="M17.871 2.91345C17.9105 2.87101 17.9578 2.83715 18.0101 2.81385C18.0624 2.79056 18.1186 2.7783 18.1755 2.77779C18.2324 2.77727 18.2888 2.78852 18.3415 2.81087C18.3942 2.83321 18.442 2.86622 18.4823 2.90795C18.5225 2.94968 18.5543 2.9993 18.5759 3.05392C18.5974 3.10854 18.6083 3.16706 18.6078 3.22608C18.6073 3.28509 18.5955 3.34341 18.573 3.39763C18.5505 3.45186 18.5179 3.5009 18.477 3.5419C18.3961 3.62286 18.2879 3.66766 18.1755 3.66664C18.0631 3.66563 17.9556 3.61889 17.8762 3.53648C17.7967 3.45408 17.7516 3.34261 17.7507 3.22608C17.7497 3.10955 17.7929 2.99728 17.871 2.91345Z" fill="currentcolor"></path><path d="M19.343 3.80236C19.3034 3.75991 19.2561 3.72605 19.2039 3.70275C19.1516 3.67946 19.0953 3.6672 19.0384 3.66669C18.9815 3.66618 18.9251 3.67742 18.8724 3.69977C18.8197 3.72212 18.7719 3.75512 18.7317 3.79685C18.6914 3.83858 18.6596 3.8882 18.638 3.94282C18.6165 3.99744 18.6056 4.05597 18.6061 4.11498C18.6066 4.17399 18.6185 4.23231 18.6409 4.28654C18.6634 4.34076 18.696 4.3898 18.737 4.4308C18.8178 4.51176 18.9261 4.55656 19.0384 4.55554C19.1508 4.55453 19.2583 4.50779 19.3377 4.42539C19.4172 4.34298 19.4623 4.23151 19.4633 4.11498C19.4642 3.99845 19.421 3.88618 19.343 3.80236Z" fill="currentcolor"></path><path d="M17.8763 4.68562C17.9161 4.64436 17.9634 4.61164 18.0154 4.58933C18.0674 4.56701 18.1231 4.55554 18.1794 4.55556C18.2357 4.55558 18.2914 4.56709 18.3434 4.58945C18.3954 4.6118 18.4426 4.64456 18.4824 4.68584C18.5222 4.72713 18.5537 4.77614 18.5752 4.83007C18.5968 4.884 18.6078 4.94179 18.6078 5.00016C18.6078 5.05852 18.5967 5.11631 18.5751 5.17023C18.5536 5.22414 18.522 5.27313 18.4822 5.31438C18.4018 5.3977 18.2927 5.44449 18.1791 5.44445C18.0654 5.4444 17.9564 5.39754 17.8761 5.31416C17.7957 5.23078 17.7506 5.11772 17.7507 4.99984C17.7507 4.88197 17.7959 4.76894 17.8763 4.68562Z" fill="currentcolor"></path><path d="M12.6058 4.55555H11.7487V3.66666H12.6058V2.77777H13.463V3.66666H14.3201V4.55555H13.463V5.44444H12.6058V4.55555Z" fill="currentcolor"></path></svg>',
    subItems: [
      {
        name: "Thương hiệu",
        nameHref: "/collections/laptop",
        filters: [
          { href: "/collections/laptop-gaming-acer", text: "ACER / PREDATOR", filters: { category: "1", brand: "acer", usage: ["gaming"] } },
          { href: "/collections/laptop-gaming-asus", text: "ASUS / ROG", filters: { category: "1", brand: "asus", usage: ["gaming"] } },
          { href: "/collections/laptop-msi-gaming", text: "MSI", filters: { category: "1", brand: "msi", usage: ["gaming"] } },
          { href: "/collections/laptop-gaming-lenovo", text: "LENOVO", filters: { category: "1", brand: "lenovo", usage: ["gaming"] } },
          { href: "/collections/laptop-gaming-dell", text: "DELL", filters: { category: "1", brand: "dell", usage: ["gaming"] } },
          { href: "/collections/laptop-gaming-gigabyte", text: "GIGABYTE / AORUS", filters: { category: "1", brand: "gigabyte", usage: ["gaming"] } },
          { href: "/collections/laptop-gaming-hp", text: "HP", filters: { category: "1", brand: "hp", usage: ["gaming"] } },
        ],
      },
      {
        name: "Giá bán",
        nameHref: "/collections/laptop",
        filters: [
          { href: "/collections/laptop-gaming-gia-duoi-20-trieu", text: "Dưới 20 triệu", filters: { category: "1", price: "0-20000000", usage: ["gaming"] } },
          { href: "/collections/laptop-gaming-gia-tu-20-den-25-trieu", text: "Từ 20 đến 25 triệu", filters: { category: "1", price: "20000000-25000000", usage: ["gaming"] } },
          { href: "/collections/laptop-gaming-gia-tu-25-den-35-trieu", text: "Từ 25 đến 30 triệu", filters: { category: "1", price: "25000000-30000000", usage: ["gaming"] } },
          { href: "/collections/laptop-gaming-tren-35-trieu", text: "Trên 30 triệu", filters: { category: "1", price: "30000000-999999999", usage: ["gaming"] } },
          { href: "/collections/laptop-gaming-rtx-50-series", text: "Gaming RTX 50 Series", filters: { category: "1", vga: "rtx 50 series", usage: ["gaming"] } },
        ],
      },
      {
        name: "ACER | PREDATOR",
        nameHref: "/collections/laptop-gaming-acer",
        filters: [
          { href: "/collections/laptop-acer-nitro-series", text: "Nitro Series", filters: { category: "1", brand: "acer", series: "nitro", usage: ["gaming"] } },
          { href: "/collections/laptop-acer-aspire-7", text: "Aspire Series", filters: { category: "1", brand: "acer", series: "aspire", usage: ["gaming"] } },
          { href: "/collections/laptop-acer-predator-series", text: "Predator Series", filters: { category: "1", brand: "acer", series: "predator", usage: ["gaming"] } },
          { href: "/collections/laptop-acer-rtx-50-series", text: "ACER RTX 50 Series", filters: { category: "1", brand: "acer", vga: "rtx 50 series", usage: ["gaming"] } },
        ],
      },
      {
        name: "ASUS | ROG Gaming",
        nameHref: "/collections/laptop-gaming-asus",
        filters: [
          { href: "/collections/laptop-asus-rog-series", text: "ROG Series", filters: { category: "1", brand: "asus", series: "rog", usage: ["gaming"] } },
          { href: "/collections/laptop-asus-tuf-gaming-series", text: "TUF Series", filters: { category: "1", brand: "asus", series: "tuf", usage: ["gaming"] } },
          { href: "/collections/laptop-asus-gaming-zephyrus-series", text: "Zephyrus Series", filters: { category: "1", brand: "asus", series: "zephyrus", usage: ["gaming"] } },
          { href: "/collections/asus-rtx-50-series", text: "ASUS RTX 50 Series", filters: { category: "1", brand: "asus", vga: "rtx 50 series", usage: ["gaming"] } },
        ],
      },
      {
        name: "MSI Gaming",
        nameHref: "/collections/laptop-msi-gaming",
        filters: [
          { href: "/collections/laptop-msi-gt-series", text: "Titan GT Series", filters: { category: "1", brand: "msi", series: "titan gt", usage: ["gaming"] } },
          { href: "/collections/laptop-msi-gs-series", text: "Stealth GS Series", filters: { category: "1", brand: "msi", series: "stealth gs", usage: ["gaming"] } },
          { href: "/collections/laptop-msi-ge-series", text: "Raider GE Series", filters: { category: "1", brand: "msi", series: "raider ge", usage: ["gaming"] } },
          { href: "/collections/laptop-msi-gp-series", text: "Vector GP Series", filters: { category: "1", brand: "msi", series: "vector gp", usage: ["gaming"] } },
          { href: "/collections/laptop-msi-gl-series", text: "Crosshair / Pulse GL Series", filters: { category: "1", brand: "msi", series: "pulse gl", usage: ["gaming"] } },
          { href: "/collections/laptop-msi-sword-katana-series", text: "Sword / Katana GF66 Series", filters: { category: "1", brand: "msi", series: "sword katana", usage: ["gaming"] } },
          { href: "/collections/laptop-msi-gf-series", text: "Cyborg / Thin GF Series", filters: { category: "1", brand: "msi", series: "cyborg thin gf", usage: ["gaming"] } },
          { href: "/collections/laptop-msi-rtx-50-series", text: "MSI RTX 50 Series", filters: { category: "1", brand: "msi", vga: "rtx 50 series", usage: ["gaming"] } },
        ],
      },
      {
        name: "LENOVO Gaming",
        nameHref: "/collections/laptop-gaming-lenovo",
        filters: [
          { href: "/collections/laptop-lenovo-legion", text: "Legion Gaming", filters: { category: "1", brand: "lenovo", series: "legion", usage: ["gaming"] } },
          { href: "/collections/laptop-gaming-lenovo-loq", text: "LOQ series", filters: { category: "1", brand: "lenovo", series: "loq", usage: ["gaming"] } },
          { href: "/collections/laptop-lenovo-rtx-50-series", text: "RTX 50 Series", filters: { category: "1", brand: "lenovo", vga: "rtx 50 series", usage: ["gaming"] } },
        ],
      },
      {
        name: "GIGABYTE Gaming",
        nameHref: "/collections/laptop-gaming-gigabyte",
        filters: [
          { href: "/collections/laptop-gaming-gigabyte", text: "Gaming Gigabyte", filters: { category: "1", brand: "gigabyte", usage: ["gaming"] } },
          { href: "/collections/laptop-gigabyte-rtx-50-series", text: "GIGABYTE RTX 50 Series", filters: { category: "1", brand: "gigabyte", vga: "rtx 50 series", usage: ["gaming"] } },
        ],
      },
      {
        name: "HP Gaming",
        nameHref: "/collections/laptop-gaming-hp",
        filters: [
          { href: "/collections/laptop-hp-victus", text: "HP Victus", filters: { category: "1", brand: "hp", series: "victus", usage: ["gaming"] } },
          { href: "/collections/laptop-hp-omen", text: "Hp Omen", filters: { category: "1", brand: "hp", series: "omen", usage: ["gaming"] } },
          { href: "/collections/laptop-hp-rtx-50-series", text: "HP RTX 50 Series", filters: { category: "1", brand: "hp", vga: "rtx 50 series", usage: ["gaming"] } },
        ],
      },
      {
        name: "Cấu hình",
        nameHref: "/collections/laptop",
        filters: [
          { href: "/collections/laptop-gaming-rtx-50-series", text: "RTX 50 Series", filters: { category: "1", vga: "rtx 50 series", usage: ["gaming"] } },
          { href: "/collections/laptop-intel-core-ultra", text: "CPU Core Ultra", filters: { category: "1", cpu: "intel core ultra", usage: ["gaming"] } },
          { href: "/collections/laptop-amd-radeon-rx", text: "CPU AMD", filters: { category: "1", cpu: "amd", usage: ["gaming"] } },
        ],
      },
      {
        name: "Linh - Phụ kiện Laptop",
        nameHref: "/collections/linh-kien-phu-kien-laptop/",
        filters: [
          { href: "/collections/ram-laptop", text: "Ram laptop", filters: { category: "1", ram: "laptop" } },
          { href: "/collections/ssd-laptop", text: "SSD laptop", filters: { category: "1", ssd: "laptop" } },
          { href: "/collections/o-cung-di-dong-hdd-box", text: "Ổ cứng di động", filters: { category: "1", ssd: "di-dong" } },
        ],
      },
    ],
  },
  {
    title: "PC GTN",
    href: "/collections/pc-gtn",
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="19" width="18" height="10" rx="1" transform="rotate(-90 1 19)" stroke="currentcolor"/><path d="M13 3H17C18.1046 3 19 3.89543 19 5V13C19 14.1046 18.1046 15 17 15H13" stroke="currentcolor"/><path d="M16.5 18.5C16.7761 18.5 17 18.2761 17 18C17 17.7239 16.7761 17.5 16.5 17.5V18.5ZM13 18.5H16.5V17.5H13V18.5Z" fill="currentcolor"/><circle cx="6" cy="5" r="1" fill="currentcolor"/><circle cx="6" cy="9" r="1" fill="currentcolor"/></svg>',
    subItems: [
      {
        name: "PC RTX 50 SERIES",
        nameHref: "/collections/pc-gtn",
        filters: [
          { href: "/collections/pc-gtn-rtx-5090", text: "PC RTX 5090", filters: { category: "2", vga: "RTX 5090" } },
          { href: "/collections/pc-gtn-rtx-5080", text: "PC RTX 5080", filters: { category: "2", vga: "RTX 5080" } },
          { href: "/collections/pc-gtn-rtx-5070ti", text: "PC RTX 5070Ti", filters: { category: "2", vga: "RTX 5070Ti" } },
          { href: "/collections/pc-gtn-rtx-5070", text: "PC RTX 5070", filters: { category: "2", vga: "RTX 5070" } },
          { href: "/collections/pc-rtx-5060ti", text: "PC RTX 5060Ti", filters: { category: "2", vga: "RTX 5060Ti" } },
          { href: "/collections/pc-gtn-rtx-5060", text: "PC RTX 5060 (HOT)", filters: { category: "2", vga: "RTX 5060" } },
        ],
      },
      {
        name: "PC HOT CHIẾN HÈ",
        nameHref: "/collections/pc-gtn",
        filters: [
          { href: "/collections/pc-gtn-rtx-5060", text: "I5 - 5060 - chỉ từ 18tr", filters: { category: "2", cpu: "i5", vga: "RTX 5060", price: "18000000-999999999" } },
          { href: "/collections/pc-gtn?vga=rtx4060", text: "I5 - 4060 - 17TR", filters: { category: "2", cpu: "i5", vga: "RTX 4060", price: "17000000-999999999" } },
          { href: "/collections/pc-gtn?vga=rtx3060", text: "I5 - 3060 - 15TR", filters: { category: "2", cpu: "i5", vga: "RTX 3060", price: "15000000-999999999" } },
          { href: "/collections/pc-gtn?vga=rtx3050", text: "I3 - 3050 - 11TR", filters: { category: "2", cpu: "i3", vga: "RTX 3050", price: "11000000-999999999" } },
          { href: "/products/pc-gtn-intel-i3-rx-6500xt", text: "I3 - RX6500XT - 10TR", filters: { category: "2", cpu: "i3", vga: "RX 6500XT", price: "10000000-999999999" } },
        ],
      },
      {
        name: "PC khuyến mãi KHỦNG",
        nameHref: "/collections/pc-gtn",
        filters: [
          { href: "/collections/pc-gtn-i7", text: "BUILD PC TẶNG MÀN 240HZ", filters: { category: "2", cpu: "i7" } },
          { href: "/products/pc-gtn-dragon-godlike-intel-core-ultra-9-285k-vga-rtx-5090-powered-by-msi", text: "GTN x MSI - Tặng màn hình OLED", filters: { category: "2", brand: "msi", cpu: "intel core ultra 9", vga: "RTX 5090" } },
          { href: "/products/pc-gtn-x-corsair-icue-intel-i5-14400f-vga-rtx-5060", text: "GTN x CORSAIR - Tặng tản nhiệt 5TR", filters: { category: "2", brand: "corsair", cpu: "i5", vga: "RTX 5060" } },
          { href: "/products/pc-gtn-intel-core-ultra-9-rtx5090", text: "GTN x ASUS - MAX SETTING", filters: { category: "2", brand: "asus", cpu: "intel core ultra 9", vga: "RTX 5090" } },
        ],
      },
      {
        name: "PC theo cấu hình VGA",
        nameHref: "/collections/pc-gtn",
        filters: [
          { href: "/collections/pc-gtn?vga=rtx3050 ", text: "PC RTX 3050", filters: { category: "2", vga: "RTX 3050" } },
          { href: "/collections/pc-gtn?vga=rtx3060", text: "PC RX6500XT", filters: { category: "2", vga: "RX 6500XT" } },
          { href: "/collections/pc-gtn?vga=rtx3060", text: "PC RTX 3060 (12GB)", filters: { category: "2", vga: "RTX 3060" } },
          { href: "/collections/pc-gtn?vga=rtx4060", text: "PC RTX 4060", filters: { category: "2", vga: "RTX 4060" } },
          { href: "/collections/pc-gtn", text: "PC RTX 4070 Super", filters: { category: "2", vga: "RTX 4070 Super" } },
        ],
      },
      {
        name: "A.I PC - gtn",
        nameHref: "/collections/ai-pc-gtn/",
        filters: [
          { href: "/collections/pc-gtn-powered-by-asus/", text: "PC GTN X ASUS - PBA", filters: { category: "2", brand: "asus", usage: "ai" } },
          { href: "/collections/pc-msi-powered-by-msi", text: "PC GTN X MSI", filters: { category: "2", brand: "msi", usage: "ai" } },
        ],
      },
      {
        name: "PC theo CPU Intel",
        nameHref: "/pages/pc-gtn",
        filters: [
          { href: "/collections/pc-gtn-i3", text: "PC Core I3", filters: { category: "2", cpu: "intel core i3" } },
          { href: "/collections/pc-gtn-i5", text: "PC Core I5", filters: { category: "2", cpu: "intel core i5" } },
          { href: "/collections/pc-gtn-i7", text: "PC Core I7", filters: { category: "2", cpu: "intel core i7" } },
          { href: "/collections/pc-gtn-i9", text: "PC Core I9", filters: { category: "2", cpu: "intel core i9" } },
        ],
      },
      {
        name: "PC theo CPU Intel",
        nameHref: "/pages/pc",
        filters: [
          { href: "/collections/pc-gtn-core-ultra-5", text: "PC Ultra 5 (Mới nhất)", filters: { category: "2", cpu: "core ultra 5" } },
          { href: "/collections/pc-gtn-core-ultra-7", text: "PC Ultra 7", filters: { category: "2", cpu: "core ultra 7" } },
          { href: "/collections/pc-gtn-ultra-9", text: "PC Ultra 9", filters: { category: "2", cpu: "core ultra 9" } },
        ],
      },
      {
        name: "PC theo CPU AMD",
        nameHref: "/collections/pc-gtn?cpu=amdryzen5,amdryzen7,amdryzen9",
        filters: [
          { href: "/collections/pc-gtn-r3", text: "PC AMD R3", filters: { category: "2", cpu: "amd ryzen 3" } },
          { href: "/collections/pc-gtn-r5", text: "PC AMD R5", filters: { category: "2", cpu: "amd ryzen 5" } },
          { href: "/collections/pc-gtn-r7", text: "PC AMD R7", filters: { category: "2", cpu: "amd ryzen 7" } },
          { href: "/collections/pc-gtn-r9", text: "PC AMD R9", filters: { category: "2", cpu: "amd ryzen 9" } },
        ],
      },
      {
        name: "PC Văn phòng",
        nameHref: "/collections/pc-van-phong",
        filters: [
          { href: "/products/pc-gtn-homework-amd-athlon", text: "Homework Athlon - Giá chỉ 3.990k", filters: { category: "2", cpu: "amd athlon", price: "3990000-999999999", usage: "văn phòng" } },
          { href: "/products/pc-gtn-homework-amd-r3", text: "Homework R3 - Giá chỉ 5,690k", filters: { category: "2", cpu: "amd r3", price: "5690000-999999999", usage: "văn phòng" } },
          { href: "/products/pc-gtn-homework-amd-r5", text: "Homework R5 - Giá chỉ 5,690k", filters: { category: "2", cpu: "amd r5", price: "5690000-999999999", usage: "văn phòng" } },
          { href: "/products/pc-gtn-homework-intel-i5", text: "Homework I5 - Giá chỉ 5,690k", filters: { category: "2", cpu: "i5", price: "5690000-999999999", usage: "văn phòng" } },
        ],
      },
      {
        name: "Phần mềm bản quyền",
        nameHref: "/collections/phan-mem/",
        filters: [
          { href: "/collections/window", text: "Window bản quyền - Chỉ từ 2.990K", filters: { category: "2", price: "2990000-999999999" } },
          { href: "/pages/microsoft-office-365", text: "Office 365 bản quyền - Chỉ từ 990K", filters: { category: "2", price: "990000-999999999" } },
        ],
      },
    ],
  },
  {
    title: "Main, CPU, VGA",
    href: "#",
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="19" width="18" height="10" rx="1" transform="rotate(-90 1 19)" stroke="currentcolor"/><path d="M13 3H17C18.1046 3 19 3.89543 19 5V13C19 14.1046 18.1046 15 17 15H13" stroke="currentcolor"/><path d="M16.5 18.5C16.7761 18.5 17 18.2761 17 18C17 17.7239 16.7761 17.5 16.5 17.5V18.5ZM13 18.5H16.5V17.5H13V18.5Z" fill="currentcolor"/><circle cx="6" cy="5" r="1" fill="currentcolor"/><circle cx="6" cy="9" r="1" fill="currentcolor"/></svg>',
    subItems: [
      {
        name: "VGA RTX 50 SERIES",
        nameHref: "/collections/vga-rtx-50-series",
        filters: [
          { href: "/collections/vga-rtx-5090-series", text: "RTX 5090", filters: { category: "6", vga: "RTX 5090", series: "RTX 5090" } },
          { href: "/collections/vga-rtx-5080", text: "RTX 5080", filters: { category: "6", vga: "RTX 5080", series: "RTX 5080" } },
          { href: "/collections/vga-rtx-5070-ti-series", text: "RTX 5070Ti", filters: { category: "6", vga: "RTX 5070 Ti", series: "RTX 5070 Ti" } },
          { href: "/collections/vga-rtx-5070-series", text: "RTX 5070", filters: { category: "6", vga: "RTX 5070", series: "RTX 5070" } },
          { href: "/collections/vga-rtx-5060-ti-series", text: "RTX 5060Ti", filters: { category: "6", vga: "RTX 5060 Ti", series: "RTX 5060 Ti" } },
          { href: "/collections/vga-rtx-5060-series", text: "RTX 5060", filters: { category: "6", vga: "RTX 5060", series: "RTX 5060" } },
        ],
      },
      {
        name: "VGA (Trên 12 GB VRAM)",
        nameHref: "/collections/vga-card-man-hinh",
        filters: [
          { href: "/collections/vga-rtx-4070-super", text: "RTX 4070 SUPER (12GB)", filters: { category: "6", vga: "RTX 4070 SUPER" } },
          { href: "/collections/vga-rtx-4070-ti-super", text: "RTX 4070Ti SUPER (16GB)", filters: { category: "6", vga: "RTX 4070Ti SUPER" } },
          { href: "/collections/vga-rtx-4080-super", text: "RTX 4080 SUPER (16GB)", filters: { category: "6", vga: "RTX 4080 SUPER" } },
          { href: "/collections/vga-rtx-4090", text: "RTX 4090 SUPER (24GB)", filters: { category: "6", vga: "RTX 4090 SUPER" } },
        ],
      },
      {
        name: "VGA (Dưới 12 GB VRAM)",
        nameHref: "/collections/vga-card-man-hinh",
        filters: [
          { href: "/collections/vga-rtx-4060-ti", text: "RTX 4060Ti (8 - 16GB)", filters: { category: "6", vga: "RTX 4060Ti" } },
          { href: "/collections/vga-rtx-4060", text: "RTX 4060 (8GB)", filters: { category: "6", vga: "RTX 4060" } },
          { href: "/collections/vga-rtx-ampere-3060-12gb", text: "RTX 3060 (12GB)", filters: { category: "6", vga: "RTX 3060" } },
          { href: "/collections/vga-rtx-ampere-3050", text: "RTX 3050 (6 - 8GB)", filters: { category: "6", vga: "RTX 3050" } },
          { href: "/collections/vga-gtx-1650-4g", text: "GTX 1650 (4GB)", filters: { category: "6", vga: "GTX 1650" } },
          { href: "/collections/gt-710-gt-1030-gtx-1050-ti", text: "GT 710 / GT 1030 (2-4GB)", filters: { category: "6", vga: "GT 710" } },
        ],
      },
      {
        name: "VGA - Card màn hình",
        nameHref: "/collections/vga-card-man-hinh",
        filters: [
          { href: "/collections/nvidia-quadro", text: "NVIDIA Quadro", filters: { category: "6", vga: "nvidia quadro" } },
          { href: "/collections/radeon-rx", text: "AMD Radeon", filters: { category: "6", vga: "amd radeon" } },
        ],
      },
      {
        name: "Bo mạch chủ Intel",
        nameHref: "/collections/mainboard-bo-mach-chu",
        filters: [
          { href: "/collections/mainboard-intel-z890", text: "Z890 (Mới)", filters: { category: "6", series: "z890", cpu: "intel" } },
          { href: "/collections/mainboard-intel-z790-raptor-lake", text: "Z790", filters: { category: "6", series: "z790", cpu: "intel" } },
          { href: "/collections/mainboard-intel-b760-raptor-lake", text: "B760", filters: { category: "6", series: "b760", cpu: "intel" } },
          { href: "/collections/mainboard-intel-h610-alder-lake", text: "H610", filters: { category: "6", series: "h610", cpu: "intel" } },
          { href: "/collections/mainboard-x299x-lga2066", text: "X299X", filters: { category: "6", series: "x299x", cpu: "intel" } },
          { href: "/collections/mainboard-bo-mach-chu", text: "Xem tất cả", filters: { category: "6", cpu: "intel" } },
        ],
      },
      {
        name: "Bo mạch chủ AMD",
        nameHref: "/collections/mainboard-bo-mach-chu",
        filters: [
          { href: "/collections/mainboard-amd-x870", text: "AMD X870 (Mới)", filters: { category: "6", series: "x870", cpu: "amd" } },
          { href: "/collections/mainboard-amd-x670", text: "AMD X670", filters: { category: "6", series: "x670", cpu: "amd" } },
          { href: "/collections/mainboard-ryzen-x570", text: "AMD X570", filters: { category: "6", series: "x570", cpu: "amd ryzen" } },
          { href: "/collections/mainboard-amd-b650", text: "AMD B650 (Mới)", filters: { category: "6", series: "b650", cpu: "amd" } },
          { href: "/collections/main-amd-ryzen-b550-socket-am4", text: "AMD B550", filters: { category: "6", series: "b550", cpu: "amd ryzen" } },
          { href: "/collections/main-amd-ryzen-a320-socket-am4", text: "AMD A320", filters: { category: "6", series: "a320", cpu: "amd ryzen" } },
          { href: "/collections/main-amd-ryzen-trx40-socket-str4", text: "AMD TRX40", filters: { category: "6", series: "trx40", cpu: "amd ryzen" } },
        ],
      },
      {
        name: "CPU - Bộ vi xử lý Intel",
        nameHref: "/collections/cpu-bo-vi-xu-ly?hang=intel",
        filters: [
          { href: "/collections/cpu-intel-core-ultra-series-2", text: "CPU Intel Core Ultra Series 2 (Mới)", filters: { category: "6", cpu: "intel core ultra series 2" } },
          { href: "/collections/cpu-intel-core-i9", text: "CPU Intel 9", filters: { category: "6", cpu: "intel core i9" } },
          { href: "/collections/cpu-intel-core-i7", text: "CPU Intel 7", filters: { category: "6", cpu: "intel core i7" } },
          { href: "/collections/cpu-intel-core-i5", text: "CPU Intel 5", filters: { category: "6", cpu: "intel core i5" } },
          { href: "/collections/cpu-intel-core-i3", text: "CPU Intel 3", filters: { category: "6", cpu: "intel core i3" } },
        ],
      },
      {
        name: "CPU - Bộ vi xử lý AMD",
        nameHref: "/collections/cpu-amd-ryzen",
        filters: [
          { href: "/collections/cpu-bo-vi-xu-ly?dongcpu=athlon", text: "CPU AMD Athlon", filters: { category: "6", cpu: "amd athlon" } },
          { href: "/collections/cpu-amd-ryzen-3", text: "CPU AMD R3", filters: { category: "6", cpu: "amd ryzen 3" } },
          { href: "/collections/cpu-amd-ryzen-5", text: "CPU AMD R5", filters: { category: "6", cpu: "amd ryzen 5" } },
          { href: "/collections/cpu-amd-ryzen-7", text: "CPU AMD R7", filters: { category: "6", cpu: "amd ryzen 7" } },
          { href: "/collections/cpu-amd-ryzen-9", text: "CPU AMD R9", filters: { category: "6", cpu: "amd ryzen 9" } },
        ],
      },
    ],
  },
  {
    title: "Case, Nguồn, Tản",
    href: "#",
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="19" width="18" height="10" rx="1" transform="rotate(-90 1 19)" stroke="currentcolor"/><path d="M13 3H17C18.1046 3 19 3.89543 19 5V13C19 14.1046 18.1046 15 17 15H13" stroke="currentcolor"/><path d="M16.5 18.5C16.7761 18.5 17 18.2761 17 18C17 17.7239 16.7761 17.5 16.5 17.5V18.5ZM13 18.5H16.5V17.5H13V18.5Z" fill="currentcolor"/><circle cx="6" cy="5" r="1" fill="currentcolor"/><circle cx="6" cy="9" r="1" fill="currentcolor"/></svg>',
    subItems: [
      {
        name: "Case - Theo hãng",
        nameHref: "/collections/case-thung-may-tinh",
        filters: [
          { href: "/collections/case-asus", text: "Case ASUS", filters: { category: "7", brand: "asus" } },
          { href: "/collections/case-corsair", text: "Case Corsair", filters: { category: "7", brand: "corsair" } },
          { href: "/collections/case-lian-li", text: "Case Lianli", filters: { category: "7", brand: "lian li" } },
          { href: "/collections/case-thung-may-tinh", text: "Xem tất cả", filters: { category: "7" } },
        ],
      },
      {
        name: "Case - Theo giá",
        nameHref: "/collections/case-thung-may-tinh",
        filters: [
          { href: "/collections/case-duoi-1-trieu", text: "Dưới 1 triệu", filters: { category: "7", price: "0-1000000" } },
          { href: "/collections/case-tu-1-trieu-den-2-trieu", text: "Từ 1 triệu đến 2 triệu", filters: { category: "7", price: "1000000-2000000" } },
          { href: "/collections/case-tren-2-trieu", text: "Trên 2 triệu", filters: { category: "7", price: "2000000-999999999" } },
          { href: "/collections/case-thung-may-tinh", text: "Xem tất cả", filters: { category: "7" } },
        ],
      },
      {
        name: "Nguồn - Theo Hãng",
        nameHref: "/collections/psu-nguon-may-tinh",
        filters: [
          { href: "/collections/nguon-may-tinh-asus", text: "Nguồn ASUS", filters: { category: "7", brand: "asus", psu: "asus" } },
          { href: "/collections/psu-nguon-may-tinh?hang=deepcool", text: "Nguồ̀n DeepCool", filters: { category: "7", brand: "deepcool", psu: "deepcool" } },
          { href: "/collections/nguon-corsair", text: "Nguồn Corsair", filters: { category: "7", brand: "corsair", psu: "corsair" } },
          { href: "/collections/psu-nguon-may-tinh", text: "Xem tất cả", filters: { category: "7" } },
        ],
      },
      {
        name: "Nguồn - Theo công suất",
        nameHref: "/collections/psu-nguon-may-tinh",
        filters: [
          { href: "/collections/400-500w", text: "Từ 400w - 500w", filters: { category: "7", psu: "400-500w" } },
          { href: "/collections/500-600w", text: "Từ 500w - 600w", filters: { category: "7", psu: "500-600w" } },
          { href: "/collections/700w-800w", text: "Từ 700w - 800w", filters: { category: "7", psu: "700-800w" } },
          { href: "/collections/psu-nguon-may-tinh", text: "Xem tất cả", filters: { category: "7" } },
        ],
      },
      {
        name: "Phụ kiện PC",
        nameHref: "/collections/phu-kien-may-tinh",
        filters: [
          { href: "/collections/phu-kien-may-tinh?loaisanpham=dayledganpc", text: "Dây LED", filters: { category: "7" } },
          { href: "/collections/phu-kien-may-tinh?loaisanpham=giadovga", text: "Giá đỡ VGA", filters: { category: "7" } },
          { href: "/collections/phu-kien-may-tinh?loaisanpham=keotannhiet", text: "Keo tản nhiệt", filters: { category: "7" } },
          { href: "/collections/phu-kien-may-tinh", text: "Xem tất cả", filters: { category: "7" } },
        ],
      },
      {
        name: "Loại tản nhiệt",
        nameHref: "/collections/tan-nhiet-may-tinh",
        filters: [
          { href: "/collections/tan-nhiet-nuoc-240mm", text: "Tản nhiệt AIO", filters: { category: "7" } },
          { href: "/collections/tan-nhiet-khi", text: "Tản nhiệt khí", filters: { category: "7" } },
          { href: "/collections/fan-rgb-tan-nhiet-pc", text: "Fan RGB", filters: { category: "7" } },
          { href: "/collections/fan-rgb-tan-nhiet-pc", text: "Xem tất cả", filters: { category: "7" } },
        ],
      },
    ],
  },
  {
    title: "Ổ cứng, RAM, Thẻ nhớ",
    href: "#",
    icon: '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 1C18.5523 1 19 1.44772 19 2L19 3.5C19 3.5 17.5 3.75127 17.5 5.5C17.5 7.24873 19 7.5 19 7.5L19 9C19 9.55229 18.5523 10 18 10L2 10C1.44772 10 1 9.55228 1 9L1 7.5C1 7.5 2.5 7.27709 2.5 5.5C2.5 3.72291 1 3.5 1 3.5L1 2C1 1.44771 1.44772 0.999999 2 0.999999L18 1Z" stroke="currentColor"></path><path d="M3 10H17V12C17 12.5523 16.5523 13 16 13H4C3.44772 13 3 12.5523 3 12V10Z" stroke="currentColor"></path><rect x="5" y="3" width="1" height="5" fill="currentColor"></rect><rect x="5" y="10" width="1" height="3" fill="currentColor"></rect><rect x="8" y="10" width="1" height="3" fill="currentColor"></rect><rect x="11" y="10" width="1" height="3" fill="currentColor"></rect><rect x="14" y="10" width="1" height="3" fill="currentColor"></rect><rect x="9.5" y="3" width="1" height="5" fill="currentColor"></rect><rect x="14" y="3" width="1" height="5" fill="currentColor"></rect></svg>',
    subItems: [
      {
        name: "Dung lượng RAM",
        nameHref: "/collections/ram-pc",
        filters: [
          { href: "/collections/ddr4-8gb", text: "8 GB", filters: { category: "8", ram: "8gb" } },
          { href: "/collections/ddr4-16g", text: "16 GB", filters: { category: "8", ram: "16gb" } },
          { href: "/collections/ddr4-32gb", text: "32 GB", filters: { category: "8", ram: "32gb" } },
          { href: "/collections/ram-ddr5-64gb", text: "64 GB", filters: { category: "8", ram: "64gb" } },
          { href: "/collections/ram-pc", text: "Xem tất cả", filters: { category: "8" } },
        ],
      },
      {
        name: "Loại RAM",
        nameHref: "/collections/ram-pc",
        filters: [
          { href: "/collections/ram-ddr4", text: "DDR4", filters: { category: "8", ram: "ddr4" } },
          { href: "/collections/ram-pc-ddr5", text: "DDR5", filters: { category: "8", ram: "ddr5" } },
          { href: "/collections/ram-pc", text: "Xem tất cả", filters: { category: "8" } },
        ],
      },
      {
        name: "Hãng RAM",
        nameHref: "/collections/ram-pc",
        filters: [
          { href: "/collections/ram-pc?hang=corsair", text: "Corsair", filters: { category: "8", brand: "corsair" } },
          { href: "/collections/ram-pc?hang=kingston", text: "Kingston", filters: { category: "8", brand: "kingston" } },
          { href: "/collections/ram-pc?hang=gskill", text: "G.Skill", filters: { category: "8", brand: "gskill" } },
          { href: "/collections/ram-pc?hang=pny", text: "PNY", filters: { category: "8", brand: "pny" } },
          { href: "/collections/ram-pc", text: "Xem tất cả", filters: { category: "8" } },
        ],
      },
      {
        name: "Dung lượng HDD",
        nameHref: "/collections/hdd-o-cung-pc",
        filters: [
          { href: "/collections/hdd-1tb", text: "HDD 1 TB", filters: { category: "8", ssd: "1tb" } },
          { href: "/collections/hdd-2tb", text: "HDD 2 TB", filters: { category: "8", ssd: "2tb" } },
          { href: "/collections/hdd-6tb", text: "HDD 4 TB - 6 TB", filters: { category: "8", ssd: "4tb-6tb" } },
          { href: "/collections/hdd-8tb", text: "HDD trên 8 TB", filters: { category: "8", ssd: "8tb" } },
          { href: "/collections/hdd-o-cung-pc", text: "Xem tất cả", filters: { category: "8" } },
        ],
      },
      {
        name: "Hãng HDD",
        nameHref: "/collections/hdd-o-cung-pc",
        filters: [
          { href: "/collections/hdd-wd", text: "WesterDigital", filters: { category: "8", brand: "western digital" } },
          { href: "/collections/hdd-seagate", text: "Seagate", filters: { category: "8", brand: "seagate" } },
          { href: "/collections/hdd-o-cung-pc?hang=toshiba", text: "Toshiba", filters: { category: "8", brand: "toshiba" } },
          { href: "/collections/hdd-o-cung-pc", text: "Xem tất cả", filters: { category: "8" } },
        ],
      },
      {
        name: "Dung lượng SSD",
        nameHref: "/collections/ssd-o-cung-the-ran",
        filters: [
          { href: "/collections/ssd-120g", text: "120GB - 128GB", filters: { category: "8", ssd: "120gb-128gb" } },
          { href: "/collections/ssd-o-cung-the-ran?dungluong=240256gb", text: "250GB - 256GB", filters: { category: "8", ssd: "250gb-256gb" } },
          { href: "/collections/ssd-480-512gb", text: "480GB - 512GB", filters: { category: "8", ssd: "480gb-512gb" } },
          { href: "/collections/ssd-1tb", text: "960GB - 1TB", filters: { category: "8", ssd: "1tb" } },
          { href: "/collections/ssd-o-cung-the-ran?dungluong=2tb", text: "2TB", filters: { category: "8", ssd: "2tb" } },
          { href: "/collections/ssd-o-cung-the-ran?dungluong=tren2tb", text: "Trên 2TB", filters: { category: "8", ssd: "tren2tb" } },
          { href: "/collections/ssd-o-cung-the-ran", text: "Xem tất cả", filters: { category: "8" } },
        ],
      },
      {
        name: "Hãng SSD",
        nameHref: "/collections/ssd-o-cung-the-ran",
        filters: [
          { href: "/collections/ssd-samsung", text: "Samsung", filters: { category: "8", brand: "samsung" } },
          { href: "/collections/ssd-wd", text: "Wester Digital", filters: { category: "8", brand: "western digital" } },
          { href: "/collections/kingston-ssd", text: "Kingston", filters: { category: "8", brand: "kingston" } },
          { href: "/collections/ssd-o-cung-the-ran?hang=corsair", text: "Corsair", filters: { category: "8", brand: "corsair" } },
          { href: "/collections/ssd-pny", text: "PNY", filters: { category: "8", brand: "pny" } },
          { href: "/collections/ssd-o-cung-the-ran", text: "Xem tất cả", filters: { category: "8" } },
        ],
      },
      {
        name: "Thẻ nhớ / USB",
        nameHref: "/collections/the-nho",
        filters: [
          { href: "/collections/the-nho-usb-sandisk", text: "Sandisk", filters: { category: "8", brand: "sandisk" } },
        ],
      },
      {
        name: "Ổ cứng di động",
        nameHref: "/collections/o-cung-di-dong-hdd-box",
        filters: [
          // Nếu có thêm item, thêm ở đây. Hiện tại rỗng, nên không thêm.
        ],
      },
    ],
  },
  {
    title: "Màn hình",
    href: "/collections/man-hinh",
    icon: '<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1.03226C1.44772 1.03226 1 1.47997 1 2.03226V10.3548C1 10.9071 1.44772 11.3548 2 11.3548H16C16.5523 11.3548 17 10.9071 17 10.3548V2.03226C17 1.47997 16.5523 1.03226 16 1.03226H2ZM2 0H16C16.5304 0 17.0391 0.217511 17.4142 0.604683C17.7893 0.991854 18 1.51697 18 2.06452V10.3226C18 10.8701 17.7893 11.3952 17.4142 11.7824C17.0391 12.1696 16.5304 12.3871 16 12.3871H2C1.46957 12.3871 0.960859 12.1696 0.585786 11.7824C0.210714 11.3952 0 10.8701 0 10.3226V2.06452C0 1.51697 0.210714 0.991854 0.585786 0.604683C0.960859 0.217511 1.46957 0 2 0Z" fill="currentcolor"/><rect x="8" y="11.871" width="2" height="4.12903" fill="currentcolor"/><path d="M5 15.4839L13 15.4839" stroke="currentcolor" stroke-linecap="round"/></svg>',
    subItems: [
      {
        name: "Hãng sản xuất",
        nameHref: "/collections/man-hinh",
        filters: [
          { href: "/collections/monitor-lg", text: "LG", filters: { category: "3", brand: "lg" } },
          { href: "/collections/man-hinh-asus", text: "Asus", filters: { category: "3", brand: "asus" } },
          { href: "/collections/man-hinh-viewsonic", text: "ViewSonic", filters: { category: "3", brand: "viewsonic" } },
          { href: "/collections/man-hinh-dell", text: "Dell", filters: { category: "3", brand: "dell" } },
          { href: "/collections/man-hinh-gigabyte", text: "Gigabyte", filters: { category: "3", brand: "gigabyte" } },
          { href: "/collections/man-hinh-aoc", text: "AOC", filters: { category: "3", brand: "aoc" } },
          { href: "/collections/man-hinh-acer", text: "Acer", filters: { category: "3", brand: "acer" } },
          { href: "/collections/hkc", text: "HKC", filters: { category: "3", brand: "hkc" } },
        ],
      },
      {
        name: "Hãng sản xuất",
        nameHref: "/collections/man-hinh",
        filters: [
          { href: "/collections/man-hinh-msi", text: "MSI", filters: { category: "3", brand: "msi" } },
          { href: "/collections/man-hinh-lenovo", text: "Lenovo", filters: { category: "3", brand: "lenovo" } },
          { href: "/collections/man-hinh-samsung", text: "Samsung", filters: { category: "3", brand: "samsung" } },
          { href: "/collections/man-hinh-philips", text: "Philips", filters: { category: "3", brand: "philips" } },
          { href: "/collections/man-hinh-e-dra/", text: "E-Dra", filters: { category: "3", brand: "e-dra" } },
          { href: "/collections/man-hinh-dahua", text: "Dahua", filters: { category: "3", brand: "dahua" } },
          { href: "/collections/man-hinh-koorui", text: "KOORUI", filters: { category: "3", brand: "koorui" } },
        ],
      },
      {
        name: "Giá tiền",
        nameHref: "/collections/man-hinh",
        filters: [
          { href: "/collections/man-hinh-duoi-5-trieu", text: "Dưới 5 triệu", filters: { category: "3", price: "0-5000000" } },
          { href: "/collections/man-hinh-tu-5-den-10-trieu", text: "Từ 5 triệu đến 10 triệu", filters: { category: "3", price: "5000000-10000000" } },
          { href: "/collections/man-hinh-tu-10-den-20-trieu", text: "Từ 10 triệu đến 20 triệu", filters: { category: "3", price: "10000000-20000000" } },
          { href: "/collections/man-hinh-tu-20-trieu-den-30-trieu", text: "Từ 20 triệu đến 30 triệu", filters: { category: "3", price: "20000000-30000000" } },
          { href: "/collections/man-hinh-tren-30-trieu", text: "Trên 30 triệu", filters: { category: "3", price: "30000000-999999999" } },
        ],
      },
      {
        name: "Độ Phân giải",
        nameHref: "/collections/man-hinh",
        filters: [
          { href: "/collections/do-phan-giai-full-hd-1080p", text: "Màn hình Full HD", filters: { category: "3", resolution: "full hd" } },
          { href: "/collections/do-phan-giai-2k-1440p", text: "Màn hình 2K 1440p", filters: { category: "3", resolution: "2k" } },
          { href: "/collections/man-hinh-may-tinh-4k-uhd", text: "Màn hình 4K UHD", filters: { category: "3", resolution: "4k" } },
          { href: "/collections/man-hinh-may-tinh-6k", text: "Màn hình 6K", filters: { category: "3", resolution: "6k" } },
        ],
      },
      {
        name: "Tần số quét",
        nameHref: "/collections/man-hinh-144hz",
        filters: [
          { href: "/collections/man-hinh-60hz", text: "60Hz", filters: { category: "3" } },
          { href: "/collections/man-hinh-75hz", text: "75Hz", filters: { category: "3" } },
          { href: "/collections/man-hinh-100hz", text: "100Hz", filters: { category: "3" } },
          { href: "/collections/man-hinh-144hz", text: "144Hz", filters: { category: "3" } },
          { href: "/collections/man-hinh-240hz", text: "240Hz", filters: { category: "3" } },
        ],
      },
      {
        name: "Màn hình cong",
        nameHref: "/collections/man-hinh-cong",
        filters: [
          { href: "/collections/24-curve", text: "24\" Curved", filters: { category: "3", screenSize: '24"' } },
          { href: "/collections/27-curve", text: "27\" Curved", filters: { category: "3", screenSize: '27"' } },
          { href: "/collections/32-curve", text: "32\" Curved", filters: { category: "3", screenSize: '32"' } },
          { href: "/collections/tren-32-curve", text: "Trên 32\" Curved", filters: { category: "3", screenSize: "tren32" } },
        ],
      },
      {
        name: "Kích thước",
        nameHref: "/collections/man-hinh",
        filters: [
          { href: "/collections/man-hinh-22-inch", text: "Màn hình 22\"", filters: { category: "3", screenSize: '22"' } },
          { href: "/collections/man-hinh-24-inch", text: "Màn hình 24\"", filters: { category: "3", screenSize: '24"' } },
          { href: "/collections/man-hinh-27-inch", text: "Màn hình 27\"", filters: { category: "3", screenSize: '27"' } },
          { href: "/collections/man-hinh-29", text: "Màn hình 29\"", filters: { category: "3", screenSize: '29"' } },
          { href: "/collections/man-hinh-32", text: "Màn hình 32\"", filters: { category: "3", screenSize: '32"' } },
          { href: "/collections/man-hinh-tren-32", text: "Màn hình Trên 32\"", filters: { category: "3", screenSize: "tren32" } },
          { href: "/collections/man-hinh-co-chuan-vesa-treo-tuong", text: "Hỗ trợ giá treo (VESA)", filters: { category: "3" } },
        ],
      },
      {
        name: "Màn hình đồ họa",
        nameHref: "/collections/man-hinh-do-hoa",
        filters: [
          { href: "/collections/man-hinh-do-hoa-24-inch", text: "Màn hình đồ họa 24\"", filters: { category: "3", screenSize: '24"', usage: "đồ họa" } },
          { href: "/collections/man-hinh-do-hoa-27-inch", text: "Màn hình đồ họa 27\"", filters: { category: "3", screenSize: '27"', usage: "đồ họa" } },
          { href: "/collections/man-hinh-do-hoa-32-inch", text: "Màn hình đồ họa 32\"", filters: { category: "3", screenSize: '32"', usage: "đồ họa" } },
        ],
      },
      {
        name: "Phụ kiện màn hình",
        nameHref: "/collections/phu-kien-man-hinh",
        filters: [
          { href: "/collections/gia-treo-man-hinh", text: "Giá treo màn hình", filters: { category: "3" } },
          { href: "/collections/phu-kien-day-cap-hdmi-dp-lan-usbc", text: "Phụ kiện dây HDMI,DP,LAN", filters: { category: "3" } },
        ],
      },
      {
        name: "Màn hình di động",
        nameHref: "/collections/man-hinh-di-dong",
        filters: [
          { href: "/collections/man-hinh-di-dong-do-phan-giai-full-hd-1080p", text: "Full HD 1080p", filters: { category: "3", resolution: "full hd" } },
          { href: "/collections/man-hinh-di-dong-do-phan-giai-2k-1440p", text: "2K 1440p", filters: { category: "3", resolution: "2k" } },
          { href: "/collections/man-hinh-di-dong-co-cam-ung", text: "Có cảm ứng", filters: { category: "3" } },
        ],
      },
      {
        name: "Màn hình Oled",
        nameHref: "/collections/man-hinh-oled",
        filters: [
          // Nếu có thêm item, thêm ở đây. Hiện tại rỗng, nên không thêm.
        ],
      },
    ],
  },
  {
    title: "Bàn phím",
    href: "/collections/ban-phim-may-tinh",
    icon: '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="18" height="12" rx="1" stroke="currentcolor"/><rect x="4" y="8" width="7" height="2" fill="currentcolor"/><rect x="4" y="4" width="2" height="2" fill="currentcolor"/><rect x="9" y="4" width="2" height="2" fill="currentcolor"/><rect x="14" y="4" width="2" height="2" fill="currentcolor"/><rect x="14" y="8" width="2" height="2" fill="currentcolor"/></svg>',
    subItems: [
      {
        name: "Thương hiệu",
        nameHref: "/collections/ban-phim-may-tinh",
        filters: [
          { href: "/collections/ban-phim-akko", text: "AKKO", filters: { category: "4", brand: "akko" } },
          { href: "/collections/ban-phim-aula", text: "AULA", filters: { category: "4", brand: "aula" } },
          { href: "/collections/ban-phim-dare-u", text: "Dare-U", filters: { category: "4", brand: "dare-u" } },
          { href: "/collections/ban-phim-ikbc-durgod", text: "Durgod", filters: { category: "4", brand: "durgod" } },
          { href: "/collections/ban-phim-leobog", text: "Leobog", filters: { category: "4", brand: "leobog" } },
          { href: "/collections/ban-phim-keychron", text: "Keychron", filters: { category: "4", brand: "keychron" } },
          { href: "/collections/ban-phim-co-fl-esports", text: "FL-Esports", filters: { category: "4", brand: "fl-esports" } },
          { href: "/collections/ban-phim-choi-game-corsair", text: "Corsair", filters: { category: "4", brand: "corsair" } },
          { href: "/collections/ban-phim-e-dra", text: "E-Dra", filters: { category: "4", brand: "e-dra" } },
          { href: "/collections/ban-phim-cidoo", text: "Cidoo", filters: { category: "4", brand: "cidoo" } },
          { href: "/collections/ban-phim-machenike", text: "Machenike", filters: { category: "4", brand: "machenike" } },
        ],
      },
      {
        name: "Thương hiệu",
        nameHref: "/collections/ban-phim-may-tinh",
        filters: [
          { href: "/collections/ban-phim-asus", text: "ASUS", filters: { category: "4", brand: "asus" } },
          { href: "/collections/ban-phim-logitech", text: "Logitech", filters: { category: "4", brand: "logitech" } },
          { href: "/collections/ban-phim-choi-game-razer", text: "Razer", filters: { category: "4", brand: "razer" } },
          { href: "/collections/ban-phim-leopold", text: "Leopold", filters: { category: "4", brand: "leopold" } },
          { href: "/collections/ban-phim-steelseries", text: "Steelseries", filters: { category: "4", brand: "steelseries" } },
          { href: "/collections/ban-phim-rapoo", text: "Rapoo", filters: { category: "4", brand: "rapoo" } },
          { href: "/collections/ban-phim-vgn", text: "VGN", filters: { category: "4", brand: "vgn" } },
          { href: "/collections/ban-phim-madlions", text: "MadLions", filters: { category: "4", brand: "madlions" } },
          { href: "/collections/ban-phim-skyloong", text: "SKYLOONG", filters: { category: "4", brand: "skyloong" } },
        ],
      },
      {
        name: "Giá tiền",
        nameHref: "/collections/ban-phim-co",
        filters: [
          { href: "/collections/ban-phim-duoi-1-trieu", text: "Dưới 1 triệu", filters: { category: "4", price: "0-1000000" } },
          { href: "/collections/ban-phim-1-den-2-trieu", text: "1 triệu - 2 triệu", filters: { category: "4", price: "1000000-2000000" } },
          { href: "/collections/ban-phim-2-den-3-trieu", text: "2 triệu - 3 triệu", filters: { category: "4", price: "2000000-3000000" } },
          { href: "/collections/ban-phim-tu-3-den-4-trieu", text: "3 triệu - 4 triệu", filters: { category: "4", price: "3000000-4000000" } },
          { href: "/collections/ban-phim-tren-4-trieu", text: "Trên 4 triệu", filters: { category: "4", price: "4000000-999999999" } },
        ],
      },
      {
        name: "Kết nối",
        nameHref: "/collections/ban-phim-co",
        filters: [
          { href: "/collections/ban-phim-bluetooth", text: "Bluetooth", filters: { category: "4", keyboardType: "bluetooth" } },
          { href: "/collections/ban-phim-wireless", text: "Wireless", filters: { category: "4", keyboardType: "wireless" } },
        ],
      },
      {
        name: "Phụ kiện bàn phím cơ",
        nameHref: "/collections/keycaps",
        filters: [
          { href: "/collections/keycaps", text: "Keycaps", filters: { category: "4" } },
          { href: "/collections/keycap-dwarf-factory", text: "Dwarf Factory", filters: { category: "4", brand: "dwarf factory" } },
          { href: "/collections/ke-tay", text: "Kê tay", filters: { category: "4" } },
        ],
      },
      {
        name: "Bàn phím Rapid Trigger",
        nameHref: "/collections/ban-phim-rapid-trigger",
        filters: [
          // Nếu có thêm item, thêm ở đây. Hiện tại rỗng, nên không thêm.
        ],
      },
    ],
  },
  {
    title: "Chuột + Lót chuột",
    href: "/collections/chuot-may-tinh",
    icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 14 20" width="18" height="20" xml:space="preserve"><style type="text/css">.st0{fill:currentcolor;}</style><path class="st0" d="M7,19.5L7,19.5c-3.6,0-6.5-3.1-6.5-6.8V7.3c0-3.7,2.9-6.8,6.5-6.8c3.6,0,6.5,3.1,6.5,6.8v5.4 C13.5,16.4,10.6,19.5,7,19.5z M7,1.5C4,1.5,1.5,4.1,1.5,7.3v5.4c0,3.2,2.5,5.8,5.5,5.8h0c3,0,5.5-2.6,5.5-5.8V7.3 C12.5,4.1,10,1.5,7,1.5z"/><path class="st0" d="M7,10L7,10c-0.3,0-0.5-0.2-0.5-0.5v-5C6.5,4.2,6.7,4,7,4h0c0.3,0,0.5,0.2,0.5,0.5v5C7.5,9.8,7.3,10,7,10z"/></svg>',
    subItems: [
      {
        name: "Thương hiệu chuột",
        nameHref: "/collections/chuot-may-tinh",
        filters: [
          { href: "/collections/chuot-logitech", text: "Logitech", filters: { category: "5", brand: "logitech" } },
          { href: "/collections/chuot-razer", text: "Razer", filters: { category: "5", brand: "razer" } },
          { href: "/collections/chuot-corsair", text: "Corsair", filters: { category: "5", brand: "corsair" } },
          { href: "/collections/chuot-pulsar", text: "Pulsar", filters: { category: "5", brand: "pulsar" } },
          { href: "/collections/chuot-microsoft", text: "Microsoft", filters: { category: "5", brand: "microsoft" } },
          { href: "/collections/chuot-dare-u", text: "Dare U", filters: { category: "5", brand: "dare u" } },
        ],
      },
      {
        name: "Thương hiệu chuột",
        nameHref: "/collections/chuot-may-tinh",
        filters: [
          { href: "/collections/chuot-asus", text: "ASUS", filters: { category: "5", brand: "asus" } },
          { href: "/collections/chuot-steelseries", text: "Steelseries", filters: { category: "5", brand: "steelseries" } },
          { href: "/collections/chuot-glorious", text: "Glorious", filters: { category: "5", brand: "glorious" } },
          { href: "/collections/chuot-rapoo", text: "Rapoo", filters: { category: "5", brand: "rapoo" } },
          { href: "/collections/chuot-hyperx", text: "HyperX", filters: { category: "5", brand: "hyperx" } },
          { href: "/collections/chuot-atk", text: "ATK", filters: { category: "5", brand: "atk" } },
        ],
      },
      {
        name: "Chuột theo giá tiền",
        nameHref: "/collections/chuot-may-tinh",
        filters: [
          { href: "/collections/chuot-duoi-500-nghin", text: "Dưới 500 nghìn", filters: { category: "5", price: "0-500000" } },
          { href: "/collections/chuot-500-nghin-den-1-trieu", text: "Từ 500 nghìn - 1 triệu", filters: { category: "5", price: "500000-1000000" } },
          { href: "/collections/chuot-1-den-2-trieu", text: "Từ 1 triệu - 2 triệu", filters: { category: "5", price: "1000000-2000000" } },
          { href: "/collections/chuot-2-den-3-trieu", text: "Trên 2 triệu - 3 triệu", filters: { category: "5", price: "2000000-3000000" } },
          { href: "/collections/chuot-tren-3-trieu", text: "Trên 3 triệu", filters: { category: "5", price: "3000000-999999999" } },
        ],
      },
      {
        name: "Loại Chuột",
        nameHref: "#",
        filters: [
          { href: "/collections/chuot-may-tinh/", text: "Chuột chơi game", filters: { category: "5", usage: "gaming" } },
          { href: "/collections/chuot-van-phong/", text: "Chuột văn phòng", filters: { category: "5", usage: "văn phòng" } },
        ],
      },
      {
        name: "Logitech",
        nameHref: "/collections/chuot-logitech",
        filters: [
          { href: "/collections/chuot-logitech-gaming", text: "Logitech Gaming", filters: { category: "5", brand: "logitech", usage: "gaming" } },
          { href: "/collections/chuot-logitech-van-phong", text: "Logitech Văn phòng", filters: { category: "5", brand: "logitech", usage: "văn phòng" } },
        ],
      },
      {
        name: "Thương hiệu lót chuột",
        nameHref: "/collections/mouse-pad",
        filters: [
          { href: "/collections/mouse-pad?hang=gtn", text: "GTN", filters: { category: "5", brand: "gtn" } },
          { href: "/collections/lot-chuot-asus", text: "ASUS", filters: { category: "5", brand: "asus" } },
          { href: "/collections/lot-chuot-steelseries", text: "Steelseries", filters: { category: "5", brand: "steelseries" } },
          { href: "/collections/lot-chuot-dare-u", text: "Dare-U", filters: { category: "5", brand: "dare-u" } },
          { href: "/collections/lot-chuot-razer", text: "Razer", filters: { category: "5", brand: "razer" } },
        ],
      },
      {
        name: "Các loại lót chuột",
        nameHref: "/collections/mouse-pad",
        filters: [
          { href: "/collections/lot-chuot-mem", text: "Mềm", filters: { category: "5" } },
          { href: "/collections/lot-chuot-cung", text: "Cứng", filters: { category: "5" } },
          { href: "/collections/lot-chuot-day", text: "Dày", filters: { category: "5" } },
          { href: "/collections/lot-chuot-mong", text: "Mỏng", filters: { category: "5" } },
          { href: "/collections/lot-chuot-co-led", text: "Viền có led", filters: { category: "5" } },
        ],
      },
      {
        name: "Lót chuột theo size",
        nameHref: "/collections/mouse-pad",
        filters: [
          { href: "/collections/lot-chuot-kich-thuoc-nho", text: "Nhỏ", filters: { category: "5" } },
          { href: "/collections/lot-chuot-kich-thuoc-vua", text: "Vừa", filters: { category: "5" } },
          { href: "/collections/lot-chuot-kich-thuoc-lon", text: "Lớn", filters: { category: "5" } },
        ],
      },
    ],
  },
];