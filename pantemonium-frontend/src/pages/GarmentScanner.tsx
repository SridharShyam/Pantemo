import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scan, Ruler, RefreshCw, ArrowLeft, Sparkles, Camera, Info, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGarmentStore } from '@/stores/garmentStore'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const SCAN_STEPS = [
    "Denoising & Preprocessing...",
    "Detecting Reference Object...",
    "Classifying Garment...",
    "Detecting 12 Keypoints...",
    "Calculating CM Measurements...",
    "Extracting Brand & Size Tags..."
]

export default function GarmentScanner() {
    const navigate = useNavigate()
    const { scanGarment, saveGarment, isScanning, lastScan, clearScan } = useGarmentStore()
    const [image, setImage] = useState<string | null>(null)
    const [category, setCategory] = useState('tops')
    const [scanStep, setScanStep] = useState(0)

    useEffect(() => {
        let interval: any
        if (isScanning) {
            setScanStep(0)
            interval = setInterval(() => {
                setScanStep(prev => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev))
            }, 800)
        }
        return () => clearInterval(interval)
    }, [isScanning])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setImage(reader.result as string)
            reader.readAsDataURL(file)
            clearScan()
        }
    }

    const handleScan = async () => {
        if (!image) return
        try {
            await scanGarment(image, category)
            toast.success("Garment Scan Complete!")
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleSave = (feedback?: string) => {
        if (image) {
            saveGarment(image, feedback)
            toast.success("Saved to your Digital Closet!")
        }
    }

    const reset = () => {
        setImage(null)
        clearScan()
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-display font-bold tracking-tight">AI Garment Scanner <span className="text-primary align-super text-xs bg-primary/10 px-2 py-0.5 rounded-full ml-2 uppercase">Pro</span></h1>
                        <p className="text-muted-foreground text-lg">Extract pixel-perfect measurements with one photo.</p>
                    </div>
                </div>
                {image && !isScanning && (
                    <Button variant="ghost" onClick={reset} className="text-muted-foreground hover:text-primary">
                        <RefreshCw className="w-4 h-4 mr-2" /> Reset Session
                    </Button>
                )}
            </div>

            <div className="grid lg:grid-cols-5 gap-12">
                {/* Left: Imaging Zone (3/5) */}
                <div className="lg:col-span-3 space-y-8">
                    <Card className={`relative overflow-hidden border-2 border-dashed transition-all duration-700 bg-secondary/5 ${image ? 'border-primary/40' : 'hover:border-primary/30 border-muted-foreground/10 group'}`}>
                        <CardContent className="p-0">
                            {!image ? (
                                <label className="flex flex-col items-center justify-center h-[600px] cursor-pointer">
                                    <div className="relative mb-8">
                                        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all animate-pulse" />
                                        <div className="relative bg-background w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl border group-hover:scale-110 transition-transform">
                                            <Camera className="w-10 h-10 text-primary" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Upload Garment</h3>
                                    <p className="text-muted-foreground text-center max-w-sm px-6">
                                        Lay garment flat on a neutral surface. Include a credit card in frame for 99.9% accuracy.
                                    </p>
                                    
                                    <div className="mt-10 grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-xl border text-[10px] font-bold uppercase tracking-wider">
                                            <div className="w-2 h-2 rounded-full bg-green-500" /> Lay Flat
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-xl border text-[10px] font-bold uppercase tracking-wider">
                                            <div className="w-2 h-2 rounded-full bg-green-500" /> Good Light
                                        </div>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            ) : (
                                <div className="relative h-[600px] bg-black/5 flex items-center justify-center">
                                    <img src={image} alt="Target" className="max-h-full max-w-full object-contain p-2" />
                                    
                                    {/* Scanning Animation */}
                                    <AnimatePresence>
                                        {isScanning && (
                                            <motion.div 
                                                initial={{ top: "0%" }}
                                                animate={{ top: "100%" }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(var(--primary-rgb),1)] z-10"
                                            >
                                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-primary text-[10px] text-primary-foreground px-2 py-0.5 rounded-full font-bold whitespace-nowrap shadow-lg">
                                                    EXTRACTING FEATURES...
                                                </div>
                                            </motion.div>
                                        )}
                                        {isScanning && (
                                            <div className="absolute inset-0 bg-primary/5 pointer-events-none animate-pulse backdrop-blur-[1px]" />
                                        )}
                                    </AnimatePresence>

                                    {/* Detected Points Overlay */}
                                    {lastScan && !isScanning && (
                                        <div className="absolute inset-0">
                                            {lastScan.detected_points.map((pt, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="absolute w-3 h-3 bg-primary rounded-full border-2 border-white shadow-xl cursor-help group z-20"
                                                    style={{ left: `${pt.x * 100}%`, top: `${pt.y * 100}%` }}
                                                >
                                                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background text-foreground border px-3 py-1.5 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none border-primary/20">
                                                        {pt.label}
                                                    </span>
                                                </motion.div>
                                            ))}
                                            {/* Draw lines between points simulation */}
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-primary/30 stroke-[1] fill-none">
                                                <path d={`M ${lastScan.detected_points[0].x*100}% ${lastScan.detected_points[0].y*100}% L ${lastScan.detected_points[1].x*100}% ${lastScan.detected_points[1].y*100}%`} />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-secondary/20 rounded-3xl border flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Info className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm font-bold">Calibration Active</p>
                                <p className="text-xs text-muted-foreground">Standard 85.6mm card detected as scale reference.</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-background">ACCURACY: 99.2%</Badge>
                    </div>
                </div>

                {/* Right: Results & Actions (2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {isScanning ? (
                            <motion.div 
                                key="scanning"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="h-full flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-primary/10 shadow-sm"
                            >
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Analyzing Garment</h3>
                                <div className="space-y-4 w-full mt-6">
                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(scanStep + 1) / SCAN_STEPS.length * 100}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                    <p className="text-sm font-medium text-center text-primary animate-pulse">
                                        {SCAN_STEPS[scanStep]}
                                    </p>
                                </div>
                            </motion.div>
                        ) : !lastScan ? (
                            <motion.div 
                                key="controls"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold">Select Category</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['tops', 'bottoms', 'outerwear'].map((cat) => (
                                            <button
                                              key={cat}
                                              onClick={() => setCategory(cat)}
                                              className={`py-4 rounded-2xl text-xs font-bold capitalize transition-all border-2 ${category === cat ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-background border-muted-foreground/10 hover:border-primary/30'}`}
                                            >
                                              {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button 
                                    className="w-full h-20 text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 group overflow-hidden relative"
                                    disabled={!image}
                                    onClick={handleScan}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-50 group-hover:translate-x-full transition-transform duration-1000" />
                                    <span className="relative flex items-center justify-center gap-3">
                                        <Scan className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        Initialize Pro Scan
                                    </span>
                                </Button>

                                <Card className="border-dashed bg-transparent">
                                    <CardContent className="p-6">
                                        <h4 className="font-bold flex items-center gap-2 mb-4">
                                            <Ruler className="w-4 h-4 text-primary" /> How it works
                                        </h4>
                                        <ul className="space-y-3">
                                            {[
                                                "CV detects garment boundaries",
                                                "Keypoint regression finds 12 marker points",
                                                "Reference card provides pixel-to-cm ratio",
                                                "AI matches measurements against brand DB"
                                            ].map((text, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5 text-primary" />
                                                    {text}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <Card className="border-primary/20 bg-primary/[0.01] overflow-hidden shadow-2xl relative">
                                    <div className="absolute top-0 right-0 px-4 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-tighter rounded-bl-xl">
                                        SUCCESS RATE: 99%
                                    </div>
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="bg-primary/5 w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden border border-primary/20">
                                                <img 
                                                    src={lastScan.category === 'tops' ? '/apparel/tshirt.png' : lastScan.category === 'outerwear' ? '/apparel/jacket.png' : '/apparel/jeans.png'} 
                                                    alt="Scan Result" 
                                                    className="w-full h-full object-cover scale-125" 
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-2xl tracking-tighter">{lastScan.brand} Detected</h3>
                                                <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Category: {lastScan.category}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="p-5 bg-background border-2 border-primary/10 rounded-3xl text-center">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">OCR Size</p>
                                                <p className="text-3xl font-display font-black text-primary">{lastScan.detected_size}</p>
                                            </div>
                                            <div className="p-5 bg-background border-2 border-primary/10 rounded-3xl text-center">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Actual Fit</p>
                                                <p className="text-3xl font-display font-black text-primary">{lastScan.inferred_size}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {Object.entries(lastScan.measurements).map(([key, val], i) => (
                                                <motion.div 
                                                    key={key}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="flex items-center justify-between p-4 bg-background border rounded-2xl"
                                                >
                                                    <span className="text-sm font-bold capitalize text-muted-foreground">{key.replace('_cm', '')}</span>
                                                    <span className="font-display font-black text-xl">{val}<span className="text-xs font-normal ml-1">cm</span></span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-dashed">
                                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-accent" /> Comparative Recommendations
                                            </h4>
                                            <div className="space-y-3">
                                                {lastScan.comparative_recommendations.map((rec, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-[10px] font-bold border">{rec.brand.charAt(0)}</div>
                                                            <div>
                                                                <p className="text-xs font-bold">{rec.brand}</p>
                                                                <p className="text-[10px] text-muted-foreground">{rec.note || 'Size Match'}</p>
                                                            </div>
                                                        </div>
                                                        <Badge className="bg-primary text-primary-foreground">SIZE {rec.size}</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-10 space-y-4">
                                            <p className="text-center text-sm font-bold text-muted-foreground">HOW DOES THIS FIT YOU?</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['too_tight', 'perfect', 'too_loose'].map((f) => (
                                                    <Button 
                                                        key={f}
                                                        variant="outline" 
                                                        className="h-14 rounded-xl capitalize font-bold hover:bg-primary hover:text-primary-foreground border-2"
                                                        onClick={() => handleSave(f)}
                                                    >
                                                        {f.replace('_', ' ')}
                                                    </Button>
                                                ))}
                                            </div>
                                            <Button 
                                                className="w-full h-14 rounded-2xl gap-3 font-bold"
                                                onClick={() => handleSave()}
                                            >
                                                <Save className="w-5 h-5" /> Save to Digital Closet
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
