import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Box, Image as ImageIcon, ShoppingCart, ExternalLink, ChevronRight, AlertTriangle } from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '', brand: '', category: 'eyeglasses', price: '', stock: '', gender: 'unisex',
        frameShape: '', description: '', isBestSeller: false,
        title: '', subtitle: '', tag: '', link: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'products') {
                const res = await axios.get('/api/products?limit=100');
                setProducts(res.data.products);
            } else {
                const res = await axios.get('/api/banners');
                setBanners(res.data.banners);
            }
        } catch (err) { console.error(err); }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append('image', imageFile);

        try {
            if (activeTab === 'products') {
                if (editingItem) {
                    await axios.put(`/api/products/${editingItem.id}`, data);
                } else {
                    await axios.post('/api/products', data);
                }
            } else {
                await axios.post('/api/banners', data);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete item?')) return;
        try {
            await axios.delete(`/api/${activeTab}/${id}`);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock < 10).length;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Admin Sidebar */}
            <aside style={{ width: '280px', background: '#000042', color: 'white', padding: '40px 20px' }}>
                <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '50px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-glasses"></i> ADMIN CMS
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={() => setActiveTab('products')}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px', borderRadius: '12px', width: '100%', textAlign: 'left', background: activeTab === 'products' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                    >
                        <Box size={20} /> Products
                    </button>
                    <button
                        onClick={() => setActiveTab('banners')}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px', borderRadius: '12px', width: '100%', textAlign: 'left', background: activeTab === 'banners' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                    >
                        <ImageIcon size={20} /> Banners
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px', borderRadius: '12px', width: '100%', textAlign: 'left', opacity: 0.5 }}>
                        <ShoppingCart size={20} /> Orders
                    </button>
                    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px', borderRadius: '12px', width: '100%', marginTop: '50px', color: '#cbd5e1' }}>
                        <ExternalLink size={20} /> View Site
                    </a>
                </nav>
            </aside>

            {/* Admin Content */}
            <main style={{ flex: 1, padding: '40px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'capitalize' }}>{activeTab} Management</h1>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '12px 25px', borderRadius: '12px' }}
                        onClick={() => { setEditingItem(null); setFormData({ category: 'eyeglasses', gender: 'unisex' }); setPreviewUrl(''); setIsModalOpen(true); }}
                    >
                        <Plus size={20} /> Add New {activeTab === 'products' ? 'Product' : 'Banner'}
                    </button>
                </header>

                {activeTab === 'products' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>Total Products</div>
                            <div style={{ fontSize: '32px', fontWeight: 900 }}>{totalProducts}</div>
                        </div>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>Low Stock Alerts</div>
                            <div style={{ fontSize: '32px', fontWeight: 900, color: '#ef4444' }}>{lowStock}</div>
                        </div>
                    </div>
                )}

                <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ textAlign: 'left', padding: '20px 30px', color: 'var(--text-muted)', fontSize: '14px' }}>Item</th>
                                {activeTab === 'products' ? (
                                    <>
                                        <th style={{ textAlign: 'left', padding: '20px 30px', color: 'var(--text-muted)', fontSize: '14px' }}>Category</th>
                                        <th style={{ textAlign: 'left', padding: '20px 30px', color: 'var(--text-muted)', fontSize: '14px' }}>Price</th>
                                        <th style={{ textAlign: 'left', padding: '20px 30px', color: 'var(--text-muted)', fontSize: '14px' }}>Stock</th>
                                    </>
                                ) : (
                                    <>
                                        <th style={{ textAlign: 'left', padding: '20px 30px', color: 'var(--text-muted)', fontSize: '14px' }}>Title</th>
                                        <th style={{ textAlign: 'left', padding: '20px 30px', color: 'var(--text-muted)', fontSize: '14px' }}>Link To</th>
                                    </>
                                )}
                                <th style={{ textAlign: 'right', padding: '20px 30px', color: 'var(--text-muted)', fontSize: '14px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeTab === 'products' ? (
                                products.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '20px 30px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <img src={p.image} style={{ width: '60px', height: '40px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px' }} alt="" />
                                                <div><div style={{ fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: '12px', color: '#888' }}>{p.id.substring(0, 8)}</div></div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 30px' }}><span className="badge" style={{ background: '#eef2ff', color: '#4f46e5' }}>{p.category}</span></td>
                                        <td style={{ padding: '20px 30px', fontWeight: 700 }}>₹{p.price}</td>
                                        <td style={{ padding: '20px 30px' }}>
                                            <span className={`badge ${p.stock < 10 ? 'badge-danger' : 'badge-success'}`}>
                                                {p.stock} units
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => { setEditingItem(p); setFormData(p); setPreviewUrl(p.image); setIsModalOpen(true); }} style={{ color: '#0284c7' }}><Edit2 size={18} /></button>
                                                <button onClick={() => handleDelete(p.id)} style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                banners.map(b => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '20px 30px' }}>
                                            <img src={b.image} style={{ width: '150px', borderRadius: '8px' }} alt="" />
                                        </td>
                                        <td style={{ padding: '20px 30px', fontWeight: 700 }}>{b.title} {b.subtitle}</td>
                                        <td style={{ padding: '20px 30px' }}>{b.link}</td>
                                        <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                                            <button onClick={() => handleDelete(b.id)} style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', width: '90%', maxWidth: '800px', borderRadius: '24px', padding: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '30px' }}>
                            {editingItem ? 'Edit' : 'Add New'} {activeTab === 'products' ? 'Product' : 'Banner'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {/* Drag Drop Area */}
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Module Image</label>
                                <div
                                    onClick={() => document.getElementById('admin-file-input').click()}
                                    style={{ border: '2px dashed #cbd5e1', padding: '30px', textAlign: 'center', borderRadius: '16px', cursor: 'pointer', background: '#f8fafc' }}
                                >
                                    {previewUrl ? <img src={previewUrl} style={{ maxHeight: '150px', borderRadius: '8px' }} /> : <div style={{ color: 'var(--text-muted)' }}><ImageIcon size={32} style={{ marginBottom: '10px' }} /><p>Click to upload or drag & drop</p></div>}
                                    <input type="file" id="admin-file-input" hidden onChange={handleImageChange} />
                                </div>
                            </div>

                            {activeTab === 'products' ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group"><label>Product Name</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                                    <div className="form-group"><label>Brand</label><input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} /></div>
                                    <div className="form-group"><label>Category</label><select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}><option value="eyeglasses">Eyeglasses</option><option value="sunglasses">Sunglasses</option></select></div>
                                    <div className="form-group"><label>Price (₹)</label><input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} /></div>
                                    <div className="form-group"><label>Stock</label><input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} /></div>
                                    <div className="form-group"><label>Frame Shape</label><input type="text" value={formData.frameShape} onChange={e => setFormData({ ...formData, frameShape: e.target.value })} /></div>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Description</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', height: '100px' }} /></div>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group"><label>Main Title</label><input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
                                    <div className="form-group"><label>Subtitle</label><input type="text" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} /></div>
                                    <div className="form-group"><label>Tag</label><input type="text" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} /></div>
                                    <div className="form-group"><label>Link (Category ID)</label><input type="text" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} /></div>
                                </div>
                            )}

                            <div style={{ marginTop: '40px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ padding: '12px 40px' }}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        .form-group label { display: block; font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        .form-group input, .form-group select { width:100%; padding:12px; border-radius:12px; border:1px solid #e2e8f0; outline:none; }
        .form-group input:focus { border-color: var(--primary); }
      `}</style>
        </div>
    );
};

export default Admin;
