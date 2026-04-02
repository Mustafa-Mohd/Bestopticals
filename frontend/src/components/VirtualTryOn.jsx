import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, X, RefreshCw, ZoomIn, ZoomOut, Sparkles, Wand2, Info, Check, MonitorPlay } from 'lucide-react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const VirtualTryOn = ({ product, onClose }) => {
    const [userImage, setUserImage] = useState(null);
    const [processedSpecs, setProcessedSpecs] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    // position in % relative to image dimensions
    const [glassPosition, setGlassPosition] = useState({ x: 50, y: 40, widthPercent: 50, rotation: 0, skew: 0 });
    const [dragging, setDragging] = useState(false);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [aiStatus, setAiStatus] = useState("Initializing model...");
    const [step, setStep] = useState(1); // 1: Select Source, 2: Auto-Calibration, 3: AR View

    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    // Model reference
    const faceLandmarkerRef = useRef(null);

    const originalSpecsUrl = Array.isArray(product.images) ? product.images[0] : (product.images || product.image);

    // Load AI Model
    useEffect(() => {
        const initAI = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
                const landmarker = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: false,
                    runningMode: "IMAGE",
                    numFaces: 1
                });
                faceLandmarkerRef.current = landmarker;
            } catch (err) {
                console.error("AI Init Error:", err);
            }
        };
        initAI();
        return () => {
            if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
        };
    }, []);

    // Frame Background Removal
    const processFrame = useCallback(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = originalSpecsUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                const lum = (r + g + b) / 3;
                if (lum > 240) data[i + 3] = 0;
            }
            ctx.putImageData(imageData, 0, 0);
            setProcessedSpecs(canvas.toDataURL());
        };
        img.onerror = () => setProcessedSpecs(originalSpecsUrl);
    }, [originalSpecsUrl]);

    useEffect(() => { processFrame(); }, [processFrame]);

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setUserImage(ev.target.result);
                setStep(2);
                autoCalibrate(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const autoCalibrate = async (imageSrc) => {
        setIsLoadingAI(true);
        setAiStatus("Detecting Face...");

        const img = new Image();
        img.src = imageSrc;
        await new Promise(r => img.onload = r);

        if (!faceLandmarkerRef.current) {
            setAiStatus("Loading AI Models...");
            await new Promise(r => setTimeout(r, 2000));
        }

        if (faceLandmarkerRef.current) {
            setAiStatus("Analyzing Facial Structure...");
            try {
                // Yield thread to allow UI to update loading state
                await new Promise(r => setTimeout(r, 50));
                const results = faceLandmarkerRef.current.detect(img);

                if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                    const landmarks = results.faceLandmarks[0];

                    // Left and right eye outer corners
                    // Use widest points of face to fit handles over the ears perfectly
                    // 234 is left temple/ear, 454 is right temple/ear
                    const p1 = landmarks[234];
                    const p2 = landmarks[454];

                    const x1 = p1.x * 100;
                    const y1 = p1.y * 100;
                    const z1 = p1.z * 100;
                    const x2 = p2.x * 100;
                    const y2 = p2.y * 100;
                    const z2 = p2.z * 100;

                    // Align center position directly on the nose bridge for absolute physical accuracy
                    const pNose = landmarks[168]; // 168 is exactly between the eyes
                    
                    const centerX = pNose.x * 100;
                    const centerY = pNose.y * 100;

                    // The distance between the temples dictates exact perfect face width
                    const distWidth = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                    // Glasses width proportionally matching the face width
                    const glassesWidth = distWidth * 1.05; // Tighten width so it doesn't overextend

                    // Roll (Tilt Head sideways)
                    let roll = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
                    if (roll > 90) roll -= 180;
                    if (roll < -90) roll += 180;

                    // Yaw (Turn Head left/right) relative to Z depth
                    let yaw = Math.atan2(z1 - z2, x2 - x1) * (180 / Math.PI);

                    setGlassPosition({
                        x: centerX,
                        y: centerY,
                        widthPercent: glassesWidth,
                        rotation: roll,
                        skew: yaw // applied as rotateY
                    });

                    setAiStatus("Perfect Fit Found!");
                } else {
                    setAiStatus("Face not detected, using defaults...");
                }
            } catch (err) {
                console.error("Detection error:", err);
            }
        }

        setTimeout(() => {
            setIsLoadingAI(false);
            setStep(3);
        }, 1000);
    };

    // Camera handling
    const capture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUserImage(dataUrl);
        stopCamera();
        setIsCameraActive(false);
        setStep(2);
        autoCalibrate(dataUrl);
    };

    const startCamera = async () => {
        setIsCameraActive(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
        }
    };

    const mod = (prop, val) => {
        setGlassPosition(p => ({ ...p, [prop]: p[prop] + val }));
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#000015]/98 text-primary-900 flex items-center justify-center p-0 md:p-10 backdrop-blur-3xl animate-fade-in">
            <div className="bg-white rounded-none md:rounded-[3rem] w-full max-w-6xl h-full md:h-[90vh] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                {/* Lenskart-style Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-900 text-white rounded-2xl flex items-center justify-center font-black italic shadow-lg shadow-primary-900/20">LK</div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight">3D AI TRYO-ON</h2>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-teal uppercase tracking-widest">
                                <Sparkles size={10} /> Auto-Fit Face Detection Enabled
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"><X size={20} /></button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                    {/* The Stage */}
                    <div className="flex-1 bg-gray-50 relative overflow-hidden flex flex-col items-center justify-center" ref={containerRef}>

                        {step === 1 && !isCameraActive && (
                            <div className="text-center p-12 max-w-md animate-fade-in">
                                <div className="w-24 h-24 bg-teal/10 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-lg shadow-teal/30">
                                    <Camera size={40} className="text-teal" />
                                </div>
                                <h3 className="text-3xl font-black mb-3">Instant AR Fitting</h3>
                                <p className="text-gray-500 mb-10 leading-relaxed font-medium text-sm">Upload a selfie or use camera. Our AI will automatically detect your face and apply the glasses perfectly.</p>
                                <div className="flex flex-col gap-4">
                                    <button onClick={startCamera} className="w-full py-4 bg-primary-900 text-white rounded-2xl font-black hover:bg-teal transition-all shadow-xl shadow-primary-900/20">USE LIVE CAMERA</button>
                                    <button onClick={() => fileInputRef.current.click()} className="w-full py-4 bg-white border-2 border-primary-900 text-primary-900 rounded-2xl font-black hover:bg-gray-50 transition-all">UPLOAD PHOTO</button>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
                            </div>
                        )}

                        {isCameraActive && (
                            <div className="w-full h-full relative">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-[340px] h-[450px] border-[4px] border-white/50 border-dashed rounded-[170px/225px] flex items-center justify-center">
                                        <div className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 shadow-2xl">Position face in oval</div>
                                    </div>
                                </div>
                                <button onClick={capture} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-white rounded-full flex items-center justify-center group active:scale-90 transition-all">
                                    <div className="w-16 h-16 bg-white rounded-full"></div>
                                </button>
                            </div>
                        )}

                        {(step === 2 || step === 3) && userImage && (
                            <div className="relative w-full h-full flex items-center justify-center p-4">
                                <div className="relative inline-block max-w-full max-h-full">
                                    <img src={userImage} alt="User Face" className="max-w-full max-h-full block rounded-3xl shadow-xl w-auto h-auto" style={{ maxHeight: '80vh' }} />

                                    {isLoadingAI && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-white z-50 transition-all animate-fade-in">
                                            <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mb-6 shadow-lg shadow-teal/20"></div>
                                            <div className="font-black text-2xl tracking-tighter italic shadow-sm">AI <span className="text-teal">SYNCING...</span></div>
                                            <p className="font-bold text-xs mt-4 uppercase tracking-[0.2em] text-white/80">{aiStatus}</p>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div
                                            onMouseDown={() => setDragging(true)}
                                            onMouseMove={(e) => {
                                                if (!dragging) return;
                                                // calculate % based dragging over the image container bounding box!
                                                const frame = e.currentTarget.parentElement.getBoundingClientRect();
                                                const x = ((e.clientX - frame.left) / frame.width) * 100;
                                                const y = ((e.clientY - frame.top) / frame.height) * 100;
                                                setGlassPosition(p => ({ ...p, x, y }));
                                            }}
                                            onMouseUp={() => setDragging(false)}
                                            onMouseLeave={() => setDragging(false)}
                                            style={{
                                                position: 'absolute',
                                                left: `${glassPosition.x}%`,
                                                top: `${glassPosition.y}%`,
                                                width: `${glassPosition.widthPercent}%`,
                                                transform: `translate(-50%, -50%) perspective(800px) rotate(${glassPosition.rotation}deg) rotateY(${glassPosition.skew}deg) translateZ(10px)`,
                                                filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
                                                mixBlendMode: 'multiply',
                                                // Superior edge fading: completely opaque in the middle, fading rapidly at temples to cut off the handles
                                                WebkitMaskImage: 'linear-gradient(to right, transparent 8%, black 18%, black 82%, transparent 92%)',
                                                maskImage: 'linear-gradient(to right, transparent 8%, black 18%, black 82%, transparent 92%)',
                                                cursor: dragging ? 'grabbing' : 'grab',
                                                zIndex: 40,
                                                // Smooth interpolation when actively moving or rotating head
                                                transition: dragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)'
                                            }}
                                        >
                                            <img src={processedSpecs || originalSpecsUrl} alt="" className="w-full h-auto pointer-events-none" />
                                        </div>
                                    )}
                                </div>

                                {step === 3 && (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 backdrop-blur-xl p-2 rounded-3xl shadow-2xl border border-gray-100 z-50">
                                        <button onClick={() => mod('widthPercent', 2)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"><ZoomIn size={18} /></button>
                                        <button onClick={() => mod('widthPercent', -2)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"><ZoomOut size={18} /></button>
                                        <button onClick={() => mod('rotation', -4)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"><RefreshCw size={18} className="scale-x-[-1]" /></button>
                                        <button onClick={() => mod('rotation', 4)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"><RefreshCw size={18} /></button>
                                        <div className="w-px h-8 bg-gray-200 mx-2" />
                                        <button onClick={() => setStep(1)} className="p-3 bg-primary-900 text-white rounded-2xl flex items-center gap-2 px-6 font-black text-[10px] uppercase shadow-lg hover:bg-teal transition-colors">
                                            <MonitorPlay size={14} /> Re-Try
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className="w-full md:w-[400px] bg-white p-10 flex flex-col border-l border-gray-100 z-50">
                        <div className="flex-1">
                            <h3 className="text-[10px] font-black text-teal uppercase tracking-widest mb-8">Selected Frame</h3>
                            <div className="bg-gray-50 rounded-[2.5rem] p-8 mb-10 border border-gray-100 text-center relative overflow-hidden group">
                                <img src={originalSpecsUrl} alt="" className="w-full h-auto mb-6 transition-transform group-hover:scale-110" />
                                <h4 className="text-xl font-black text-primary-900 mb-2 leading-tight">{product.name}</h4>
                                <div className="text-2xl font-black text-primary-900">₹{product.price?.toLocaleString()}</div>
                                <div className="absolute top-4 right-4 bg-teal/10 text-teal text-[9px] font-black px-3 py-1 rounded-full uppercase">3D Ready</div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-teal/10 text-teal rounded-2xl flex items-center justify-center"><Check size={20} /></div>
                                    <div>
                                        <div className="text-sm font-black text-primary-900">Auto Face Detection</div>
                                        <div className="text-[11px] font-bold text-gray-400">Powered by advanced AI models</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Check size={20} /></div>
                                    <div>
                                        <div className="text-sm font-black text-primary-900">Precision Fit 3D</div>
                                        <div className="text-[11px] font-bold text-gray-400">Calculates accurate facial geometry</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={onClose} className="w-full py-5 bg-primary-900 text-white rounded-[2rem] font-black text-sm shadow-xl shadow-primary-900/30 hover:bg-teal transition-all hover:-translate-y-1 hover:shadow-teal/40">
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualTryOn;
