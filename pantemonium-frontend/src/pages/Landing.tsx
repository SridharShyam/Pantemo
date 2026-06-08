import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Brain, Globe, Camera, Sparkles, Ruler, Database, Zap, ShieldCheck, Heart, Sliders as SlidersIcon, Layers, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConfidenceGauge } from '@/components/shared/ConfidenceGauge'
import { useRef } from 'react'

export default function Landing() {
    const navigate = useNavigate()
    const scrollRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"]
    })

    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.8
            } 
        }
    }

    return (
        <div ref={scrollRef} className="flex flex-col w-full overflow-hidden bg-background">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0 animate-mesh opacity-60" />
                <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40 z-0" />
                
                <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
                    <motion.div
                        style={{ scale: heroScale, opacity: heroOpacity }}
                        className="flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge variant="secondary" className="mb-8 px-6 py-1.5 flex items-center gap-2 glass-card border-primary/20 shadow-lg animate-pulse-subtle">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="font-bold tracking-wider uppercase">NEW: AI GARMENT SCANNER PRO IS LIVE</span>
                            </Badge>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-6xl md:text-8xl font-display font-black tracking-tight mb-8 max-w-6xl text-foreground leading-[1.1]"
                        >
                            Scan Your Wardrobe. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-glow">Predict Your Fit.</span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl md:text-2xl text-muted-foreground/80 mb-12 max-w-3xl mx-auto font-medium"
                        >
                            No tape measure required. Use your camera to extract pixel-perfect dimensions and find your perfect size across 50+ global brands instantly.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-6 items-center"
                        >
                            <Link to="/signup">
                                <Button size="lg" className="h-16 px-10 text-xl rounded-full group gap-3 shadow-2xl shadow-primary/40 hover:scale-105 transition-all bg-primary">
                                    Start Scanning Free
                                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/garment-scanner">
                                <Button size="lg" variant="outline" className="h-16 px-10 text-xl rounded-full gap-3 glass-card hover:bg-secondary/20 border-border group font-bold">
                                    Try Pro Scanner
                                    <Sparkles className="w-5 h-5 text-accent group-hover:animate-spin" />
                                </Button>
                            </Link>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-8 flex items-center gap-2 text-sm text-muted-foreground font-bold uppercase tracking-widest"
                        >
                            <ShieldCheck className="w-4 h-4 text-green-500" /> 100% Privacy-First CV Pipeline
                        </motion.div>
                    </motion.div>

                    {/* Hero Visual Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 60 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        className="mt-20 relative w-full max-w-2xl mx-auto animate-float"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl opacity-50 z-0 animate-pulse" />
                        <Card className="glass-card overflow-hidden border-border/50 relative z-10 shadow-2xl">
                            <CardContent className="p-10">
                                <div className="absolute top-4 right-6">
                                    <Badge variant="success" className="bg-green-500 text-white font-bold px-4 py-1 animate-pulse shadow-lg">PRO ACTIVE</Badge>
                                </div>
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center overflow-hidden border border-primary/20 shadow-inner">
                                        <img src="/apparel/jacket.png" alt="Scan Target" className="w-full h-full object-cover scale-110" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-display font-bold text-2xl tracking-tight">Classic Denim Jacket</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">OCR Detect:</span>
                                            <Badge variant="outline" className="text-[10px] font-black tracking-tighter">NIKE (VINTAGE)</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-10 items-center text-left">
                                    <div className="space-y-6">
                                        <div className="relative group">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mb-1 group-hover:text-primary transition-colors">Chest Circumference</p>
                                            <div className="flex items-end gap-2 leading-none">
                                                <span className="text-5xl font-display font-black text-foreground">108.4</span>
                                                <span className="text-sm font-bold text-muted-foreground mb-1">cm</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mb-1">Shoulder Width</p>
                                            <p className="text-3xl font-display font-bold text-foreground">46.2<span className="text-xs font-medium ml-1">cm</span></p>
                                        </div>
                                    </div>

                                    <div className="relative flex flex-col items-center justify-center bg-secondary/20 p-8 rounded-full aspect-square border-2 border-primary/20 hover:border-primary/50 transition-colors group cursor-default">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mb-2 z-10">Matching Size</p>
                                        <span className="text-7xl font-display font-black text-primary z-10 text-glow">L</span>
                                        <ConfidenceGauge score={99.4} size="small" />
                                        <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
                                    </div>
                                </div>
                                
                                <div className="mt-10 pt-10 border-t border-dashed flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Scan Calibrated via Reference Card</p>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    </div>
                                </div>
                            </CardContent>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden">
                                <motion.div 
                                    animate={{ left: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-y-0 w-1/4 bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),1)]"
                                />
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-32 bg-background relative">
                <div className="container mx-auto px-4">
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-2 gap-20 items-center"
                    >
                        <div className="space-y-8 text-left">
                            <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-black leading-[1.1]">
                                Your closet is full of <br />
                                <span className="text-primary italic">Hidden Measurements.</span>
                            </motion.h2>
                            <motion.p variants={itemVariants} className="text-xl text-muted-foreground/80 leading-relaxed max-w-xl">
                                Every brand has its own language. A "Medium" in Nike is a "Large" in Zara. This inconsistency costs shoppers billions in return fees and hours of frustration.
                            </motion.p>
                            <motion.div variants={itemVariants} className="space-y-4">
                                {[
                                    { label: "Online Return Rate due to Fit", value: "67%", icon: <AlertCircle className="w-5 h-5 text-accent" /> },
                                    { label: "Time Wasted on Size Charts", value: "≈15 mins", icon: <Clock className="w-5 h-5 text-primary" /> },
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-secondary/30 border border-border/50 group hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-background p-3 rounded-xl shadow-sm text-primary group-hover:scale-110 transition-transform">{stat.icon}</div>
                                            <span className="font-bold text-sm tracking-tight">{stat.label}</span>
                                        </div>
                                        <span className="text-2xl font-display font-black text-primary">{stat.value}</span>
                                    </div>
                                ))}
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Button size="lg" variant="outline" className="rounded-full font-bold" onClick={() => navigate('/onboarding/measurements')}>Uncover Your True Data</Button>
                            </motion.div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-10 bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse" />
                            <motion.div 
                                variants={itemVariants}
                                className="grid grid-cols-2 gap-6 relative z-10"
                            >
                                <div className="bg-card p-6 rounded-3xl border shadow-xl rotate-[-4deg] group hover:rotate-0 transition-all duration-500 translate-y-12 text-left">
                                    <Badge className="bg-accent/10 text-accent mb-4 border-none">BRAND A (ZARA)</Badge>
                                    <p className="text-4xl font-display font-black text-foreground mb-1">M</p>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-[8px]">Too Tight</p>
                                </div>
                                <div className="bg-card p-6 rounded-3xl border shadow-xl rotate-[6deg] group hover:rotate-0 transition-all duration-500 text-left">
                                    <Badge className="bg-primary/10 text-primary mb-4 border-none">BRAND B (NIKE)</Badge>
                                    <p className="text-4xl font-display font-black text-foreground mb-1">L</p>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-[8px]">Perfect Fit</p>
                                </div>
                                <div className="bg-background/80 backdrop-blur p-6 rounded-3xl border border-primary/30 shadow-2xl col-span-2 mt-12 text-center animate-pulse-subtle">
                                    <p className="text-sm font-bold text-primary flex items-center justify-center gap-2">
                                        <Zap className="w-4 h-4 fill-primary" /> Pantemonium predicts: BRAND C → LARGE
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-32 bg-secondary/30 relative">
                <div className="container mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Master Your Wardrobe</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">Three steps to a perfect fit, every time.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {[
                            { 
                                icon: <Camera className="w-10 h-10" />, 
                                step: "01",
                                title: "Scan Your Closet", 
                                desc: "Upload photos of garments you already love. Our AI extracts measurements with 99% accuracy using reference calibration." 
                            },
                            { 
                                icon: <Database className="w-10 h-10" />, 
                                step: "02",
                                title: "Build Digital Twins", 
                                desc: "Our system creates a digital coordinate map of your garments, matching them against 50+ global brand databases." 
                            },
                            { 
                                icon: <Zap className="w-10 h-10" />, 
                                step: "03",
                                title: "One-Click Shopping", 
                                desc: "Browse any brand and see YOUR perfect size instantly. No charts, no guessing, no returns." 
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative group p-10 rounded-[3rem] bg-background/50 backdrop-blur border border-border/50 hover:border-primary/30 transition-all hover:-translate-y-2 shadow-sm hover:shadow-2xl text-left"
                            >
                                <span className="absolute top-6 right-10 text-8xl font-black text-primary/5 group-hover:text-primary/10 transition-colors">{item.step}</span>
                                <div className="bg-primary/10 text-primary w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-inner">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 font-display tracking-tight">{item.title}</h3>
                                <p className="text-muted-foreground/80 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Technical Spec Section */}
             <section className="py-32 bg-background overflow-hidden border-y border-dashed border-primary/10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="flex-1 order-2 lg:order-1">
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl opacity-30 z-0" />
                                <Card className="glass-card overflow-hidden border-border/50 z-10 relative">
                                    <CardContent className="p-0">
                                        <div className="relative h-[500px] w-full bg-secondary/10 flex items-center justify-center scan-line-v2 overflow-hidden">
                                            {/* Real Apparel Image for Scanning */}
                                            <div className="absolute inset-0 z-0 flex items-center justify-center p-12">
                                                <img src="/apparel/tshirt.png" alt="Scanning Mockup" className="w-full h-full object-contain opacity-80" />
                                            </div>
                                            
                                            {/* Garment Shape Overlay */}
                                            <div className="relative w-72 h-96 border-4 border-primary/30 rounded-2xl flex items-center justify-center z-10 backdrop-blur-[1px]">
                                                {[
                                                    { t: '15%', l: '25%' }, { t: '15%', l: '75%' },
                                                    { t: '40%', l: '15%' }, { t: '40%', l: '85%' },
                                                    { t: '90%', l: '50%' }
                                                ].map((p, i) => (
                                                    <motion.div 
                                                        key={i}
                                                        initial={{ scale: 0 }}
                                                        whileInView={{ scale: 1 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"
                                                        style={{ top: p.t, left: p.l }}
                                                    />
                                                ))}
                                                <svg className="absolute inset-0 w-full h-full stroke-primary/30 stroke-[1] fill-none">
                                                    <path d="M 25% 15% L 75% 15% L 85% 40% L 50% 90% L 15% 40% Z" />
                                                </svg>
                                            </div>
                                            
                                            <div className="absolute top-6 left-6 p-3 bg-background/80 backdrop-blur rounded-xl border border-primary/20 shadow-xl text-left">
                                                <p className="text-[10px] font-black tracking-widest text-primary uppercase animate-pulse">Processing CV Pipeline...</p>
                                                <p className="text-xs font-bold text-muted-foreground mt-1 tracking-tight">Found 12 Match Keypoints</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        <div className="flex-1 order-1 lg:order-2 space-y-10 text-left">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <Badge className="mb-6 bg-secondary text-secondary-foreground px-4 py-1 rounded-full uppercase tracking-[0.2em] text-[10px] font-black border-none">Technical Spec</Badge>
                                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Pro-Grade <br /> <span className="text-primary">Optical Intelligence.</span></h2>
                                <div className="space-y-8">
                                    {[
                                        { 
                                            title: "Sub-Centimeter Precision", 
                                            desc: "Using standard reference object calibration (Credit Card / Ruler), our AI translates pixels into physical CM with industrial accuracy.",
                                            icon: <Ruler className="w-6 h-6 text-primary" />
                                        },
                                        { 
                                            title: "12-Point Feature Extraction", 
                                            desc: "We map shoulder pitch, armpit depth, and hem curvature to create a perfect coordinate twin of every garment in your closet.",
                                            icon: <Layers className="w-6 h-6 text-primary" />
                                        },
                                        { 
                                            title: "Predictive Fit Styles", 
                                            desc: "The AI understands how fabric drapes, matching measurements against brand design intents for Slim, Regular, or Oversized fits.",
                                            icon: <SlidersIcon className="w-6 h-6 text-primary" />
                                        }
                                    ].map((spec, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className="bg-secondary/50 p-4 rounded-2xl h-fit group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-border/50">
                                                {spec.icon}
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <h4 className="text-xl font-bold font-display tracking-tight">{spec.title}</h4>
                                                <p className="text-muted-foreground/80 leading-relaxed font-medium text-sm">{spec.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button size="lg" className="w-fit rounded-full h-14 px-10 font-bold group shadow-xl shadow-primary/20 mt-12 bg-primary" onClick={() => navigate('/garment-scanner')}>
                                        Try Pro Scanner
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Features */}
            <section className="py-32 bg-background relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Built for Global Shopping</h2>
                        <p className="text-xl text-muted-foreground font-medium">Premium features for a seamless fit across borders.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {[
                            { icon: <Globe />, title: "Global Catalogs", desc: "Instantly translate sizing between US, UK, EU, and Asian markets with zero friction." },
                            { icon: <Brain />, title: "Pattern Learning", desc: "The more you scan and shop, the smarter our recommendations become for your specific build." },
                            { icon: <img src="/apparel/jeans.png" className="w-10 h-10 object-cover rounded-lg" />, title: "Brand Sizing DB", desc: "We track how brands evolve their sizing year-over-year so your data stays matching." },
                            { icon: <Heart />, title: "Fit Preferences", desc: "Love it tighter in the arms but loose in the waist? We factor in your subjective style." },
                            { icon: <ShieldCheck />, title: "Secure Data Vault", desc: "Your measurement data and photos are encrypted and never sold. You own your data profile." },
                            { icon: <Zap />, title: "Instant Matches", desc: "Our real-time engine delivers results in under 200ms once your digital closet is set." },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full bg-card hover:bg-secondary/10 transition-all border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-xl group rounded-[2rem] text-left">
                                    <CardContent className="p-8">
                                        <div className="text-primary mb-6 bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-bold text-xl mb-3 font-display tracking-tight">{feature.title}</h3>
                                        <p className="text-muted-foreground/80 text-sm leading-relaxed font-medium">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-40 relative overflow-hidden bg-primary">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 pointer-events-none mix-blend-overlay" />
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none uppercase">
                            Stop Guessing. <br />
                            Start Scanning.
                        </h2>
                        <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto mb-16 font-medium">
                            Join over 10,000+ shoppers who have digitized their fit profile. Free forever for individuals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link to="/signup">
                                <Button size="lg" variant="secondary" className="h-20 px-12 text-2xl rounded-full font-black shadow-2xl hover:scale-105 transition-all text-primary bg-white">
                                    Get Started Free
                                </Button>
                            </Link>
                            <p className="text-white/60 text-sm font-bold uppercase tracking-widest px-4">No Credit Card Required</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
