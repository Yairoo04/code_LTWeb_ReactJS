export default function handler(req, res) {
  const products = [
    {
      name: 'Màn hình Viewsonic 24"',
      image: '/image/product/acer_kg240y_x1.jpg',
      oldPrice: 'x.50.000',
      newPrice: '3.590.000đ',
      status: 'Vừa mở bán',
    },
    {
      name: 'Màn hình Asus TUF',
      image: '/image/product/acer_kg240y_x1.jpg',
      oldPrice: 'x.90.000',
      newPrice: '3.990.000đ',
      status: 'Đã bán: 21',
    },
  ];
  res.status(200).json(products);
}