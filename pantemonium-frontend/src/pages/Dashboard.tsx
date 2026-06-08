import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, Shirt, Star, BarChart3, Ruler, Search, TrendingUp, ArrowRight, Scan, ShoppingBag, Clock } from 'lucide-react'
import { useGarmentStore } from '@/stores/garmentStore'

export default function Dashboard() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { savedGarments } = useGarmentStore()

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-muted-foreground mt-1">Here's your fit profile overview for today.</p>
                </div>
                <div className="text-sm font-medium bg-secondary text-secondary-foreground px-4 py-2 rounded-lg flex items-center gap-2 border shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Profile Active
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: <Target className="h-5 w-5 text-primary" />, value: "23", label: "Smart Matches", trend: "+3 this week" },
                        { icon: <ShoppingBag className="h-5 w-5 text-accent" />, value: savedGarments.length.toString(), label: "In Closet", trend: "Digitally scanned" },
                        { icon: <Star className="h-5 w-5 text-amber-500" />, value: "87%", label: "Fit Accuracy", trend: "+2% accuracy" },
                        { icon: <BarChart3 className="h-5 w-5 text-green-500" />, value: "Lv. 2", label: "Shopper Tier", trend: "Curated profile" },
                    ].map((stat, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="hover:-translate-y-1 transition-all bg-card border shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-secondary/50 p-2 rounded-lg">{stat.icon}</div>
                                    </div>
                                    <h3 className="text-3xl font-display font-bold mb-1">{stat.value}</h3>
                                    <p className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider">{stat.label}</p>
                                    <div className="flex items-center text-[10px] text-green-600 dark:text-green-400 font-bold uppercase">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        {stat.trend}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 transition-all border-primary/20 cursor-pointer overflow-hidden relative group h-full" onClick={() => navigate('/recommend')}>
                            <CardContent className="p-8">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all">
                                    <Target className="w-32 h-32" />
                                </div>
                                <h3 className="text-2xl font-display font-bold mb-2 relative z-10 text-foreground">Size Recommendation</h3>
                                <p className="text-muted-foreground mb-6 relative z-10 max-w-xs text-sm">Find your perfect fit for any brand catalog instantly.</p>
                                <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl relative z-10 transition-shadow font-bold">
                                    Start Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <div className="grid grid-rows-2 gap-4">
                        <motion.div variants={itemVariants} className="h-full">
                            <Card className="h-full hover:bg-secondary/20 transition-all cursor-pointer group border" onClick={() => navigate('/onboarding/measurements')}>
                                <CardContent className="p-6 flex items-center justify-between h-full">
                                    <div>
                                        <h3 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">Update Body Profile</h3>
                                        <p className="text-xs text-muted-foreground">Adjust your core measurements</p>
                                    </div>
                                    <div className="bg-secondary p-4 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Ruler className="h-6 w-6" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <motion.div variants={itemVariants} className="h-full">
                                <Card className="h-full hover:bg-secondary/40 transition-all cursor-pointer group border" onClick={() => navigate('/garment-scanner')}>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                                        <Scan className="h-6 w-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-bold text-[10px] uppercase tracking-wider">Scanner</span>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div variants={itemVariants} className="h-full">
                                <Card className="h-full hover:bg-secondary/40 transition-all cursor-pointer group border" onClick={() => navigate('/brands')}>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                                        <Search className="h-6 w-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-bold text-[10px] uppercase tracking-wider">Brands</span>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div variants={itemVariants} className="h-full">
                                <Card className="h-full hover:bg-secondary/40 transition-all cursor-pointer group border" onClick={() => navigate('/history')}>
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                                        <Clock className="h-6 w-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-bold text-[10px] uppercase tracking-wider">Matches</span>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Digital Closet Section */}
                <motion.div variants={itemVariants} className="pt-8 border-t border-dashed">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-display font-bold">My Digital Closet</h2>
                            <p className="text-muted-foreground text-sm font-medium">Your verified garments and fit feedback history</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg shadow-primary/20">
                            <ShoppingBag className="w-3 h-3" />
                            {savedGarments.length} Items Indexed
                        </div>
                    </div>

                    {savedGarments.length === 0 ? (
                        <Card className="border-dashed bg-secondary/5 py-16">
                            <CardContent className="flex flex-col items-center justify-center text-center">
                                <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm border">
                                    <Shirt className="w-8 h-8 text-primary/30" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">Your closet is empty</h3>
                                <p className="text-muted-foreground max-w-sm mb-8 text-sm">
                                    Scan your favorite clothes to build a digital twin of your wardrobe and fine-tune your fit AI.
                                </p>
                                <Button onClick={() => navigate('/garment-scanner')} size="lg" className="rounded-full font-bold">
                                    <Scan className="w-4 h-4 mr-2" /> Start First Scan
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedGarments.map((garment) => (
                                <Card key={garment.id} className="overflow-hidden group hover:border-primary/50 transition-all bg-card border-border shadow-sm">
                                    <div className="relative h-56 bg-secondary/10 overflow-hidden">
                                        <img src={garment.image} alt={garment.brand} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 p-2" />
                                        <div className="absolute top-4 right-4">
                                            <Badge className={
                                                garment.fit_feedback === 'perfect' ? 'bg-green-500 shadow-lg shadow-green-500/20' :
                                                garment.fit_feedback === 'too_tight' ? 'bg-amber-500 shadow-lg shadow-amber-500/20' :
                                                'bg-blue-500 shadow-lg shadow-blue-500/20'
                                            }>
                                                {garment.fit_feedback?.replace('_', ' ').toUpperCase() || 'SAVED'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-xl tracking-tight">{garment.brand}</h4>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{garment.category} • SIZE {garment.detected_size}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">AI Measured</p>
                                                <p className="font-display font-black text-2xl text-primary leading-none">{garment.inferred_size}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed">
                                            {Object.entries(garment.measurements).slice(0, 3).map(([key, val]) => (
                                                <span key={key} className="text-[9px] bg-secondary/50 px-2 py-1 rounded-md font-black text-muted-foreground uppercase tracking-wider">
                                                    {key.replace('_cm', '')}: {val}cm
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    )
}
