import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useRecommendationStore, RecommendationParams } from '@/stores/recommendationStore'
import { useBrandStore } from '@/stores/brandStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConfidenceGauge } from '@/components/shared/ConfidenceGauge'
import { Search, CheckCircle2, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react'

// Generic category icons fallback
const getCategoryIcon = (name: string) => {
    const l = name.toLowerCase()
    if (l.includes('t-shirt') || l.includes('shirt')) return '👕'
    if (l.includes('jeans') || l.includes('pants')) return '👖'
    if (l.includes('short')) return '🩳'
    if (l.includes('sweater') || l.includes('hoodie')) return '🧥'
    return '👗'
}

export default function GetRecommendation() {
    const navigate = useNavigate()
    const { calculateSize, isCalculating } = useRecommendationStore()
    const { brands, categories, isLoading, fetchBrands, fetchCategories } = useBrandStore()

    useEffect(() => {
        if (brands.length === 0) fetchBrands()
        if (categories.length === 0) fetchCategories()
    }, [fetchBrands, fetchCategories, brands.length, categories.length])

    const [step, setStep] = useState(1)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')

    const [selections, setSelections] = useState<Partial<RecommendationParams> & { brandName?: string, categoryName?: string }>({
        fitPreference: 'Regular',
        region: 'US'
    })

    // Filtering Brands
    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === 'All' || b.tags.includes(filter))
    )

    const handleNext = () => setStep(s => Math.min(4, s + 1))
    const handleBack = () => setStep(s => Math.max(1, s - 1))

    const handleCalculate = async () => {
        setStep(4) // Show loading state
        const result = await calculateSize(selections as RecommendationParams)
        navigate(`/recommendation/${result.id}`)
    }

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    }

    const renderStepIndicator = () => (
        <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary -z-10" />
            <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500 ease-in-out -z-10"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {['Brand', 'Category', 'Preferences', 'Results'].map((label, i) => {
                const isActive = step > i
                const isCurrent = step === i + 1
                return (
                    <div key={label} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${isActive
                            ? 'bg-primary border-primary text-primary-foreground'
                            : isCurrent
                                ? 'bg-background border-primary text-primary'
                                : 'bg-background border-muted text-muted-foreground'
                            }`}>
                            {isActive && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {label}
                        </span>
                    </div>
                )
            })}
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[80vh]">
            <div className="mb-8">
                <Button variant="ghost" className="-ml-4 mb-4" onClick={() => step > 1 ? handleBack() : navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <h1 className="text-3xl font-display font-bold">Find Your Size</h1>
            </div>

            {renderStepIndicator()}

            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden min-h-[500px] relative">
                <AnimatePresence mode="wait">

                    {/* STEP 1: BRAND */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="p-6 md:p-8"
                        >
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        placeholder="Search brands..."
                                        className="pl-9 h-11"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                                    {['All', 'Popular', 'Athletic', 'Fashion', 'Premium'].map(f => (
                                        <Badge
                                            key={f}
                                            variant={filter === f ? 'default' : 'secondary'}
                                            className="cursor-pointer whitespace-nowrap"
                                            onClick={() => setFilter(f)}
                                        >
                                            {f}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {isLoading && <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>}
                            {!isLoading && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredBrands.map(brand => (
                                        <Card
                                            key={brand.id}
                                            className={`cursor-pointer transition-all hover:-translate-y-1 p-4 flex flex-col items-center justify-center text-center h-48 ${selections.brandId === brand.id
                                                ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md'
                                                : 'hover:border-primary/50'
                                                }`}
                                            onClick={() => {
                                                setSelections(s => ({ ...s, brandId: brand.id, brandName: brand.name }))
                                                setTimeout(handleNext, 300)
                                            }}
                                        >
                                            <div className="relative w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center font-display text-2xl font-bold mb-3 shadow-md border overflow-hidden">
                                                {brand.logo_url ? <img src={brand.logo_url} alt={brand.name} className="w-10 h-10 object-contain drop-shadow-sm" /> : <span className="text-neutral-800">{brand.name.charAt(0)}</span>}
                                            </div>
                                            <p className="font-bold">{brand.name}</p>
                                            <div className="absolute top-2 right-2 opacity-0 scale-50 transition-all duration-300" style={{ opacity: selections.brandId === brand.id ? 1 : 0, scale: selections.brandId === brand.id ? 1 : 0 }}>
                                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                            {!isLoading && filteredBrands.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No brands found matching your search.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 2: CATEGORY */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="p-6 md:p-8"
                        >
                            <h2 className="text-2xl font-bold mb-6">What are you shopping for?</h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {categories.map(cat => (
                                    <Card
                                        key={cat.id}
                                        className={`cursor-pointer transition-all hover:scale-105 p-6 flex flex-col items-center justify-center text-center h-32 ${selections.categoryId === cat.id
                                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md'
                                            : 'hover:border-primary/50'
                                            }`}
                                        onClick={() => {
                                            setSelections(s => ({ ...s, categoryId: cat.id, categoryName: cat.name }))
                                            setTimeout(handleNext, 300)
                                        }}
                                    >
                                        <span className="text-4xl mb-3">{getCategoryIcon(cat.name)}</span>
                                        <span className="font-bold">{cat.name}</span>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: PREFERENCES & REVIEW */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="p-6 md:p-8 flex flex-col lg:flex-row gap-8"
                        >
                            <div className="flex-1 space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-accent" /> How would you like this to fit?
                                    </h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        {['Slim', 'Regular', 'Relaxed', 'Oversized'].map((style) => (
                                            <button
                                                key={style}
                                                onClick={() => setSelections(s => ({ ...s, fitPreference: style as RecommendationParams['fitPreference'] }))}
                                                className={`p-3 rounded-lg border-2 text-center transition-all ${selections.fitPreference === style
                                                    ? 'border-primary bg-primary/10 font-bold'
                                                    : 'border-border bg-card hover:border-primary/40'
                                                    }`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-sm mt-3 text-muted-foreground bg-secondary/50 p-3 rounded-md italic">
                                        {selections.fitPreference === 'Slim' && "Form-fitting, minimal extra room in chest and waist."}
                                        {selections.fitPreference === 'Regular' && "Standard fit, follows body shape with comfortable room."}
                                        {selections.fitPreference === 'Relaxed' && "Looser fit, hangs away from the body for comfort."}
                                        {selections.fitPreference === 'Oversized' && "Intentionally large, dropped shoulders, very loose."}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold mb-4">Which region's sizing?</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { id: 'US', flag: '🇺🇸' },
                                            { id: 'UK', flag: '🇬🇧' },
                                            { id: 'EU', flag: '🇪🇺' },
                                            { id: 'Asia', flag: '🌏' }
                                        ].map((region) => (
                                            <Badge
                                                key={region.id}
                                                variant={selections.region === region.id ? 'default' : 'outline'}
                                                className={`text-sm py-1.5 px-4 cursor-pointer transition-colors ${selections.region !== region.id ? 'hover:bg-primary/80 hover:text-primary-foreground text-foreground' : ''}`}
                                                onClick={() => setSelections(s => ({ ...s, region: region.id }))}
                                            >
                                                <span className="mr-2">{region.flag}</span> {region.id}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Review Sidebar */}
                            <div className="lg:w-72 bg-secondary/30 rounded-xl p-6 border flex flex-col justify-between">
                                <div>
                                    <h3 className="font-display font-bold text-lg mb-4">Review Selection</h3>
                                    <ul className="space-y-4">
                                        <li className="flex justify-between items-center bg-background p-3 rounded-lg shadow-sm border text-sm font-medium">
                                            <span className="text-muted-foreground flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Brand</span>
                                            <span>{selections.brandName}</span>
                                        </li>
                                        <li className="flex justify-between items-center bg-background p-3 rounded-lg shadow-sm border text-sm font-medium">
                                            <span className="text-muted-foreground flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Category</span>
                                            <span>{selections.categoryName}</span>
                                        </li>
                                        <li className="flex justify-between items-center bg-background p-3 rounded-lg shadow-sm border text-sm font-medium">
                                            <span className="text-muted-foreground flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Fit</span>
                                            <span>{selections.fitPreference}</span>
                                        </li>
                                    </ul>

                                    <div className="mt-6 flex items-center gap-2 text-green-600 dark:text-green-500 text-sm font-medium bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Measurements up to date
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full mt-8 rounded-full h-14 group relative overflow-hidden"
                                    onClick={handleCalculate}
                                    disabled={!selections.brandId || !selections.categoryId || isCalculating}
                                >
                                    <span className="relative z-10 flex items-center font-bold text-lg">
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Calculate My Size
                                    </span>
                                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_2s_infinite]" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: LOADING RESULT */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            variants={stepVariants}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-background z-20"
                        >
                            <div className="relative w-48 h-48 mb-8 flex justify-center items-center">
                                <div className="absolute inset-0 border-4 border-secondary rounded-full" />
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <ConfidenceGauge score={87} size="large" animated={false} showLabel={false} className="scale-75 opacity-50 animate-pulse" />
                            </div>

                            <h2 className="text-2xl font-bold mb-6 font-display animate-pulse">Calculating your size</h2>

                            <div className="w-full max-w-sm space-y-4">
                                <p className="flex items-center gap-3 text-foreground font-medium bg-secondary p-3 rounded-lg shadow-sm">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white"><CheckCircle2 className="w-4 h-4" /></span>
                                    Analyzing measurements...
                                </p>
                                <motion.p
                                    initial={{ opacity: 0.5, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex items-center gap-3 text-foreground font-medium bg-secondary p-3 rounded-lg shadow-sm"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white"><Loader2 className="w-4 h-4 animate-spin" /></span>
                                    Matching {selections.brandName} size charts...
                                </motion.p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
