import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useBrandStore } from '@/stores/brandStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowRight, Tag, Globe, Sparkles, Loader2 } from 'lucide-react'

export default function BrandExplorer() {
    const navigate = useNavigate()
    const { brands, fetchBrands, isLoading } = useBrandStore()

    useEffect(() => {
        if (brands.length === 0) fetchBrands()
    }, [fetchBrands, brands.length])

    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All Brands')
    const [sort, setSort] = useState('A-Z')

    const FILTERS = ['All Brands', 'Athletic', 'Fashion', 'Premium', 'Streetwear', 'Popular']
    const SORTS = ['A-Z']

    const mutableBrands = [...brands]
    if (sort === 'A-Z') mutableBrands.sort((a, b) => a.name.localeCompare(b.name))

    const filteredBrands = mutableBrands.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === 'All Brands' || b.tags.includes(filter))
    )

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Stats Overview */}
            <div className="flex justify-center mb-12">
                <div className="bg-gradient-to-r from-primary/10 via-secondary to-accent/10 border p-4 rounded-2xl flex items-center justify-center shadow-inner mt-4 w-full md:w-auto overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
                    <p className="flex w-full md:w-auto items-center justify-between md:justify-center gap-2 md:gap-8 text-sm md:text-base font-medium whitespace-nowrap overflow-x-auto scrollbar-hide">
                        <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />50+ Brands</span>
                        <span className="text-border">•</span>
                        <span>200+ Categories</span>
                        <span className="text-border">•</span>
                        <span className="flex items-center gap-2">10,000+ Combinations</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-4xl font-display font-bold">Discover Brands</h1>

                {/* Search */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search 50+ brands..."
                        className="pl-9 h-11 bg-card rounded-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-hide">
                    {FILTERS.map(f => (
                        <Badge
                            key={f}
                            variant={filter === f ? 'default' : 'secondary'}
                            className="cursor-pointer whitespace-nowrap px-4 py-2 font-medium"
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </Badge>
                    ))}
                </div>

                <div className="flex items-center gap-2 shrink-0 bg-background border px-3 py-2 rounded-lg text-sm text-foreground">
                    <span className="text-muted-foreground">Sort:</span>
                    <select
                        className="bg-transparent border-none outline-none font-medium cursor-pointer"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                <AnimatePresence>
                    {filteredBrands.map((brand) => (
                        <motion.div
                            key={brand.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            layout
                        >
                            <Card className="h-full group hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden relative cursor-pointer" onClick={() => navigate('/recommend')}>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-display text-2xl font-black shadow-md border overflow-hidden">
                                            {brand.logo_url ? <img src={brand.logo_url} alt={brand.name} className="w-10 h-10 object-contain drop-shadow-sm" /> : <span className="text-neutral-800">{brand.name.charAt(0)}</span>}
                                        </div>
                                        <div className="flex flex-col gap-1 items-end">
                                            {brand.tags?.slice(0, 1).map(t => (
                                                <Badge key={t} variant="outline" className="text-[10px] bg-background/50">{t}</Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <h3 className="font-display font-bold text-2xl mb-4 group-hover:text-primary transition-colors">{brand.name}</h3>

                                    <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4" />
                                            <span className="truncate">{brand.description || "Discover sizes for this brand"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            <span>Multiple Regions</span>
                                        </div>
                                    </div>

                                    <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent group-hover:text-primary transition-colors relative z-10">
                                        <div>
                                            <span className="font-bold">Get Size</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}
            {!isLoading && filteredBrands.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50 text-primary" />
                    <p className="text-xl font-medium">No brands found</p>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    )
}
