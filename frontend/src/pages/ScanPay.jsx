import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { motion } from "framer-motion";
import { QrCode, Wallet, CheckCircle2 } from "lucide-react";

export default function ScanPay() {
  const [upiLink, setUpiLink] = useState("");
  const [merchant, setMerchant] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");

  const [scannerStopped, setScannerStopped] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (scannerStopped) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          if (decodedText.startsWith("upi://")) {
            setUpiLink(decodedText);

            const params = new URLSearchParams(
              decodedText.split("?")[1]
            );

            setMerchant(params.get("pn") || "Unknown Merchant");
            setUpiId(params.get("pa") || "Not Available");
            setAmount(params.get("am") || "Not Specified");

            scanner.clear();
          }
        } catch (err) {
          console.error(err);
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerStopped]);

  const handlePay = () => {
    if (!upiLink) return;
    window.location.href = upiLink;
  };

  const restartCamera = () => {
    setUpiLink("");
    setMerchant("");
    setUpiId("");
    setAmount("");
    setScannerStopped(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const qrScanner = new Html5Qrcode("reader");

      const decodedText = await qrScanner.scanFile(file, true);

      if (decodedText.startsWith("upi://")) {
        setUpiLink(decodedText);

        const params = new URLSearchParams(
          decodedText.split("?")[1]
        );

        setMerchant(params.get("pn") || "Unknown Merchant");
        setUpiId(params.get("pa") || "Not Available");
        setAmount(params.get("am") || "Not Specified");
      }
    } catch (err) {
      alert("No QR code found in image");
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
      }}
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1
          className="text-4xl font-bold mb-2"
          style={{
            background:
              "linear-gradient(90deg,#c4b5fd,#818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Scan & Pay
        </h1>

        <p className="text-gray-400 mb-8">
          Scan any UPI QR and pay instantly
        </p>
      </motion.div>

      {/* Scanner */}
      <div
        className="rounded-3xl p-5 mb-6"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <QrCode size={24} color="#a78bfa" />
          <span className="text-white font-semibold">
            UPI QR Scanner
          </span>
        </div>

        {!scannerStopped ? (
          <>
            <div
              id="reader"
              style={{
                width: "100%",
                minHeight: "350px",
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            />

            <button
              onClick={() => setScannerStopped(true)}
              className="w-full mt-4 py-3 rounded-2xl text-white font-bold"
              style={{
                background:
                  "linear-gradient(135deg,#ef4444,#dc2626)",
              }}
            >
              Stop Scanning
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              onClick={restartCamera}
              className="w-full py-4 rounded-2xl text-white font-bold"
              style={{
                background:
                  "linear-gradient(135deg,#6366f1,#8b5cf6)",
              }}
            >
              📷 Open Camera Again
            </button>

            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full py-4 rounded-2xl text-white font-bold"
              style={{
                background:
                  "linear-gradient(135deg,#14b8a6,#06b6d4)",
              }}
            >
              🖼️ Upload QR Image
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={handleImageUpload}
            />
          </div>
        )}
      </div>

      {/* Result */}
      {upiLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 size={28} color="#4ade80" />
            <h2 className="text-2xl font-bold text-white">
              QR Detected
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-gray-400 text-sm">Merchant</p>
              <p className="text-white font-semibold">{merchant}</p>
            </div>

            <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-gray-400 text-sm">UPI ID</p>
              <p className="text-white font-semibold break-all">{upiId}</p>
            </div>

            <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-gray-400 text-sm">Amount</p>
              <p className="text-green-400 font-bold">₹{amount}</p>
            </div>
          </div>

          <button
            onClick={handlePay}
            className="w-full mt-6 py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-bold"
            style={{
              background:
                "linear-gradient(135deg,#6366f1,#8b5cf6)",
            }}
          >
            <Wallet size={20} />
            Proceed To Pay
          </button>
        </motion.div>
      )}
    </div>
  );
}