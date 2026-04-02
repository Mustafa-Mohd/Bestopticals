import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Loader } from 'lucide-react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const SnapchatFilterTryOn = ({ product, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [statusText, setStatusText] = useState("Initializing AR Camera...");
    const [processedSpecs, setProcessedSpecs] = useState(null);

    const videoRef = useRef(null);
    const overlayRef = useRef(null);
    const faceLandmarkerRef = useRef(null);
    const streamRef = useRef(null);
    const requestRef = useRef(null);
    const videoContainerRef = useRef(null);

    const originalSpecsUrl = Array.isArray(product.images) ? product.images[0] : (product.images || product.image);

    // Filter white pixels for transparency
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
                if ((r + g + b) / 3 > 240) data[i + 3] = 0;
            }
            ctx.putImageData(imageData, 0, 0);
            setProcessedSpecs(canvas.toDataURL());
        };
        img.onerror = () => setProcessedSpecs(originalSpecsUrl);
    }, [originalSpecsUrl]);

    useEffect(() => { processFrame(); }, [processFrame]);

    // Initialize MediaPipe & Camera
    useEffect(() => {
        let isMounted = true;

        const initSetup = async () => {
            try {
                // 1. Init ML Model
                setStatusText("Loading AI Face Mesh...");
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
                
                faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: false,
                    runningMode: "VIDEO",
                    numFaces: 1
                });

                if (!isMounted) return;

                // 2. Init Camera
                setStatusText("Starting Camera...");
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
                });
                
                if (!isMounted) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setIsLoading(false);
                        detectLoop();
                    };
                }
            } catch (err) {
                console.error("AR Setup Error:", err);
                if (isMounted) setStatusText("Camera access denied or hardware error.");
            }
        };

        initSetup();

        return () => {
            isMounted = false;
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
        };
    }, []);

    // High-performance real-time face detection loop
    const detectLoop = () => {
        if (!videoRef.current || !faceLandmarkerRef.current || !overlayRef.current || !videoContainerRef.current) return;
        
        let startTimeMs = performance.now();
        
        if (videoRef.current.readyState >= 2) {
            const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
            
            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                overlayRef.current.style.display = "block";
                const landmarks = results.faceLandmarks[0];
                
                // Get video relative rendering dimensions
                const containerRect = videoContainerRef.current.getBoundingClientRect();
                const videoRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
                const containerRatio = containerRect.width / containerRect.height;
                
                let renderWidth, renderHeight, offsetX = 0, offsetY = 0;
                
                if (containerRatio > videoRatio) {
                    renderWidth = containerRect.width;
                    renderHeight = containerRect.width / videoRatio;
                    offsetY = (containerRect.height - renderHeight) / 2;
                } else {
                    renderHeight = containerRect.height;
                    renderWidth = containerRect.height * videoRatio;
                    offsetX = (containerRect.width - renderWidth) / 2;
                }

                // Landmarks 234 and 454 are temples
                const leftTemple = landmarks[234];
                const rightTemple = landmarks[454];
                const noseBridge = landmarks[168];

                // Transform points to mirrored screen coordinates
                const visualLeftX = (1 - leftTemple.x) * renderWidth + offsetX;
                const visualLeftY = leftTemple.y * renderHeight + offsetY;

                const visualRightX = (1 - rightTemple.x) * renderWidth + offsetX;
                const visualRightY = rightTemple.y * renderHeight + offsetY;

                // Center position using nose bridge
                const centerX = (1 - noseBridge.x) * renderWidth + offsetX; // mirrored
                const centerY = noseBridge.y * renderHeight + offsetY - (renderHeight * 0.02); // minor shift up

                // Calculate Width
                const dx = visualRightX - visualLeftX;
                const dy = visualRightY - visualLeftY;
                const eyeDist = Math.sqrt(dx * dx + dy * dy);
                const glassesWidth = eyeDist * 1.05; // Tight fit

                // Calculate Rotation from Visual Left to Visual Right
                let roll = Math.atan2(dy, dx) * (180 / Math.PI);

                // Calculate Skew / Yaw using z-index
                const zDiff = leftTemple.z - rightTemple.z;
                let yaw = zDiff * -150;

                // Apply styles directly
                overlayRef.current.style.left = `${centerX}px`;
                overlayRef.current.style.top = `${centerY}px`;
                overlayRef.current.style.width = `${glassesWidth}px`;
                overlayRef.current.style.transform = `translate(-50%, -50%) perspective(800px) rotate(${roll + 180}deg) rotateY(${yaw}deg)`;
            } else {
                overlayRef.current.style.display = "none";
            }
        }
        
        requestRef.current = requestAnimationFrame(detectLoop);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center animate-fade-in">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center font-black animate-pulse">AR</div>
                    <div>
                        <h2 className="text-xl font-black">Snapchat Filter Try-On</h2>
                        <p className="text-xs font-bold text-white/70">Live 3D Face Tracking</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-all">
                    <X size={20} />
                </button>
            </div>

            {/* Video Canvas Container */}
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-zinc-900" ref={videoContainerRef}>
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-zinc-900 backdrop-blur-xl">
                        <Loader className="animate-spin text-yellow-400 mb-4" size={40} />
                        <div className="text-lg font-bold">{statusText}</div>
                    </div>
                )}
                
                <video 
                    ref={videoRef} 
                    className="absolute w-full h-full object-cover scale-x-[-1]" 
                    playsInline 
                    muted 
                />

                {/* Glasses Overlay */}
                <img 
                    ref={overlayRef}
                    src={processedSpecs || originalSpecsUrl} 
                    alt="Glasses Overlay"
                    className="absolute pointer-events-none transform-gpu"
                    style={{
                        display: 'none',
                        transformOrigin: 'center center',
                        mixBlendMode: 'multiply',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 5%, black 15%, black 85%, transparent 95%)',
                        maskImage: 'linear-gradient(to right, transparent 5%, black 15%, black 85%, transparent 95%)',
                        // High performance GPU rendering
                        willChange: 'transform, left, top',
                        filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.5))'
                    }}
                />
            </div>
            
            {/* Product Footer Bar */}
            <div className="absolute bottom-6 inset-x-6 z-50">
                <div className="max-w-md mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 flex items-center gap-4 shadow-2xl">
                    <div className="w-16 h-16 bg-white rounded-2xl p-2 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={originalSpecsUrl} className="w-full h-auto object-contain" alt="Selected" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[10px] font-black tracking-widest text-yellow-400 uppercase">Currently Wearing</div>
                        <div className="font-bold text-sm leading-tight text-white line-clamp-1">{product.name}</div>
                        <div className="font-black text-sm text-white/90">₹{product.price?.toLocaleString()}</div>
                    </div>
                    <button className="bg-yellow-400 text-black font-black text-xs px-5 py-3 rounded-xl hover:bg-yellow-300 transition-colors">
                        Add Frame
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SnapchatFilterTryOn;
