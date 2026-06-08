import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useRecommendationStore } from '@/stores/recommendationStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConfidenceGauge } from '@/components/shared/ConfidenceGauge'
import { Target, Shirt, ShoppingBag, Save, Share2, Ruler, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import JSConfetti from 'js-confetti'

export default function RecommendationResult() {
    const { id } = useParams()
    const { currentRecommendation, history, saveRecommendation, submitFeedback } = useRecommendationStore()

    const rec = currentRecommendation || history.find(r => r.id === id) || history[0]

    const [showDetails, setShowDetails] = useState(false)
    const [showFeedback, setShowFeedback] = useState(false)
    const [feedbackState, setFeedbackState] = useState<'prompt' | 'options' | 'done'>('prompt')

    React.useEffect(() => {
        if (rec.confidence >= 80) {
            new JSConfetti().addConfetti({
                emojis: ['🎉', '✨', '👕', '🎯'],
                confettiNumber: 40,
            })
        }

        // Show feedback prompt after 5 seconds
        const timer = setTimeout(() => setShowFeedback(true), 5000)
        return () => clearTimeout(timer)
    }, [rec.confidence])

    const handleSave = () => {
        saveRecommendation(rec.id)
        toast.success('Recommendation saved to your history', {
            icon: <Save className="h-4 w-4" />
        })
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard', {
            icon: <Share2 className="h-4 w-4" />
        })
    }

    if (!rec) return <div className="text-center p-24">Recommendation not found</div>

    const isHighConfidence = rec.confidence >= 80
    const isMediumConfidence = rec.confidence >= 60 && rec.confidence < 80

    const getConfidenceColor = () => {
        if (isHighConfidence) return 'text-green-500 bg-green-500/10 border-green-500/20'
        if (isMediumConfidence) return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
        return 'text-red-500 bg-red-500/10 border-red-500/20'
    }

    const getGradient = () => {
        if (isHighConfidence) return 'from-green-500/20 via-primary/5 to-transparent'
        if (isMediumConfidence) return 'from-amber-500/20 via-primary/5 to-transparent'
        return 'from-red-500/20 via-primary/5 to-transparent'
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <Link to="/history" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 -ml-4 text-muted-foreground"><ChevronDown className="h-4 w-4 mr-2 rotate-90" /> Back to History</Link>
                <Badge variant="outline" className="font-mono">{rec.timestamp.split('T')[0]}</Badge>
            </div>

            {/* Main Result Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`w-full bg-gradient-to-b ${getGradient()} rounded-[2rem] p-1 border shadow-2xl relative overflow-hidden mb-8`}
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 mix-blend-multiply pointer-events-none">
                    <Shirt className="w-64 h-64" />
                </div>

                <div className="bg-card/90 backdrop-blur-xl rounded-[1.9rem] p-8 md:p-12 text-center relative z-10">
                    <Badge className="mb-6 font-display font-bold uppercase tracking-widest">{rec.brand} • {rec.category}</Badge>

                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Your Perfect Size</h2>

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 15, delay: 0.3 }}
                        className="w-48 h-48 mx-auto bg-gradient-to-br from-primary to-accent rounded-[2rem] flex items-center justify-center mb-8 shadow-inner shadow-black/20 text-white rotate-3"
                    >
                        <div className="w-[11rem] h-[11rem] bg-card/10 backdrop-blur rounded-[1.5rem] flex flex-col items-center justify-center -rotate-3 border border-white/20">
                            <span className="text-8xl font-black font-display tracking-tighter leading-none shadow-sm">{rec.size}</span>
                            <span className="text-sm font-bold uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full mt-2">({rec.fitStyle})</span>
                        </div>
                    </motion.div>

                    <div className="flex flex-col items-center max-w-sm mx-auto p-6 rounded-2xl bg-secondary/50 border shadow-sm">
                        <div className="flex justify-between items-center w-full mb-4">
                            <span className="font-display font-bold text-lg">Fit Confidence</span>
                            <span className={`font-bold flex items-center px-2 py-1 rounded-md text-sm border ${getConfidenceColor()}`}>
                                {isHighConfidence ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <AlertTriangle className="w-4 h-4 mr-1" />}
                                {isHighConfidence ? 'High' : isMediumConfidence ? 'Medium' : 'Low'}
                            </span>
                        </div>
                        <ConfidenceGauge score={rec.confidence} variant="linear" animated className="w-full h-8" showLabel={false} />
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
            >
                <Button size="lg" className="h-16 text-lg rounded-xl shadow-lg hover:translate-y-[-2px] transition-all bg-primary hover:bg-primary/90 text-primary-foreground group">
                    <ShoppingBag className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Shop Now
                </Button>
                <Button size="lg" variant="outline" className="h-16 text-lg rounded-xl shadow-sm hover:translate-y-[-2px] transition-all bg-card hover:bg-secondary group" onClick={handleSave}>
                    <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Save Size
                </Button>
                <Button size="lg" variant="outline" className="h-16 text-lg rounded-xl shadow-sm hover:translate-y-[-2px] transition-all bg-card hover:bg-secondary group" onClick={handleShare}>
                    <Share2 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Share
                </Button>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* How We Calculated This */}
                <Card className="bg-card border shadow-sm overflow-hidden h-fit">
                    <div className="p-6 border-b bg-secondary/30 flex justify-between items-center cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => setShowDetails(!showDetails)}>
                        <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-primary" />
                            <h3 className="font-display font-bold text-lg">How we calculated this</h3>
                        </div>
                        {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>

                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">Your Measurements</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-secondary p-3 rounded-lg flex justify-between">
                                                <span className="text-muted-foreground text-sm">Chest</span>
                                                <span className="font-bold font-mono">96 cm</span>
                                            </div>
                                            <div className="bg-secondary p-3 rounded-lg flex justify-between">
                                                <span className="text-muted-foreground text-sm">Waist</span>
                                                <span className="font-bold font-mono">82 cm</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">{rec.brand} Size {rec.size} ({rec.fitStyle}) Range</p>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="w-16">Chest</span>
                                                <div className="flex-1 mx-4 bg-secondary h-2.5 rounded-full relative">
                                                    <div className="absolute h-full inset-y-0 left-[20%] right-[20%] bg-primary/20 rounded-full" />
                                                    <div className="absolute w-2 h-4 bg-primary -top-[3px] left-[50%] rounded-sm shadow-sm z-10" />
                                                </div>
                                                <span className="font-mono w-24 text-right">94-100 cm</span>
                                            </div>
                                            <div className="flex justify-end text-xs text-green-500 font-medium">✓ Perfect Match (95%)</div>

                                            <div className="flex items-center justify-between text-sm pt-2">
                                                <span className="w-16">Waist</span>
                                                <div className="flex-1 mx-4 bg-secondary h-2.5 rounded-full relative">
                                                    <div className="absolute h-full inset-y-0 left-[30%] right-[30%] bg-primary/20 rounded-full" />
                                                    <div className="absolute w-2 h-4 bg-primary -top-[3px] left-[40%] rounded-sm shadow-sm z-10" />
                                                </div>
                                                <span className="font-mono w-24 text-right">80-86 cm</span>
                                            </div>
                                            <div className="flex justify-end text-xs text-green-500 font-medium">✓ Perfect Match (90%)</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                {/* Alternative Sizes */}
                <Card className="bg-card border shadow-sm">
                    <div className="p-6 border-b flex items-center gap-3">
                        <Ruler className="w-5 h-5 text-primary" />
                        <h3 className="font-display font-bold text-lg">Alternative Sizes</h3>
                    </div>
                    <CardContent className="p-6 space-y-4">
                        {/* Smaller Size */}
                        <div className="flex justify-between items-center p-4 border rounded-xl hover:border-primary/50 transition-colors bg-secondary/20 cursor-pointer">
                            <div>
                                <h4 className="font-bold text-lg">Size S</h4>
                                <p className="text-sm text-muted-foreground mb-2">If you prefer a much tighter fit</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                                        <div className="bg-amber-500 h-full w-[72%]" />
                                    </div>
                                    <span className="text-xs font-bold font-mono">72%</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center font-bold">
                                S
                            </div>
                        </div>

                        {/* Larger Size */}
                        <div className="flex justify-between items-center p-4 border rounded-xl hover:border-primary/50 transition-colors bg-secondary/20 cursor-pointer">
                            <div>
                                <h4 className="font-bold text-lg">Size XL</h4>
                                <p className="text-sm text-muted-foreground mb-2">For a very loose, baggy comfortable fit</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                                        <div className="bg-amber-500 h-full w-[65%]" />
                                    </div>
                                    <span className="text-xs font-bold font-mono">65%</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center font-bold">
                                XL
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Feedback Prompt (Sticky Bottom on Mobile) */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-96 bg-card border-2 shadow-2xl rounded-2xl p-6 z-50 flex flex-col items-center"
                    >
                        <button
                            onClick={() => setShowFeedback(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >✕</button>

                        {feedbackState === 'prompt' && (
                            <>
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                    <Shirt className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold font-display mb-2 text-center">Did you purchase this?</h3>
                                <p className="text-muted-foreground text-sm text-center mb-6">Your feedback makes our AI smarter for your next purchase.</p>

                                <div className="flex gap-4 w-full">
                                    <Button className="flex-1" onClick={() => setFeedbackState('options')}>
                                        Yes, I bought it
                                    </Button>
                                    <Button variant="outline" className="flex-1" onClick={() => setShowFeedback(false)}>
                                        Not yet
                                    </Button>
                                </div>
                            </>
                        )}

                        {feedbackState === 'options' && (
                            <>
                                <h3 className="text-xl font-bold font-display mb-2 text-center">How did it fit?</h3>
                                <p className="text-muted-foreground text-sm text-center mb-6">Rate the sizing to train our ML accuracy model.</p>

                                <div className="grid grid-cols-1 gap-3 w-full">
                                    <Button variant="outline" className="w-full justify-start items-center group"
                                        onClick={() => {
                                            submitFeedback(rec.id, 'perfect');
                                            setFeedbackState('done');
                                        }}>
                                        <span className="w-6 h-6 rounded bg-green-500/10 text-green-500 mr-3 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">✓</span> Perfect Match
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start items-center group"
                                        onClick={() => {
                                            submitFeedback(rec.id, 'too_small');
                                            setFeedbackState('done');
                                        }}>
                                        <span className="w-6 h-6 rounded bg-amber-500/10 text-amber-500 mr-3 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">↔</span> Too Small
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start items-center group border-destructive/20 hover:bg-destructive/5"
                                        onClick={() => {
                                            submitFeedback(rec.id, 'returned');
                                            setFeedbackState('done');
                                        }}>
                                        <span className="w-6 h-6 rounded bg-red-500/10 text-red-500 mr-3 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">✕</span> Returned it
                                    </Button>
                                </div>
                            </>
                        )}

                        {feedbackState === 'done' && (
                            <div className="py-4 text-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold font-display mb-2">Feedback Received</h3>
                                <p className="text-muted-foreground text-sm mb-6">Our NLP & Collaborative filtering models have been updated successfully.</p>
                                <Button className="w-full" onClick={() => setShowFeedback(false)}>Dismiss</Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
