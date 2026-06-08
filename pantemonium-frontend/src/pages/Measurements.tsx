import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useMeasurementStore, UserMeasurements, FitStyle } from '@/stores/measurementStore'
import { toast } from 'sonner'
import { CheckCircle2, Info, ArrowRight, ArrowLeft, Camera } from 'lucide-react'
import { api } from '@/lib/api'

const MEASUREMENT_FIELDS = [
    { id: 'chest', label: 'Chest', icon: '📏', max: 150, min: 60, help: 'Measure around the fullest part of your chest, keeping the tape horizontal.' },
    { id: 'waist', label: 'Waist', icon: '📏', max: 140, min: 50, help: 'Measure around the narrowest part (typically where your body bends side to side).' },
    { id: 'hip', label: 'Hip', icon: '📏', max: 160, min: 60, help: 'Measure around the fullest part of your hips.' },
    { id: 'shoulder', label: 'Shoulder', icon: '📏', max: 80, min: 30, help: 'Measure from the end of one shoulder to the end of the other.' },
    { id: 'height', label: 'Height', icon: '🧍', max: 250, min: 100, help: 'Measure from top of head to the floor without shoes.' },
    { id: 'weight', label: 'Weight', icon: '⚖️', max: 200, min: 30, help: 'Your current body weight in kg.' },
]

