// const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

// function buildUrl(path: string) {
//   if (typeof window === 'undefined') {
//     return `${BASE}${path}`;   
//   }
//   return path.replace(/^\/api\//, '/_api/');
// }

// export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
//   const url = buildUrl(path);
//   const res = await fetch(url, {
//     ...init,
//     headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
//     cache: 'no-store',
//   });
//   if (!res.ok) throw new Error(`API ${path} ${res.status} ${res.statusText}`);
//   return res.json() as Promise<T>;
// }

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

function buildUrl(path: string) {
  if (typeof window === 'undefined') {
    return `${BASE}${path}`;   
  }
  return path.replace(/^\/api\//, '/_api/');
}

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    next: { revalidate: 300 }, 
  });
  if (!res.ok) throw new Error(`API ${path} ${res.status} ${res.statusText}`);
  console.log(`Fetched API: ${path}`);
  return res.json() as Promise<T>;
}

export const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(async (r) => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
  });

export function buildClientUrl(path: string) {
  return path.replace(/^\/api\//, '/_api/');
}

// GHN API: Tính phí vận chuyển
// GHN API: Tự động lấy district_id và ward_code từ địa chỉ user
export async function calculateGHNShippingFee({toAddress, weight = 5000, length = 20, width = 20, height = 20}) {
  const GHN_TOKEN = '3af78b24-ce07-11f0-9ca3-9e851f00bd99';
  const SHOP_ID = '6142292';
  // Shop address (cố định, cần chỉnh đúng nếu thay đổi)
  const fromDistrictId = 1616; // Quận 1, TP.HCM
  const fromWardCode = '20313'; // Phường Bến Nghé


  // Bước 1: Tách địa chỉ user
  let wardName = '';
  const wardMatch = toAddress.match(/phường\s+([^,]+)/i);
  if (wardMatch) wardName = wardMatch[1].trim();

  let districtName = '';
  const districtMatch = toAddress.match(/(quận|huyện|thành phố|thủ đức)\s+([^,]+)/i);
  if (districtMatch) {
    districtName = districtMatch[2].trim();
  } else if (toAddress.toLowerCase().includes('thủ đức')) {
    districtName = 'Thủ Đức';
  }

  let provinceName = '';
  // Ưu tiên lấy "tỉnh ..." hoặc "thành phố ..." cuối chuỗi
  const provinceMatch = toAddress.match(/(tỉnh|thành phố)\s+([^,]+)$/i);
  if (provinceMatch) provinceName = provinceMatch[2].trim();
  else provinceName = 'Hồ Chí Minh';

  console.log('GHN DEBUG:', { toAddress, wardName, districtName, provinceName });

  // Bước 2: Lấy danh sách tỉnh/thành phố
  const provinceRes = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Token': GHN_TOKEN,
    },
  });
  const provinceData = await provinceRes.json();
  const provinces = provinceData.data || [];
  let provinceId = '';
  for (const p of provinces) {
    if (p.ProvinceName.toLowerCase().includes(provinceName.toLowerCase())) {
      provinceId = p.ProvinceID;
      break;
    }
  }
  if (!provinceId) throw new Error('Không tìm được mã tỉnh/thành');

  // Bước 3: Lấy danh sách quận/huyện theo tỉnh/thành phố
  const districtRes = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': GHN_TOKEN,
    },
    body: JSON.stringify({ province_id: provinceId }),
  });
  const districtData = await districtRes.json();
  const districts = districtData.data || [];
  console.log('GHN DEBUG: districts', districts);
  // Tìm district_id
  let toDistrictId = '';
  for (const d of districts) {
    if (d.DistrictName.toLowerCase().includes(districtName.toLowerCase())) {
      toDistrictId = d.DistrictID;
      break;
    }
  }
  console.log('GHN DEBUG: districtId', toDistrictId, 'districtName', districtName);
  if (!toDistrictId) throw new Error('Không tìm được mã quận/huyện');

  // Bước 3: Lấy danh sách phường/xã theo quận/huyện
  const wardRes = await fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': GHN_TOKEN,
    },
    body: JSON.stringify({ district_id: toDistrictId }),
  });
  const wardData = await wardRes.json();
  const wards = wardData.data || [];
  console.log('GHN DEBUG: wards', wards);
  // Tìm ward_code
  let toWardCode = '';
  for (const w of wards) {
    if (w.WardName.toLowerCase().includes(wardName.toLowerCase())) {
      toWardCode = w.WardCode;
      break;
    }
  }
  console.log('GHN DEBUG: wardCode', toWardCode, 'wardName', wardName);
  if (!toWardCode) throw new Error('Không tìm được mã phường/xã');

  // Bước 4: Tính phí ship
  const url = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
  const body = {
    from_district_id: fromDistrictId,
    from_ward_code: fromWardCode,
    to_district_id: toDistrictId,
    to_ward_code: toWardCode,
    service_type_id: 2, // Tiêu chuẩn
    insurance_value: 0,
    coupon: null,
    weight, // GHN yêu cầu trường weight ở cấp cao nhất
    length,
    width,
    height,
    items: [
      {
        quantity: 1,
        weight,
        length,
        width,
        height,
      },
    ],
  };
  console.log('GHN DEBUG: fee body', body);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': GHN_TOKEN,
      'ShopId': SHOP_ID,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log('GHN DEBUG: fee response', data);
  if (!res.ok || !data.data) throw new Error('GHN fee API error');
  return data.data.total;
}