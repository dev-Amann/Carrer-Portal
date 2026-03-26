import React from 'react';
import Button from '../ui/Button';

const PaymentHandler = ({ amount, onPay, loading }) => {
    return (
        <div className="space-y-8 animate-fade-in text-center py-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto ring-1 ring-emerald-100 shadow-lg shadow-emerald-100">
                <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                    Booking Created!
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                    Your consulting session is reserved. Please complete the payment to finalize.
                </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 max-w-sm mx-auto shadow-sm">
                <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Amount Due</p>
                <p className="text-4xl font-bold text-slate-900">₹{amount}</p>
            </div>

            <Button
                onClick={onPay}
                loading={loading}
                className="w-full max-w-sm h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100"
                variant="primary"
            >
                Pay Now
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
                </svg>
                <span>Secure payment via Razorpay</span>
            </div>
        </div>
    );
};

export default PaymentHandler;
