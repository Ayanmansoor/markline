import { GenerateInvoice } from "@/lib/GenerateInvoice";

export default function OrderDetails({ order }) {
    return (
        <button
            onClick={() => GenerateInvoice(order)}
            className="w-full md:w-fit px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white bg-black hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-black/10 active:scale-95"
        >
            Download Invoice
        </button>
    );
}
