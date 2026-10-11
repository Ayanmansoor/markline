'use client'
import React, { useState } from 'react'
import { ShipmentProps } from '@/types/interfaces'
import { Truck, ExternalLink, Copy, Check, Calendar, PackageCheck, AlertCircle, FileText, Download } from 'lucide-react'
import { toast } from 'sonner'

interface ShipmentTrackingCardProps {
    shipments?: ShipmentProps[] | ShipmentProps | any;
    className?: string;
}

const formatDate = (isoString?: string | null) => {
    if (!isoString) return null;
    try {
        return new Date(isoString).toLocaleString('en-IN', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch {
        return null;
    }
};

const getStatusBadgeClass = (status?: string) => {
    const s = (status || 'Pending').toString().toLowerCase();
    if (s.includes('delivered')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s.includes('transit') || s.includes('destination') || s.includes('out for delivery')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s.includes('picked') || s.includes('scheduled') || s.includes('awb') || s.includes('ready')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (s.includes('cancel') || s.includes('rto') || s.includes('return') || s.includes('lost') || s.includes('damage')) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
};

export function ShipmentTrackingCard({ shipments, className }: ShipmentTrackingCardProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const shipmentsList: ShipmentProps[] = Array.isArray(shipments)
        ? shipments
        : (shipments && typeof shipments === 'object' ? [shipments] : []);

    const handleCopyAWB = (awb: string, index: number) => {
        if (!awb) return;
        navigator.clipboard.writeText(awb);
        setCopiedIndex(index);
        toast.success(`AWB Code (${awb}) copied to clipboard`);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (shipmentsList.length === 0) {
        return (
            <div className={`bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-3 ${className || ''}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
                        <Truck size={20} className="animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Preparing for Dispatch</h3>
                        <p className="text-xs text-gray-500 font-medium">Your package is being processed in our warehouse.</p>
                    </div>
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 font-medium leading-relaxed">
                    Real-time courier details (Courier Partner, AWB Tracking Code, and Live Tracking Link) will appear here as soon as your package is picked up by our logistics partner.
                </p>
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-4 ${className || ''}`}>
            {shipmentsList.map((shipment, index) => {
                const courierName = shipment.courier_name || shipment.provider || 'Courier Partner';
                const awbCode = shipment.awb_code || shipment.tracking_number || '';
                const trackingUrl = shipment.tracking_url;
                const status = shipment.shipment_status || 'Pending';
                const badgeStyle = getStatusBadgeClass(status);

                const pickedUp = formatDate(shipment.picked_up_at);
                const inTransit = formatDate(shipment.in_transit_at);
                const outForDelivery = formatDate(shipment.out_for_delivery_at);
                const delivered = formatDate(shipment.delivered_at);

                return (
                    <div key={shipment.id || index} className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-4">
                        {/* Header: Courier & Status Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <Truck size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Courier Partner</span>
                                    <span className="text-sm font-bold text-gray-900">{courierName}</span>
                                </div>
                            </div>

                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeStyle}`}>
                                {status}
                            </span>
                        </div>

                        {/* AWB Code & Track Package Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/80">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AWB / Tracking Number</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono font-bold text-gray-900">{awbCode || 'Pending Assignment'}</span>
                                    {awbCode && (
                                        <button
                                            onClick={() => handleCopyAWB(awbCode, index)}
                                            className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors cursor-pointer"
                                            title="Copy AWB Code"
                                        >
                                            {copiedIndex === index ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {trackingUrl && (
                                <a
                                    href={trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors shadow-xs shrink-0"
                                >
                                    <span>Track Package</span>
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>

                        {/* Milestones Timestamps (if present) */}
                        {(pickedUp || inTransit || outForDelivery || delivered) && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                                {pickedUp && (
                                    <div className="flex flex-col bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Picked Up</span>
                                        <span className="font-semibold text-gray-800 text-[11px] mt-0.5">{pickedUp}</span>
                                    </div>
                                )}
                                {inTransit && (
                                    <div className="flex flex-col bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">In Transit</span>
                                        <span className="font-semibold text-gray-800 text-[11px] mt-0.5">{inTransit}</span>
                                    </div>
                                )}
                                {outForDelivery && (
                                    <div className="flex flex-col bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Out for Delivery</span>
                                        <span className="font-semibold text-gray-800 text-[11px] mt-0.5">{outForDelivery}</span>
                                    </div>
                                )}
                                {delivered && (
                                    <div className="flex flex-col bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200/60 text-emerald-900">
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Delivered</span>
                                        <span className="font-bold text-emerald-800 text-[11px] mt-0.5">{delivered}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Download Links (Invoice, Label) */}
                        {(shipment.invoice_url || shipment.shipping_label_url || shipment.manifest_url) && (
                            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
                                {shipment.invoice_url && (
                                    <a
                                        href={shipment.invoice_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
                                    >
                                        <FileText size={14} />
                                        <span>Download Invoice</span>
                                    </a>
                                )}
                                {shipment.shipping_label_url && (
                                    <a
                                        href={shipment.shipping_label_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
                                    >
                                        <Download size={14} />
                                        <span>Shipping Label</span>
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Failure / Remarks Alert */}
                        {(shipment.failure_reason || shipment.remarks) && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <span>{shipment.failure_reason || shipment.remarks}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
