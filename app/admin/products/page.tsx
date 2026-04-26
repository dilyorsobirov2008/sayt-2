'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Upload, 
  Search, 
  Trash2, 
  Package, 
  Layers, 
  DollarSign, 
  Scale, 
  CheckCircle2, 
  XCircle,
  Loader2,
  FileSpreadsheet,
  ArrowDownToLine,
  X
} from 'lucide-react';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title_uz: '',
    price: '',
    available: true,
    weight: '',
    category_name: '',
    storageVariants: [] as { ram: string, storage: string, price: string, sku: string }[]
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ title_uz: '', price: '', available: true, weight: '', category_name: '', storageVariants: [] });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/import-excel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: reader.result }),
        });
        const result = await res.json();
        alert(result.message);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Importda xatolik yuz berdi');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadSample = () => {
    const link = document.createElement('a');
    link.href = '/sample_products.xlsx';
    link.download = 'sample_products.xlsx';
    link.click();
  };

  const filteredProducts = products.filter(p => 
    p.title_uz.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060608] text-gray-200 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-[1440px] mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">
              Inventory <span className="text-indigo-500 italic">Command</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">Global Asset & Product Repository</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={downloadSample}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-sm font-bold uppercase tracking-wider group"
            >
              <ArrowDownToLine size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              Template
            </button>
            
            <label className="flex items-center gap-2 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl hover:bg-indigo-500/20 cursor-pointer transition-all text-sm font-bold uppercase tracking-wider">
              {importing ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              Import Excel
              <input type="file" className="hidden" accept=".xlsx,.xls" onChange={handleExcelImport} disabled={importing} />
            </label>

            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-500 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 font-bold uppercase tracking-wider text-sm"
            >
              <Plus size={18} strokeWidth={3} /> Add New
            </button>
          </div>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-400' },
            { label: 'Active Categories', value: new Set(products.map(p => p.category_name)).size, icon: Layers, color: 'text-indigo-400' },
            { label: 'Market Readiness', value: `${Math.round((products.filter(p => p.available).length / (products.length || 1)) * 100)}%`, icon: CheckCircle2, color: 'text-green-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[32px] flex items-center gap-6 group hover:border-white/10 transition-all">
              <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Section */}
        <div className="bg-white/5 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-3xl">
          {/* Table Controls */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="PROD_X_MARK_I OR CLASSIFICATION..."
                className="w-full bg-black/20 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-sm font-medium outline-none focus:border-indigo-500/30 focus:bg-black/40 transition-all uppercase tracking-wider"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-white/[0.02]">
                  <th className="px-8 py-6">Product Details</th>
                  <th className="px-8 py-6">Classification</th>
                  <th className="px-8 py-6 text-center">Unit Price</th>
                  <th className="px-8 py-6 text-center">Inventory Status</th>
                  <th className="px-8 py-6 text-right">Registry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {loading ? (
                  [1,2,3,4].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-10"><div className="h-4 bg-white/5 rounded-full w-full" /></td>
                    </tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <FileSpreadsheet size={64} className="mx-auto text-white/5 mb-6" strokeWidth={1} />
                      <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-600">Global Repository Void</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors relative">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 flex items-center justify-center text-indigo-400 font-black">
                            {p.title_uz[0]}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">{p.title_uz}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{p.weight || 'UNSPECIFIED WEIGHT'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                          {p.category_name}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <p className="text-sm font-black text-white tracking-tighter">
                          {new Intl.NumberFormat('uz-UZ').format(p.price)}
                          <span className="text-[9px] text-gray-500 ml-1 font-bold tracking-widest">UZS</span>
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          {p.available ? (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-black uppercase tracking-widest">
                              <CheckCircle2 size={12} /> Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-widest">
                              <XCircle size={12} /> Void
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                          {new Date(p.created_at).toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-2xl bg-[#0c0c10] border border-white/10 rounded-[48px] p-12 shadow-2xl overflow-hidden">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <header className="mb-12">
               <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Asset <span className="text-indigo-500">Registry</span></h2>
               <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Initialize a new core product unit</p>
            </header>

            <form onSubmit={handleCreate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Designation Name</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold uppercase tracking-wider outline-none focus:border-indigo-500 transition-all"
                    placeholder="Product Title"
                    value={formData.title_uz}
                    onChange={e => setFormData({...formData, title_uz: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Market Valuation (UZS)</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold uppercase tracking-wider outline-none focus:border-indigo-500 transition-all font-mono"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Classification</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold uppercase tracking-wider outline-none focus:border-indigo-500 transition-all"
                    placeholder="Category Name"
                    value={formData.category_name}
                    onChange={e => setFormData({...formData, category_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Weight Metric</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold uppercase tracking-wider outline-none focus:border-indigo-500 transition-all"
                    placeholder="e.g. 500g, 1.5kg"
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
                
                {/* Storage Variants UI — Preset chips + custom */}
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
                    Xotira Variantlari (RAM / Xotira)
                  </label>

                  {/* Preset chips */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { ram: '4', storage: '64' },
                      { ram: '4', storage: '128' },
                      { ram: '6', storage: '128' },
                      { ram: '6', storage: '256' },
                      { ram: '8', storage: '128' },
                      { ram: '8', storage: '256' },
                      { ram: '8', storage: '512' },
                      { ram: '12', storage: '256' },
                      { ram: '12', storage: '512' },
                      { ram: '16', storage: '512' },
                      { ram: '16', storage: '1024' },
                    ].map((preset) => {
                      const alreadyAdded = formData.storageVariants.some(
                        v => v.ram === preset.ram && v.storage === preset.storage
                      );
                      return (
                        <button
                          key={`${preset.ram}/${preset.storage}`}
                          type="button"
                          onClick={() => {
                            if (alreadyAdded) return;
                            setFormData({
                              ...formData,
                              storageVariants: [
                                ...formData.storageVariants,
                                { ram: preset.ram, storage: preset.storage, price: '', sku: '' }
                              ]
                            });
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all
                            ${alreadyAdded
                              ? 'bg-indigo-500/30 border-indigo-500/60 text-indigo-300 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-indigo-300 cursor-pointer'
                            }`}
                        >
                          {preset.ram}/{Number(preset.storage) >= 1024 ? `${Number(preset.storage)/1024}TB` : `${preset.storage}GB`}
                        </button>
                      );
                    })}
                    {/* Custom variant button */}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        storageVariants: [...formData.storageVariants, { ram: '', storage: '', price: '', sku: '' }]
                      })}
                      className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-dashed border-white/20 text-gray-500 hover:border-indigo-500/40 hover:text-indigo-400 transition-all"
                    >
                      + Boshqa
                    </button>
                  </div>

                  {/* Selected variants list */}
                  {formData.storageVariants.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {formData.storageVariants.map((v, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                          {/* RAM/Storage badge */}
                          <div className="flex items-center gap-1 shrink-0">
                            <div className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black">
                              {v.storage
                                ? (v.ram ? `${v.ram}GB / ` : '') + `${Number(v.storage) >= 1024 ? `${Number(v.storage)/1024}TB` : `${v.storage}GB`}`
                                : 'RAM / Xotira'}
                            </div>
                          </div>

                          {/* Custom RAM/Storage inputs — show only if empty (custom variant) */}
                          {(!v.storage) && (
                            <>
                              <input
                                placeholder="RAM (1)"
                                type="number"
                                value={v.ram}
                                onChange={e => {
                                  const newV = [...formData.storageVariants];
                                  newV[i] = { ...newV[i], ram: e.target.value };
                                  setFormData({ ...formData, storageVariants: newV });
                                }}
                                className="w-20 bg-black/20 text-xs font-bold py-2 px-3 rounded-xl outline-none border border-transparent focus:border-indigo-500 transition-colors"
                              />
                              <input
                                placeholder="XOTIRA"
                                type="number"
                                value={v.storage}
                                onChange={e => {
                                  const newV = [...formData.storageVariants];
                                  newV[i] = { ...newV[i], storage: e.target.value };
                                  setFormData({ ...formData, storageVariants: newV });
                                }}
                                className="w-20 bg-black/20 text-xs font-bold py-2 px-3 rounded-xl outline-none border border-transparent focus:border-indigo-500 transition-colors"
                              />
                            </>
                          )}

                          {/* Price and SKU input */}
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 relative">
                              <input
                                required
                                placeholder="Narxi (so'm)"
                                type="number"
                                value={v.price}
                                onChange={e => {
                                  const newV = [...formData.storageVariants];
                                  newV[i] = { ...newV[i], price: e.target.value };
                                  setFormData({ ...formData, storageVariants: newV });
                                }}
                                className="w-full bg-black/20 text-sm font-bold py-2 px-4 pr-14 rounded-xl outline-none border border-transparent focus:border-indigo-500 transition-colors font-mono"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-600 uppercase">UZS</span>
                            </div>
                            <input
                              placeholder="SKU/ID (ixtiyoriy)"
                              value={v.sku || ''}
                              onChange={e => {
                                const newV = [...formData.storageVariants];
                                newV[i] = { ...newV[i], sku: e.target.value };
                                setFormData({ ...formData, storageVariants: newV });
                              }}
                              className="w-36 bg-black/20 text-xs font-bold py-2 px-3 rounded-xl outline-none border border-transparent focus:border-indigo-500 transition-colors"
                            />
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => {
                              const newV = [...formData.storageVariants];
                              newV.splice(i, 1);
                              setFormData({ ...formData, storageVariants: newV });
                            }}
                            className="text-red-400 hover:text-red-300 w-9 h-9 flex justify-center items-center rounded-xl bg-red-400/10 hover:bg-red-400/20 transition-colors shrink-0"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-white/5 border border-white/5 rounded-3xl">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg border-white/10 bg-black/20 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                  checked={formData.available}
                  onChange={e => setFormData({...formData, available: e.target.checked})}
                />
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-white">Active Status</label>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Enable immediate market availability</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 border border-white/10 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel Registry
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-98 transition-all"
                >
                  Validate & Commit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
