import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRecommendationStore } from '@/stores/recommendationStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, CheckCircle2, Clock, Filter, ShoppingBag, MessageSquare, Target } from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'

export default function History() {
    const navigate = useNavigate()
    const { history, fetchHistory } = useRecommendationStore()

    useEffect(() => {
        fetchHistory()
    }, [fetchHistory])

    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')

    const FILTERS = ['All', 'High Confidence', 'Need Feedback', 'Purchased']

    const getDayDivider = (date: string) => {
        const d = new Date(date)
        if (isToday(d)) return 'Today'
        if (isYesterday(d)) return 'Yesterday'
        return format(d, 'MMMM d, yyyy')
    }

    // Create timeline groups
    const groupedHistory = history.reduce((acc, rec) => {
        const day = getDayDivider(rec.timestamp)
        if (!acc[day]) acc[day] = []
        acc[day].push(rec)
        return acc
    }, {} as Record<string, typeof history>)

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-display font-bold">Fit History</h1>
                    <p className="text-muted-foreground mt-1">Review past size recommendations and provide feedback.</p>
                </div>
            </div>

            {/* Stats Dashboard */}
            <Card className="mb-10 bg-gradient-to-br from-card to-card border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Target className="w-32 h-32" />
                </div>
                <CardContent className="p-8 relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-display font-bold">Your Fit Journey</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Recommendations', value: history.length.toString(), icon: <Search className="w-4 h-4" /> },
                            { label: 'Average Confidence', value: '84%', icon: <Target className="w-4 h-4" /> },
                            { label: 'Purchases', value: '8', icon: <ShoppingBag className="w-4 h-4" /> },
                            { label: 'Perfect Fits', value: '7 (87.5%)', icon: <CheckCircle2 className="w-4 h-4" /> },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col gap-2 bg-secondary/50 p-4 rounded-xl border">
                                <div className="text-primary bg-primary/10 p-2 w-max rounded-lg mb-1">{stat.icon}</div>
                                <span className="text-3xl font-display font-bold">{stat.value}</span>
                                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 sticky top-16 z-10 bg-background/80 backdrop-blur pb-4 pt-2 -mx-4 px-4">
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search your recommendations..."
                        className="pl-9 h-11 bg-card rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 scrollbar-hide">
                    {FILTERS.map(f => (
                        <Badge
                            key={f}
                            variant={filter === f ? 'default' : 'outline'}
                            className="cursor-pointer whitespace-nowrap px-4 py-2 font-medium"
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="hidden lg:flex"><Filter className="w-4 h-4 mr-2" /> Sort</Button>
                </div>
            </div>

            {/* Timeline View */}
            <div className="space-y-12 pb-24 relative">
                <div className="absolute left-2.5 top-2 bottom-0 w-px bg-border md:left-4" />

                {Object.entries(groupedHistory).map(([day, recs], groupIndex) => (
                    <div key={day} className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-5 h-5 md:w-8 md:h-8 bg-secondary border-2 border-background rounded-full flex items-center justify-center -ml-[3px] md:-ml-[10px] text-[10px] shadow-sm z-10 relative">
                                <div className="w-2 h-2 bg-primary rounded-full shadow-inner shadow-primary-foreground/50" />
                            </div>
                            <h3 className="font-display font-medium text-lg bg-card border px-4 py-1.5 rounded-full shadow-sm">
                                {day}
                            </h3>
                        </div>

                        <div className="pl-6 md:pl-12 space-y-4">
                            {recs.map((rec, i) => (
                                <motion.div
                                    key={rec.id || i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="hover:border-primary/50 transition-colors bg-card hover:shadow-md cursor-pointer group relative overflow-hidden" onClick={() => navigate(`/recommendation/${rec.id}`)}>
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <CardContent className="p-4 md:p-6 text-card-foreground flex flex-col md:flex-row justify-between gap-6">

                                            <div className="flex gap-4 items-start w-full">
                                                <div className="flex-shrink-0 w-16 h-16 bg-secondary rounded-xl flex items-center justify-center font-display font-bold text-2xl shadow-inner text-foreground/70">
                                                    {rec.brand.charAt(0)}
                                                </div>
                                                <div className="flex flex-col gap-1 w-full">
                                                    <div className="flex justify-between items-start w-full gap-2">
                                                        <h4 className="font-bold text-lg leading-tight">{rec.brand} {rec.category}</h4>
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {format(new Date(rec.timestamp), 'h:mm a')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium">Size: <span className="font-display text-primary font-bold">{rec.size}</span></p>

                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        <Badge variant="outline" className="font-mono text-xs bg-background/50 border-border">
                                                            {rec.confidence}% <span className="text-green-500 ml-1 font-bold">██████</span>
                                                        </Badge>
                                                        <Badge variant="secondary" className="font-normal text-xs hover:bg-secondary">
                                                            {rec.fitStyle} Fit
                                                        </Badge>
                                                        {/* Mock Statuses */}
                                                        {i === 1 && groupIndex === 0 && (
                                                            <Badge variant="success" className="font-normal text-xs flex items-center">
                                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Purchased
                                                            </Badge>
                                                        )}
                                                        {i === 2 && groupIndex === 0 && (
                                                            <Badge variant="warning" className="font-normal text-xs flex items-center bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
                                                                <MessageSquare className="w-3 h-3 mr-1" /> Needs Feedback
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:ml-auto flex items-center justify-between md:flex-col gap-2 lg:flex-row w-full md:w-auto relative z-10 pt-4 md:pt-0 border-t md:border-0">
                                                <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground w-full md:w-auto justify-center">
                                                    <Link to={`/recommendation/${rec.id}`}>View<span className="hidden sm:inline">&nbsp;Details</span></Link>
                                                </Button>
                                                {i === 2 && groupIndex === 0 ? (
                                                    <Button size="sm" className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white justify-center shadow-sm" onClick={(e) => { e.stopPropagation(); /* trigger modal */ }}>
                                                        Review
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="outline" className="w-full md:w-auto bg-card hover:bg-secondary justify-center shadow-sm">
                                                        Shop
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}

                {history.length === 0 && (
                    <div className="text-center py-24 bg-card rounded-2xl border text-muted-foreground shadow-sm">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-display font-bold mb-2">No recommendations yet</h3>
                        <p className="mb-6">Start by getting your first size recommendation</p>
                        <Link to="/recommend" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Find My Size</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
