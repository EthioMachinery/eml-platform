"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  CheckCircle, 
  XCircle, 
  Scan, 
  ShieldAlert, 
  Search, 
  FileText, 
  Camera,
  Loader2,
  AlertOctagon
} from 'lucide-react';

/**
 * TM VERIFICATION CENTER — V2.0
 * AI-Driven Machinery Authentication.
 */

export default function VerificationPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingMachinery();
  }, []);

  async function fetchPendingMachinery() {
    setLoading(true);
    const { data, error } = await supabase
      .from('machinery')
      .select('*, profiles(full_name, company_name, trust_score)')
      .eq('verified', false)
      .order('created_at', { ascending: false });

    if (!error) setItems(data || []);
    setLoading(false);
  }

  // --- AI SCANNER LOGIC ---
  const runAIScan = async (machine: any) => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate AI extraction logic (OCR + Image Analysis)
    await new Promise(r => setTimeout(r, 2500));

    const mockResult = {
      serialNumber: "SN-992384-CAT",
      modelMatch: machine.title.toLowerCase().includes("cat") ? 98 : 45,
      imageIntegrity: "AUTHENTIC",
      locationMatch: "MATCHED (Addis Ababa)",
      riskScore: machine.price < 500000 ? "LOW" : "MEDIUM"
    };

    setScanResult(mockResult);
    setIsScanning(false);
  };

  const handleVerify = async (id: string, status: 'approve' | 'reject') => {
    const { error } = await supabase
      .from('machinery')
      .update({ 
        verified: status === 'approve', 
        status: status === 'approve' ? 'active' : 'rejected' 
      })
      .eq('id', id);

    if (!error) {
      // Log to Audit for AI Learning
      await supabase.from('admin_audit_log').insert({
        action: status === 'approve' ? 'MACHINERY_VERIFIED' : 'MACHINERY_REJECTED',
        target_type: 'MACHINERY',
        target_id: id,
        reason: `AI Scan Confidence: ${scanResult?.modelMatch || 'N/A'}%`
      });

      setSelectedItem(null);
      fetchPendingMachinery();
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-300 flex">
      
      {/* --- SIDEBAR: PENDING QUEUE --- */}
      <div className="w-1/3 border-r border-white/5 bg-zinc-900/20 overflow-y-auto">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Pending Queue</h2>
          <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {items.length} NEW
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-4 cursor-pointer transition-all hover:bg-white/5 ${selectedItem?.id === item.id ? 'bg-emerald-500/5 border-l-2 border-emerald-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold text-white truncate w-48">{item.title}</h3>
                <span className="text-[10px] font-mono text-zinc-500">{new Date(item.created_at).toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                Seller: {item.profiles?.full_name || 'Individual'} • Trust: {item.profiles?.trust_score}%
              </p>
            </div>
          ))}
          {items.length === 0 && !loading && (
            <div className="p-20 text-center opacity-20">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-xs uppercase">All machines verified</p>
            </div>
          )}
        </div>
      </div>

      {/* --- MAIN AREA: AI INSPECTION --- */}
      <div className="flex-1 p-8 overflow-y-auto">
        {selectedItem ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedItem.title}</h1>
                <p className="text-zinc-500 font-mono text-xs mt-1 uppercase">Machine ID: {selectedItem.id}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleVerify(selectedItem.id, 'reject')}
                  className="px-6 py-2 border border-red-500/20 text-red-500 text-xs font-bold uppercase rounded hover:bg-red-500 hover:text-white transition-all"
                >
                  <XCircle className="w-4 h-4 inline mr-2" /> Reject
                </button>
                <button 
                  onClick={() => handleVerify(selectedItem.id, 'approve')}
                  className="px-6 py-2 bg-emerald-600 text-white text-xs font-bold uppercase rounded hover:bg-emerald-500 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" /> Approve Listing
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Image & Basic Specs */}
              <div className="space-y-6">
                <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden relative group">
                  <img src={selectedItem.image_url} alt="Listing" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="text-xs font-bold uppercase text-white flex items-center gap-2">
                      <Search className="w-4 h-4" /> Fullscreen Inspection
                    </button>
                  </div>
                </div>
                
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-4 tracking-widest">Specifications</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div><span className="text-zinc-500 uppercase block text-[9px]">Price</span>{selectedItem.price.toLocaleString()} ETB</div>
                    <div><span className="text-zinc-500 uppercase block text-[9px]">Category</span>{selectedItem.category}</div>
                    <div><span className="text-zinc-500 uppercase block text-[9px]">Year</span>{selectedItem.year}</div>
                    <div><span className="text-zinc-500 uppercase block text-[9px]">Location</span>{selectedItem.city}, {selectedItem.region}</div>
                  </div>
                </div>
              </div>

              {/* AI Verification Panel */}
              <div className="space-y-6">
                <div className="bg-zinc-900 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Scan className={`w-6 h-6 ${isScanning ? 'text-emerald-500 animate-spin' : 'text-zinc-700'}`} />
                  </div>
                  
                  <h3 className="text-xs font-bold text-emerald-500 uppercase mb-6 tracking-widest flex items-center gap-2">
                    <Server className="w-4 h-4" /> TM Intelligence Scanner
                  </h3>

                  {!scanResult && !isScanning && (
                    <button 
                      onClick={() => runAIScan(selectedItem)}
                      className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold uppercase text-xs rounded-xl hover:bg-emerald-500/20 transition-all"
                    >
                      Initialize AI Authentication
                    </button>
                  )}

                  {isScanning && (
                    <div className="py-8 text-center">
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-4" />
                      <p className="text-[10px] font-mono animate-pulse uppercase">Extracting Plate Data & Metadata...</p>
                    </div>
                  )}

                  {scanResult && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] uppercase text-zinc-500">Extracted VIN</span>
                        <span className="text-xs font-mono text-white">{scanResult.serialNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] uppercase text-zinc-500">Model Validity</span>
                        <span className={`text-xs font-bold ${scanResult.modelMatch > 90 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {scanResult.modelMatch}% Match
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] uppercase text-zinc-500">Image Integrity</span>
                        <span className="text-xs text-white flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> {scanResult.imageIntegrity}
                        </span>
                      </div>
                      
                      <div className={`mt-6 p-4 rounded-lg flex items-center gap-4 ${scanResult.modelMatch > 90 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                         {scanResult.modelMatch > 90 ? <ShieldAlert className="text-emerald-500" /> : <AlertOctagon className="text-red-500" />}
                         <p className="text-[10px] leading-tight uppercase font-bold">
                           {scanResult.modelMatch > 90 
                             ? "AI Recommendation: High Confidence. Safe to Approve." 
                             : "AI Recommendation: Suspicious Listing. Manual check required."}
                         </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-4 tracking-widest">Seller Dossier</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xl">
                      {selectedItem.profiles?.full_name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{selectedItem.profiles?.full_name}</div>
                      <div className="text-[10px] text-zinc-500 uppercase">{selectedItem.profiles?.company_name || 'Individual Trader'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-700">
            <div className="text-center">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-xs uppercase tracking-widest">Select a machine from the queue to begin AI inspection</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}