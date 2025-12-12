"use client";
import React, { useEffect, useState } from 'react';
import styles from './flash-sale-admin.module.scss';

import AdminPageTitle from "@/components/AdminPageTitle";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
function FlashSaleAdminPage() {
    // Modal state for product management
    const [productModal, setProductModal] = useState({ open: false, campaign: null });
    const [flashSaleItems, setFlashSaleItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [itemForm, setItemForm] = useState({ ProductId: '', FlashPrice: '', percent: '' });
    const [itemEditId, setItemEditId] = useState(null);
    const [itemLoading, setItemLoading] = useState(false);

    // Fetch all products for select dropdown
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.data || []);
    };

    // Fetch flash sale items for a campaign
    const fetchFlashSaleItems = async (campaignId) => {
      setItemLoading(true);
      const res = await fetch(`/api/admin/flash-sale/${campaignId}/items`);
      const data = await res.json();
      setFlashSaleItems(data.items || []);
      setItemLoading(false);
    };

    // Open modal and load data
    const openProductModal = async (campaign) => {
      setProductModal({ open: true, campaign });
      setItemForm({ ProductId: '', FlashPrice: '', StockLimit: '', DisplayOrder: '' });
      setItemEditId(null);
      await fetchProducts();
      await fetchFlashSaleItems(campaign.Id);
    };

    // Close modal
    const closeProductModal = () => {
      setProductModal({ open: false, campaign: null });
      setFlashSaleItems([]);
      setItemForm({ ProductId: '', FlashPrice: '', StockLimit: '', DisplayOrder: '' });
      setItemEditId(null);
    };


    // Handle item form change
    const handleItemFormChange = (e) => {
      const { name, value } = e.target;
      // Nếu chọn phần trăm thì tự động tính FlashPrice
      if (name === 'percent') {
        const product = products.find(p => p.ProductId == itemForm.ProductId);
        let flashPrice = '';
        if (product && value) {
          const percent = parseFloat(value);
          flashPrice = Math.round(product.Price * (1 - percent / 100));
        }
        setItemForm((prev) => ({ ...prev, percent: value, FlashPrice: flashPrice }));
      } else if (name === 'ProductId') {
        // Khi chọn sản phẩm, nếu đã chọn phần trăm thì tự động tính lại giá
        const product = products.find(p => p.ProductId == value);
        let flashPrice = itemForm.FlashPrice;
        if (product && itemForm.percent) {
          const percent = parseFloat(itemForm.percent);
          flashPrice = Math.round(product.Price * (1 - percent / 100));
        }
        setItemForm((prev) => ({ ...prev, ProductId: value, FlashPrice: flashPrice }));
      } else {
        setItemForm((prev) => ({ ...prev, [name]: value }));
      }
    };

    // Add or update flash sale item
    const handleItemSubmit = async (e) => {
      e.preventDefault();
      setItemLoading(true);
      const campaignId = productModal.campaign.Id;
      if (itemEditId) {
        // Update
        await fetch(`/api/admin/flash-sale/${campaignId}/items/${itemEditId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            FlashPrice: itemForm.FlashPrice,
          }),
        });
      } else {
        // Add
        await fetch(`/api/admin/flash-sale/${campaignId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ProductId: itemForm.ProductId,
            FlashPrice: itemForm.FlashPrice,
          }),
        });
      }
      setItemForm({ ProductId: '', FlashPrice: '', percent: '' });
      setItemEditId(null);
      await fetchFlashSaleItems(campaignId);
      setItemLoading(false);
    };

    // Edit flash sale item
    const handleItemEdit = (item) => {
      setItemForm({
        ProductId: item.ProductId,
        FlashPrice: item.FlashPrice,
        percent: '',
      });
      setItemEditId(item.Id);
    };

    // Delete flash sale item
    const handleItemDelete = async (itemId) => {
      if (!window.confirm('Xóa sản phẩm này khỏi flash sale?')) return;
      setItemLoading(true);
      const campaignId = productModal.campaign.Id;
      await fetch(`/api/admin/flash-sale/${campaignId}/items/${itemId}`, { method: 'DELETE' });
      await fetchFlashSaleItems(campaignId);
      setItemLoading(false);
    };
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({
    Code: '',
    Title: '',
    StartTime: '',
    EndTime: '',
    BannerImageUrl: '',
    IsActive: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/flash-sale');
    const data = await res.json();
    setCampaigns(data.campaigns || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle submit (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      await fetch(`/api/admin/flash-sale/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/admin/flash-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ Code: '', Title: '', StartTime: '', EndTime: '', BannerImageUrl: '', IsActive: true });
    setEditingId(null);
    fetchCampaigns();
  };

  // Handle edit
  const handleEdit = (c) => {
    setForm({
      Code: c.Code,
      Title: c.Title,
      StartTime: c.StartTime ? c.StartTime.slice(0, 16) : '',
      EndTime: c.EndTime ? c.EndTime.slice(0, 16) : '',
      BannerImageUrl: c.BannerImageUrl || '',
      IsActive: !!c.IsActive,
    });
    setEditingId(c.Id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Xóa campaign này?')) return;
    setLoading(true);
    await fetch(`/api/admin/flash-sale/${id}`, { method: 'DELETE' });
    fetchCampaigns();
  };

  return (
    <div className={styles.flashSaleAdmin}>
      <AdminPageTitle>Quản lý Flash Sale</AdminPageTitle>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <input name="Code" value={form.Code} onChange={handleChange} placeholder="Mã campaign" required />
        <input name="Title" value={form.Title} onChange={handleChange} placeholder="Tiêu đề" required />
        <input name="StartTime" type="datetime-local" value={form.StartTime} onChange={handleChange} required />
        <input name="EndTime" type="datetime-local" value={form.EndTime} onChange={handleChange} required />
        <input name="BannerImageUrl" value={form.BannerImageUrl} onChange={handleChange} placeholder="Banner URL" />
      
        <button type="submit" disabled={loading}>{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ Code: '', Title: '', StartTime: '', EndTime: '', BannerImageUrl: '', IsActive: true }); }}>Hủy</button>}
      </form>
      <hr />
      {loading ? <LoadingSpinner message="Đang tải dữ liệu flash sale..." /> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã</th>
              <th>Tiêu đề</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Banner</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.Id}>
                <td>{c.Id}</td>
                <td>{c.Code}</td>
                <td>{c.Title}</td>
                <td>{c.StartTime?.replace('T', ' ').slice(0, 16)}</td>
                <td>{c.EndTime?.replace('T', ' ').slice(0, 16)}</td>
                <td>
                  <img
                    src={c.BannerImageUrl && c.BannerImageUrl.trim() !== '' ? c.BannerImageUrl : '/images/flash-sale/gtn-gamming-gear.png'}
                    alt="banner"
                    style={{ maxWidth: 80 }}
                  />
                </td>
                <td>{c.IsActive ? '✔️' : ''}</td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <button title="Sửa" style={{background:'none',border:'none',padding:4,cursor:'pointer',color:'#1976d2',display:'flex',alignItems:'center'}} onClick={() => handleEdit(c)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}>
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button title="Xóa" style={{background:'none',border:'none',padding:4,cursor:'pointer',color:'#d32f2f',display:'flex',alignItems:'center'}} onClick={() => handleDelete(c.Id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}>
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                    <button title="Quản lý sản phẩm" style={{background:'none',border:'none',padding:4,cursor:'pointer',color:'#333',display:'flex',alignItems:'center'}} onClick={() => openProductModal(c)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}>
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </button>
                  </div>
                      {/* Modal quản lý sản phẩm flash sale */}
                      {productModal.open && (
                        <div style={{
                          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
                          background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <div style={{ background: '#fff', borderRadius: 12, minWidth: 420, maxWidth: 650, boxShadow: '0 8px 32px #b71c1c33', padding: 28, position: 'relative' }}>
                            <button onClick={closeProductModal} style={{ position: 'absolute', right: 18, top: 12, fontSize: 22, background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: 700 }}>×</button>
                            <h2 style={{ color: '#d32f2f', marginBottom: 12 }}>Quản lý sản phẩm Flash Sale</h2>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>Chiến dịch: <span style={{ color: '#1976d2' }}>{productModal.campaign.Title}</span></div>
                            <form onSubmit={handleItemSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
                              <select name="ProductId" value={itemForm.ProductId} onChange={handleItemFormChange} required={!itemEditId} disabled={!!itemEditId} style={{ minWidth: 160, padding: 6, borderRadius: 6, border: '1px solid #bdbdbd' }}>
                                <option value="">Chọn sản phẩm</option>
                                {products.map(p => (
                                  <option key={p.ProductId} value={p.ProductId}>{p.Name}</option>
                                ))}
                              </select>
                              <select name="percent" value={itemForm.percent} onChange={handleItemFormChange} style={{ minWidth: 90, padding: 6, borderRadius: 6, border: '1px solid #bdbdbd' }}>
                                <option value="">Chọn % giảm</option>
                                <option value="20">Giảm 20%</option>
                                <option value="25">Giảm 25%</option>
                                <option value="30">Giảm 30%</option>
                                <option value="35">Giảm 35%</option>
                                <option value="40">Giảm 40%</option>
                              </select>
                              <input name="FlashPrice" type="number" min="0" value={itemForm.FlashPrice} onChange={handleItemFormChange} placeholder="Giá sale (tùy chỉnh)" required style={{ minWidth: 110, padding: 6, borderRadius: 6, border: '1px solid #bdbdbd' }} />
                              <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600 }}>{itemEditId ? 'Cập nhật' : 'Thêm'}</button>
                              {itemEditId && <button type="button" onClick={() => { setItemEditId(null); setItemForm({ ProductId: '', FlashPrice: '', percent: '' }); }} style={{ background: '#bdbdbd', color: '#333', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600 }}>Hủy</button>}
                            </form>
                            <div style={{ maxHeight: 320, overflowY: 'auto', border: '1px solid #f8bbd0', borderRadius: 8, background: '#fff6f6', padding: 8 }}>
                              {itemLoading ? <LoadingSpinner message="Đang tải sản phẩm..." /> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ background: '#fbe9e7' }}>
                                      <th style={{ padding: 6 }}>Tên sản phẩm</th>
                                      <th style={{ padding: 6 }}>Giá gốc</th>
                                      <th style={{ padding: 6 }}>Giá sale</th>
                                      <th style={{ padding: 6 }}></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {flashSaleItems.map(item => (
                                      <tr key={item.Id} style={{ borderBottom: '1px solid #f8bbd0' }}>
                                        <td style={{ padding: 6 }}>{item.Name}</td>
                                        <td style={{ padding: 6 }}>{item.Price?.toLocaleString()}</td>
                                        <td style={{ padding: 6, color: '#d32f2f', fontWeight: 600 }}>{item.FlashPrice?.toLocaleString()}</td>
                                        <td style={{ padding: 6 }}>
                                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                                            <button title="Sửa" style={{background:'none',border:'none',padding:4,cursor:'pointer',color:'#1976d2',display:'flex',alignItems:'center'}} onClick={() => handleItemEdit(item)}>
                                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}>
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                              </svg>
                                            </button>
                                            <button title="Xóa" style={{background:'none',border:'none',padding:4,cursor:'pointer',color:'#d32f2f',display:'flex',alignItems:'center'}} onClick={() => handleItemDelete(item.Id)}>
                                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}>
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                              </svg>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FlashSaleAdminPage;
