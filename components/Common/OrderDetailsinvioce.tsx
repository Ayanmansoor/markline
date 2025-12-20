import { GenerateInvoice } from "@/lib/GenerateInvoice";

export default function OrderDetails({ order }) {
    return (
        <button
            onClick={() => GenerateInvoice(order)}
            className="w-full relative h-auto flex py-2 px-3 rounded-lg  items-center justify-center text-white bg-primary border-white cursor-pointer"
        >
            Download Invoice
        </button>
    );
}
