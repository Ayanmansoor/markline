import React from 'react';
import { Leaf } from 'lucide-react';

export default function KeyMatric() {
    return (
        <div className="flex items-center justify-center py-10 bg-[#f7f3f3]  rounded-md shadow-sm font-inter relative overflow-hidden">
            <div className="text-center max-w-2xl px-8">
                <h2 className="text-xl md:text-2xl font-semibold text-primary mb-2">
                    At Markline, Responsibility Goes Beyond Just Words.
                </h2>
                <p className="text-sm md:text-base text-primary">
                    We are mindful of what we create and how it shapes the world around us. With a focus on circularity and transparency, we&apos;re crafting a future that&apos;s better than yesterday.
                </p>
                <div className="mt-4 text-xl font-bold tracking-widest text-gray-800 uppercase">
                    MARKLINE
                </div>
            </div>
        </div>
    );
}