export default function Measurements() {
    const navigate = useNavigate()
    const { updateMeasurements, setFitPreference, saveMeasurements, measurements, fitPreference } = useMeasurementStore()
    const [isSaving, setIsSaving] = useState(false)
    const [isScanning, setIsScanning] = useState(false)

    const [activeStep, setActiveStep] = useState(0)
    const [localMeasurements, setLocalMeasurements] = useState<Partial<UserMeasurements>>(
        measurements || { chest: 96, waist: 82, hip: 98, shoulder: 44, height: 178, weight: 75 }
    )
    const [unit, setUnit] = useState<'cm' | 'in'>('cm')

    // Handlers
    const handleNext = async () => {
        if (activeStep < MEASUREMENT_FIELDS.length) {
            setActiveStep(prev => prev + 1)
        } else {
            // Save and finish
            setIsSaving(true)
            try {
                updateMeasurements(localMeasurements)
                await saveMeasurements()
                toast.success('Measurements saved!', { icon: <CheckCircle2 className="text-green-500" /> })
                navigate('/dashboard')
            } catch {
                toast.error('Failed to save measurements. Please try again.')
            } finally {
                setIsSaving(false)
            }
        }
    }

    const handleBack = () => {
        if (activeStep > 0) setActiveStep(prev => prev - 1)
    }

    const triggerCVScan = async () => {
        setIsScanning(true)
        toast.info("Initializing CV Model...", { description: "Simulating camera capture based on your height." })
        try {
            const h = localMeasurements.height || 178
            const res = await api.post('/users/me/measurements/cv', { height_cm: h })

            setLocalMeasurements({
                chest: res.data.chest_cm,
                waist: res.data.waist_cm,
                hip: res.data.hip_cm,
                shoulder: res.data.shoulder_width_cm,
                height: res.data.height_cm,
                weight: res.data.weight_kg
            })
            toast.success("Computer Vision Scan Complete!", { description: "Measurements auto-populated." })
        } catch (error) {
            toast.error("CV Model Failed", { description: "Ensure the backend ML module is running." })
        } finally {
            setIsScanning(false)
        }
    }

    const updateValue = (id: keyof UserMeasurements, value: number) => {
        setLocalMeasurements(prev => ({ ...prev, [id]: value }))
    }

    // Value formatters
    const displayValue = (val: number | undefined) => {
        if (val === undefined) return ''
        if (unit === 'in' && activeStep !== 5) { // Skip weight for inch conversion (use lbs for weight ideally, but let's keep it simple)
            return (val / 2.54).toFixed(1)
        }
        return val.toString()
    }

    const isCompleteStep = activeStep === MEASUREMENT_FIELDS.length

    return (
        <div className="min-h-[90vh] pb-24 bg-background">
            {/* Progress Bar Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b px-4 py-4">
                <div className="container max-w-3xl mx-auto flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={handleBack} disabled={activeStep === 0}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">Step 2 of 3: Your Body Profile</p>
                        <div className="flex gap-1 mt-2 justify-center">
                            {[...Array(MEASUREMENT_FIELDS.length + 1)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i <= activeStep ? 'bg-primary w-8' : 'bg-secondary w-4'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <Button variant="ghost" className="text-primary font-medium" onClick={() => navigate('/dashboard')}>
                        Skip
                    </Button>
                </div>
            </div>

            <div className="container max-w-3xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">

                {/* Left visually representing body (simplified) */}
                <div className="hidden md:flex flex-col items-center justify-center w-64 pt-8 bg-secondary/20 rounded-3xl border border-dashed border-primary/20 relative">
                    <div className="w-32 h-64 relative">
                        {/* Simple body silhouette placeholder */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-14 bg-accent/20 rounded-[40%]"></div>
                        <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-24 h-32 bg-primary/20 rounded-2xl"></div>
                        <div className="absolute top-[60px] left-[-10px] w-8 h-24 bg-primary/20 rounded-full rotate-[15deg] origin-top"></div>
                        <div className="absolute top-[60px] right-[-10px] w-8 h-24 bg-primary/20 rounded-full rotate-[-15deg] origin-top"></div>
                        <div className="absolute top-[180px] left-[15px] w-10 h-32 bg-primary/20 rounded-full"></div>
                        <div className="absolute top-[180px] right-[15px] w-10 h-32 bg-primary/20 rounded-full"></div>

                        {/* Highlight indicator based on step */}
                        {!isCompleteStep && activeStep === 0 && <div className="absolute top-[80px] left-0 w-full h-2 bg-primary/60 blur-sm rounded-full animate-pulse" />}
                        {!isCompleteStep && activeStep === 1 && <div className="absolute top-[140px] left-0 w-full h-2 bg-primary/60 blur-sm rounded-full animate-pulse" />}
                        {!isCompleteStep && activeStep === 2 && <div className="absolute top-[180px] left-0 w-full h-2 bg-primary/60 blur-sm rounded-full animate-pulse" />}
                    </div>

                    {/* Unit toggle */}
                    <div className="mt-12 bg-background p-1 rounded-full border flex relative">
                        <button
                            className={`px-4 py-1.5 rounded-full text-sm font-medium z-10 transition-colors ${unit === 'cm' ? 'text-primary-foreground' : 'text-foreground'}`}
                            onClick={() => setUnit('cm')}
                        >
                            Metric (cm/kg)
                        </button>
                        <button
                            className={`px-4 py-1.5 rounded-full text-sm font-medium z-10 transition-colors ${unit === 'in' ? 'text-primary-foreground' : 'text-foreground'}`}
                            onClick={() => setUnit('in')}
                        >
                            Imperial (in/lbs)
                        </button>
                        <div
                            className="absolute top-1 bottom-1 bg-primary rounded-full transition-all duration-300 z-0"
                            style={{
                                left: unit === 'cm' ? '4px' : 'calc(50% + 2px)',
                                width: 'calc(50% - 6px)'
                            }}
                        />
                    </div>
                </div>

                {/* Right side form */}
                <div className="flex-1 relative min-h-[400px]">
                    {!isCompleteStep && (
                        <div className="flex justify-end mb-4">
                            <Button variant="outline" size="sm" onClick={triggerCVScan} disabled={isScanning} className="text-secondary-foreground">
                                <Camera className="w-4 h-4 mr-2" />
                                {isScanning ? "Scanning..." : "Auto-fill using Computer Vision"}
                            </Button>
                        </div>
                    )}
                    <AnimatePresence mode="wait">
                        {!isCompleteStep ? (
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <Card className="border-2 shadow-lg w-full bg-card overflow-hidden">
                                    <div className="bg-primary/5 p-6 border-b">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="text-4xl">{MEASUREMENT_FIELDS[activeStep].icon}</span>
                                            <h2 className="text-2xl font-display font-bold">{MEASUREMENT_FIELDS[activeStep].label}</h2>
                                        </div>
                                        <p className="text-muted-foreground text-sm flex gap-2">
                                            <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                                            {MEASUREMENT_FIELDS[activeStep].help}
                                        </p>
                                    </div>

                                    <CardContent className="p-8">
                                        <div className="flex flex-col items-center gap-8">
                                            <div className="relative flex items-end">
                                                <Input
                                                    type="number"
                                                    className="text-5xl font-display h-24 w-40 text-center bg-transparent border-t-0 border-l-0 border-r-0 border-b-4 border-primary rounded-none focus-visible:ring-0 focus-visible:border-accent p-0 font-bold"
                                                    value={displayValue(localMeasurements[MEASUREMENT_FIELDS[activeStep].id as keyof UserMeasurements])}
                                                    onChange={(e) => {
                                                        let val = parseFloat(e.target.value)
                                                        if (isNaN(val)) val = 0;
                                                        if (unit === 'in' && activeStep !== 5) {
                                                            val = val * 2.54 // Convert back to cm for state
                                                        }
                                                        updateValue(MEASUREMENT_FIELDS[activeStep].id as keyof UserMeasurements, val)
                                                    }}
                                                />
                                                <span className="text-xl font-bold text-muted-foreground ml-3 mb-4">
                                                    {activeStep === 5 ? (unit === 'cm' ? 'kg' : 'lbs') : (unit === 'cm' ? 'cm' : 'inches')}
                                                </span>
                                            </div>

                                            {/* Custom Slider */}
                                            <div className="w-full mt-4 space-y-2 relative">
                                                <input
                                                    type="range"
                                                    min={MEASUREMENT_FIELDS[activeStep].min}
                                                    max={MEASUREMENT_FIELDS[activeStep].max}
                                                    value={localMeasurements[MEASUREMENT_FIELDS[activeStep].id as keyof UserMeasurements] || 0}
                                                    onChange={(e) => updateValue(MEASUREMENT_FIELDS[activeStep].id as keyof UserMeasurements, parseFloat(e.target.value))}
                                                    className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                                />
                                                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                                                    <span>{MEASUREMENT_FIELDS[activeStep].min}</span>
                                                    <span>{MEASUREMENT_FIELDS[activeStep].max}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            // Fit Preference Step
                            <motion.div
                                key="fit-preference"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <h2 className="text-3xl font-display font-bold mb-2">Almost Done!</h2>
                                    <p className="text-muted-foreground">How do you prefer your clothes to fit?</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { style: 'Slim', label: 'Form-fitting' },
                                        { style: 'Regular', label: 'Standard fit' },
                                        { style: 'Relaxed', label: 'Looser' },
                                        { style: 'Oversized', label: 'Very loose' }
                                    ].map((fp) => (
                                        <button
                                            key={fp.style}
                                            onClick={() => setFitPreference(fp.style as FitStyle)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col items-center justify-center h-32 ${fitPreference === fp.style
                                                ? 'border-primary bg-primary/5 shadow-md scale-105'
                                                : 'border-border bg-card hover:border-primary/40'
                                                }`}
                                        >
                                            <span className="font-bold text-lg">{fp.style}</span>
                                            <span className="text-sm text-muted-foreground">{fp.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Button */}
                    <div className="mt-8 flex justify-end">
                        <Button size="lg" disabled={isSaving} className="w-full md:w-auto min-w-[200px] h-14 text-lg rounded-full group shadow-md hover:shadow-xl transition-all" onClick={handleNext}>
                            {isSaving ? 'Saving...' : isCompleteStep ? 'Complete Profile' : 'Continue'}
                            {isSaving ? null : isCompleteStep ? <CheckCircle2 className="ml-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
