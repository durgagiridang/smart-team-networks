'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface PaymentMethodsProps {
  amount: number;
  onPaymentComplete: (method: string, data: any) => void;
}

export default function PaymentMethods({ amount, onPaymentComplete }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [showQR, setShowQR] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentOptions = [
    { id: 'esewa', name: 'eSewa', icon: '💚', color: 'bg-green-600' },
    { id: 'khalti', name: 'Khalti', icon: '💜', color: 'bg-purple-600' },
    { id: 'fonepay', name: 'FonePay', icon: '🧡', color: 'bg-orange-600' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', color: 'bg-blue-600' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵', color: 'bg-gray-600' },
  ];

  const handleSelect = async (methodId: string) => {
    setSelectedMethod(methodId);
    
    if (methodId === 'bank') {
      setShowBank(true);
      setShowQR(false);
    } else if (['esewa', 'khalti', 'fonepay'].includes(methodId)) {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/payment/qr-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, method: methodId }),
        });
        const data = await res.json();
        if (data.success) {
          setQrUrl(data.qrUrl);
          setShowQR(true);
          setShowBank(false);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setShowQR(false);
      setShowBank(false);
    }
  };

  const confirmPayment = () => {
    onPaymentComplete(selectedMethod, {
      amount,
      method: selectedMethod,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-4">
      {/* Payment Options */}
      <div className="grid grid-cols-2 gap-3">
        {paymentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
              selectedMethod === option.id
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <span className="text-3xl">{option.icon}</span>
            <span className="text-xs font-bold">{option.name}</span>
          </button>
        ))}
      </div>

      {/* QR Code Display */}
      {showQR && (
        <div className="bg-white p-4 rounded-xl text-center">
          <p className="text-black font-bold mb-2">Scan to Pay Rs. {amount}</p>
          <div className="bg-gray-200 w-48 h-48 mx-auto flex items-center justify-center">
            {/* Real QR Code Image */}
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
              alt="Payment QR"
              className="w-full h-full"
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">Scan with {selectedMethod} app</p>
          
          <button
            onClick={confirmPayment}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold"
          >
            ✅ मैले भुक्तानी गरिसकेँ
          </button>
        </div>
      )}

      {/* Bank Transfer Details */}
      {showBank && (
        <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-xl">
          <h3 className="font-bold text-blue-400 mb-3">🏦 बैंक विवरण</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">Account Name:</span> Smart Team Networks Pvt. Ltd.</p>
            <p><span className="text-gray-400">Account Number:</span> 0123456789</p>
            <p><span className="text-gray-400">Bank:</span> Nabil Bank</p>
            <p><span className="text-gray-400">Branch:</span> Tulsipur, Dang</p>
            <p><span className="text-gray-400">Swift:</span> NABILNPK</p>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-xs">
              💡 भुक्तानी गरेपछि स्क्रीनशट खिच्नुहोस् र "अर्डर गर्नुहोस्" मा क्लिक गर्नुहोस्
            </p>
          </div>

          <button
            onClick={confirmPayment}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold"
          >
            ✅ मैले बैंकमा भुक्तानी गरिसकेँ
          </button>
        </div>
      )}

      {/* Cash on Delivery */}
      {selectedMethod === 'cod' && (
        <button
          onClick={confirmPayment}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold"
        >
          💵 Cash on Delivery अर्डर गर्नुहोस्
        </button>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin inline-block w-8 h-8 border-2 border-cyan-500 rounded-full"></div>
          <p className="text-sm text-gray-400 mt-2">QR Code generating...</p>
        </div>
      )}
    </div>
  );
}