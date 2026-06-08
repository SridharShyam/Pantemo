import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Shirt, Menu, X, Scan } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/authStore'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
    const { isAuthenticated, logout } = useAuthStore()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const closeMenu = () => setIsMenuOpen(false)

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Shirt className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">
                        Pantemonium
                    </span>
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/brands" className="text-sm font-medium transition-colors hover:text-primary">
                        Brands
                    </Link>
                    <Link to="/#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
                        How It Works
                    </Link>
                    <Link to="/garment-scanner" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5">
                         Scanner <Badge variant="secondary" className="px-1 text-[10px] scale-90 bg-primary/20 text-primary border-none">PRO</Badge>
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                                Dashboard
                            </Link>
                            <Button variant="ghost" onClick={() => logout()}>Log out</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary">
                                Log in
                            </Link>
                            <Link to="/signup" className="hidden md:inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm">
                                Get Started Free
                            </Link>
                        </>
                    )}
                </div>
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={toggleMenu}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-b bg-background overflow-hidden"
                    >
                        <div className="flex flex-col space-y-4 p-4">
                            <Link to="/brands" className="text-sm font-medium transition-colors hover:text-primary" onClick={closeMenu}>
                                Brands
                            </Link>
                            <Link to="/#how-it-works" className="text-sm font-medium transition-colors hover:text-primary" onClick={closeMenu}>
                                How It Works
                            </Link>
                            <Link to="/garment-scanner" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2" onClick={closeMenu}>
                                <Scan className="w-4 h-4" /> Scanner <Badge variant="secondary" className="px-1 text-[10px] bg-primary/20 text-primary border-none">PRO</Badge>
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary" onClick={closeMenu}>
                                        Dashboard
                                    </Link>
                                    <Button variant="ghost" onClick={() => { logout(); closeMenu(); }} className="justify-start px-0 w-full">
                                        Log out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary" onClick={closeMenu}>
                                        Log in
                                    </Link>
                                    <Link to="/signup" onClick={closeMenu} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full gap-2">
                                        Get Started Free
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
