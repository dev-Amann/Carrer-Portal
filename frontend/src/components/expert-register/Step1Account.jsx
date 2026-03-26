import React from 'react';
import Button from '../ui/Button';

const Step1Account = ({
    formData,
    handleChange,
    onNext,
    loading,
    otpSent,
    otpVerified,
    timer,
    onSendOTP,
    onVerifyOTP
}) => {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Name & Email */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text" id="name" name="name" required
                            value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="flex gap-2">
                            <input
                                type="email" id="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                disabled={otpSent}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-slate-100"
                                placeholder="john@example.com"
                            />
                            <Button
                                type="button"
                                onClick={onSendOTP}
                                disabled={otpSent || loading || !formData.email}
                                className="whitespace-nowrap"
                            >
                                {otpSent ? (timer > 0 ? `Resend in ${timer}s` : 'Resend OTP') : 'Send OTP'}
                            </Button>
                        </div>
                    </div>

                    {/* OTP Input */}
                    {otpSent && (
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">Enter OTP</label>
                            <div className="flex gap-2">
                                <input
                                    type="text" id="otp" name="otp" required
                                    value={formData.otp} onChange={handleChange}
                                    disabled={otpVerified}
                                    maxLength={6}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-green-50 disabled:border-green-200 disabled:text-green-700"
                                    placeholder="123456"
                                />
                                <Button
                                    type="button"
                                    onClick={onVerifyOTP}
                                    disabled={otpVerified || loading || !formData.otp}
                                    className={otpVerified ? 'bg-green-600 hover:bg-green-700' : ''}
                                >
                                    {otpVerified ? 'Verified' : 'Verify'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Passwords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input
                                type="password" id="password" name="password" required
                                value={formData.password} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <input
                                type="password" id="confirmPassword" name="confirmPassword" required
                                value={formData.confirmPassword} onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <Button type="submit" disabled={!otpVerified} className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-sm font-semibold">
                    Register & Continue
                </Button>
            </div>
        </form>
    );
};

export default Step1Account;
