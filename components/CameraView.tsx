
import React, { useRef, useEffect, useState } from 'react';

interface CameraViewProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const triggerCapture = () => {
    if (countdown !== null) return;
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      performCapture();
      setCountdown(null);
    }
  }, [countdown]);

  const performCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        // Strip prefix for the service
        const base64 = dataUrl.split(',')[1];
        // We call onCapture twice because the current App.tsx logic expects it (once for analysis, once for preview)
        // Note: The logic in App.tsx might need tightening, but we follow the established pattern.
        onCapture(base64);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="text-white font-black text-[10px] uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
          Center your meal
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="p-6 text-center text-white space-y-4">
            <i className="fas fa-exclamation-circle text-4xl text-red-500"></i>
            <p className="font-bold">{error}</p>
            <button onClick={onClose} className="text-green-400 font-black uppercase tracking-widest text-sm">Go Back</button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover transition-all duration-500 ${countdown !== null ? 'brightness-[0.4] scale-105' : 'brightness-100 scale-100'}`}
            />
            
            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white text-9xl font-black animate-in zoom-in duration-300 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  {countdown === 0 ? <i className="fas fa-camera"></i> : countdown}
                </div>
              </div>
            )}
            
            {/* Overlay Guide */}
            <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-300 ${countdown !== null ? 'opacity-0' : 'opacity-100'}`}>
                <div className="w-72 h-72 border-4 border-white/30 rounded-[3rem] border-dashed flex items-center justify-center">
                  <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                </div>
            </div>
          </>
        )}
      </div>

      <div className="h-44 bg-black flex flex-col items-center justify-center pb-8 space-y-4">
        {!error && (
          <>
            <button 
              onClick={triggerCapture}
              disabled={countdown !== null}
              className={`relative w-24 h-24 rounded-full p-1 border-4 transition-all duration-300 flex items-center justify-center active:scale-90 ${countdown !== null ? 'border-green-500 bg-green-500/20' : 'border-gray-400/30 bg-white'}`}
            >
              {countdown === null ? (
                <div className="w-full h-full bg-white rounded-full border-2 border-black/10 flex items-center justify-center">
                  <i className="fas fa-camera text-gray-900 text-xl"></i>
                </div>
              ) : (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-green-500"
                    style={{
                      strokeDasharray: '276',
                      strokeDashoffset: (276 * (3 - (countdown || 0))) / 3,
                      transition: 'stroke-dashoffset 1s linear'
                    }}
                  />
                </svg>
              )}
            </button>
            <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${countdown !== null ? 'text-green-500' : 'text-gray-500'}`}>
              {countdown !== null ? 'Hold Still...' : 'Tap to Scan'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
