import { Link } from 'react-router-dom'
import { Shirt, Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Shirt className="h-6 w-6 text-primary" />
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight">
                                Pantemonium
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Intelligent fit recommendations using advanced matching algorithms to end size confusion forever.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><Link to="/brands" className="text-sm text-muted-foreground hover:text-primary">Supported Brands</Link></li>
                            <li><Link to="/#how-it-works" className="text-sm text-muted-foreground hover:text-primary">How It Works</Link></li>
                            <li><Link to="/garment-scanner" className="text-sm text-muted-foreground hover:text-primary font-bold">Pro Scanner</Link></li>
                            <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-primary">Join Now</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link to="/profile" className="text-sm text-muted-foreground hover:text-primary">Profile</Link></li>
                            <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">Dashboard</Link></li>
                            <li><Link to="/history" className="text-sm text-muted-foreground hover:text-primary">Fit History</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Pantemonium. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
