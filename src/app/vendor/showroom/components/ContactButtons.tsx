interface ContactButtonsProps {
  phone: string;
  whatsapp: string;
  compact?: boolean;
}

export default function ContactButtons({ phone, whatsapp, compact = false }: ContactButtonsProps) {
  if (compact) {
    return (
      <>
        <a 
          href={`tel:${phone}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          📞 Call
        </a>
        <a 
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          💬 WhatsApp
        </a>
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3">📞 सम्पर्क गर्नुहोस्</h3>
      <div className="space-y-2">
        <a 
          href={`tel:${phone}`}
          className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <span>📞</span>
          <span>फोन गर्नुहोस्</span>
        </a>
        <a 
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
        >
          <span>💬</span>
          <span>WhatsApp गर्नुहोस्</span>
        </a>
      </div>
    </div>
  );
}