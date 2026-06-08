import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { useMeasurementStore } from '@/stores/measurementStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, Settings, Ruler, Lock, Camera, Mail, Shield, Download, Trash2, Edit2, RotateCcw, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'

export default function Profile() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { measurements, fitPreference } = useMeasurementStore()

    const [activeTab, setActiveTab] = useState('account')

    const TABS = [
        { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
        { id: 'measurements', label: 'Measurements', icon: <Ruler className="w-4 h-4" /> },
        { id: 'preferences', label: 'Preferences', icon: <Settings className="w-4 h-4" /> },
        { id: 'privacy', label: 'Privacy', icon: <Lock className="w-4 h-4" /> },
    ]

    const handleSave = () => {
        toast.success('Changes saved successfully!')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl lg:flex items-start gap-8 min-h-[80vh]">

            {/* Sidebar Navigation */}
            <Card className="lg:w-64 bg-card border shadow-sm mb-6 lg:mb-0 lg:sticky top-24 shrink-0 overflow-hidden">
                <div className="p-6 border-b bg-secondary/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl uppercase font-display">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="font-bold truncate w-32">{user?.name || 'Demo User'}</p>
                        <p className="text-xs text-muted-foreground truncate w-32">{user?.email}</p>
                    </div>
                </div>
                <div className="p-2 flex flex-row lg:flex-col overflow-x-auto scrollbar-hide py-3 lg:py-4 w-full">
                    {TABS.map((tab) => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                            className={`w-full justify-start py-6 font-medium gap-3 lg:mb-1 ${activeTab === tab.id ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary relative overflow-hidden' : 'text-foreground'}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {activeTab === tab.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden lg:block" />}
                            <span className={activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}>{tab.icon}</span>
                            {tab.label}
                        </Button>
                    ))}
                </div>
            </Card>

            {/* Main Content Area */}
            <div className="flex-1 w-full bg-card border rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
                <AnimatePresence mode="wait">

                    {/* ACCOUNT TAB */}
                    {activeTab === 'account' && (
                        <motion.div
                            key="account"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="p-6 md:p-8"
                        >
                            <h2 className="text-2xl font-display font-bold mb-6">Account Information</h2>

                            <div className="flex flex-col sm:flex-row gap-6 mb-8 items-start sm:items-center">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-secondary text-primary border-4 border-background shadow-md flex items-center justify-center text-4xl font-display font-bold uppercase transition-transform group-hover:scale-105">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 text-white">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-lg">Profile Picture</p>
                                    <p className="text-sm text-muted-foreground mb-2">JPG, GIF or PNG. Max size 5MB.</p>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">Upload</Button>
                                        <Button size="sm" variant="ghost" className="text-destructive">Remove</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 max-w-xl">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue={user?.name || ''} className="bg-secondary/50 border-input" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</Label>
                                    <Input id="email" type="email" defaultValue={user?.email || ''} className="bg-secondary/50 border-input" />
                                </div>

                                <div className="grid gap-2 relative mt-8 pt-8 border-t">
                                    <h3 className="font-bold text-lg mb-2">Password</h3>
                                    <Label htmlFor="current">Current Password</Label>
                                    <Input id="current" type="password" placeholder="••••••••" className="bg-secondary/50" />

                                    <Label htmlFor="new" className="mt-2">New Password</Label>
                                    <Input id="new" type="password" placeholder="••••••••" className="bg-secondary/50" />
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4 border-t pt-6">
                                <Button onClick={handleSave} className="px-8 shadow-sm">Save Changes</Button>
                                <Button variant="outline" className="shadow-sm">Cancel</Button>
                            </div>
                        </motion.div>
                    )}

                    {/* MEASUREMENTS TAB */}
                    {activeTab === 'measurements' && (
                        <motion.div
                            key="measurements"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="p-6 md:p-8 bg-gradient-to-br from-card to-card"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-display font-bold">Body Profile</h2>
                                <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => navigate('/onboarding/measurements')}>
                                    <RotateCcw className="w-4 h-4 mr-2" /> Retake Guide
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground mb-8">Maintain up-to-date measurements for the best recommendations. Last updated 2 weeks ago.</p>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    {measurements && Object.entries(measurements).map(([key, val]) => (
                                        <div key={key} className="flex items-center justify-between p-4 bg-secondary/30 border rounded-xl hover:bg-secondary/60 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-background border rounded-lg flex items-center justify-center text-primary shadow-sm text-xl">
                                                    {key === 'weight' ? '⚖️' : key === 'height' ? '🧍' : '📏'}
                                                </div>
                                                <span className="font-medium capitalize">{key}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-display font-bold text-lg">{val} <span className="text-sm text-muted-foreground font-normal">{key === 'weight' ? 'kg' : 'cm'}</span></span>
                                                <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col items-center justify-center bg-primary/5 border border-primary/20 rounded-2xl p-6 relative h-fit">
                                    <div className="absolute top-4 right-4"><Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">Active</Badge></div>
                                    <div className="w-full h-56 mb-6 flex items-center justify-center relative overflow-hidden bg-white/50 rounded-xl backdrop-blur-sm border shadow-inner group">
                                        <div className="absolute inset-x-0 h-[1px] bg-primary/20 top-1/4" />
                                        <div className="absolute inset-x-0 h-[1px] bg-primary/20 top-1/2" />
                                        <div className="absolute inset-x-0 h-[1px] bg-primary/20 top-3/4" />
                                        <img src="/mannequin.png" alt="Human Silhouette" className="h-full object-contain mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-110" />
                                        <div className="w-[2px] h-full border-l-2 border-dashed border-primary/20 absolute left-10" />
                                        <div className="w-[2px] h-full border-r-2 border-dashed border-primary/20 absolute right-10" />
                                        <div className="absolute top-2 left-2 text-[8px] font-mono text-primary/40 uppercase">Axis-X Scanned</div>
                                    </div>
                                    <h3 className="font-bold text-lg text-center mb-1">Your Fit Style</h3>
                                    <p className="text-center text-xl font-display text-primary px-6 py-2 bg-background shadow-sm border rounded-full font-bold">{fitPreference}</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t flex sm:hidden">
                                <Button variant="outline" className="w-full">
                                    <Link to="/onboarding/measurements">Retake Measurement Guide</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* PREFERENCES TAB */}
                    {activeTab === 'preferences' && (
                        <motion.div
                            key="preferences"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="p-6 md:p-8"
                        >
                            <h2 className="text-2xl font-display font-bold mb-6">Display & Notifications</h2>

                            <div className="space-y-8 max-w-xl">
                                <div>
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2"><Settings className="w-5 h-5 text-primary" /> Application Settings</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 hover:bg-secondary/30 rounded-lg transition-colors">
                                            <div>
                                                <p className="font-medium">Measurement System</p>
                                                <p className="text-sm text-muted-foreground">Choose your preferred units</p>
                                            </div>
                                            <div className="flex bg-secondary p-1 rounded-lg border">
                                                <button className="px-3 py-1 rounded-md text-sm font-medium bg-background shadow-sm text-foreground">Metric</button>
                                                <button className="px-3 py-1 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Imperial</button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 hover:bg-secondary/30 rounded-lg transition-colors overflow-hidden">
                                            <div>
                                                <p className="font-medium">Default Region Sizing</p>
                                                <p className="text-sm text-muted-foreground w-40 truncate">Base for size conversions</p>
                                            </div>
                                            <div className="shrink-0 overflow-hidden ml-2 rounded-lg border">
                                                <select className="bg-secondary rounded-lg px-2 py-1.5 text-sm font-medium outline-none text-foreground cursor-pointer truncate w-32">
                                                    <option>US Sizing</option>
                                                    <option>UK Sizing</option>
                                                    <option>EU Sizing</option>
                                                    <option>Asian Sizing</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3 hover:bg-secondary/30 rounded-lg transition-colors">
                                            <div>
                                                <p className="font-medium">Theme Mode</p>
                                                <p className="text-sm text-muted-foreground">Adjust platform appearance</p>
                                            </div>
                                            <div className="flex items-center h-5">
                                                <input type="checkbox" id="dark" className="w-5 h-5 rounded-md border-primary text-primary focus:ring-primary accent-primary cursor-pointer border shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2"><Mail className="w-5 h-5 text-primary" /> Notifications</h3>

                                    <div className="space-y-3">
                                        {['Email recommendations', 'Weekly fit reports', 'New brand alerts', 'Promotional offers'].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 hover:bg-secondary/30 rounded-lg transition-colors cursor-pointer">
                                                <Label htmlFor={`notif-${i}`} className="font-medium cursor-pointer w-full text-base">{item}</Label>
                                                <input id={`notif-${i}`} type="checkbox" defaultChecked={i < 2} className="w-5 h-5 border-gray-300 shadow-sm text-primary focus:ring-primary rounded accent-primary cursor-pointer shrink-0 ml-4" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t flex">
                                <Button onClick={handleSave} className="px-8 shadow-sm group">
                                    Save Preferences
                                    <CheckCircle2 className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* PRIVACY TAB */}
                    {activeTab === 'privacy' && (
                        <motion.div
                            key="privacy"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="p-6 md:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-8 h-8 text-green-500 bg-green-500/10 p-1.5 rounded-lg" />
                                <h2 className="text-2xl font-display font-bold">Data & Privacy</h2>
                            </div>

                            <p className="text-muted-foreground mb-8 max-w-2xl">
                                Your body measurements are private and securely encrypted. We only use this data to provide personalized sizing recommendations and it is never shared with third-party brands without explicit consent.
                            </p>

                            <div className="space-y-6 max-w-2xl">
                                <Card className="border-border/50 bg-card hover:bg-secondary/20 transition-colors shadow-sm cursor-pointer group">
                                    <CardContent className="p-6 flex items-start gap-4 flex-col sm:flex-row">
                                        <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                            <Download className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <h3 className="font-bold text-lg">Download My Data</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Get a copy of your personal data, measurements, and history in JSON format.</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full sm:w-auto mt-4 sm:mt-0 group-hover:border-primary">Request</Button>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/50 bg-card hover:bg-destructive/5 transition-colors shadow-sm cursor-pointer group">
                                    <CardContent className="p-6 flex items-start flex-col sm:flex-row gap-4">
                                        <div className="bg-secondary p-3 rounded-xl text-muted-foreground group-hover:bg-destructive/20 group-hover:text-destructive transition-colors shrink-0">
                                            <RotateCcw className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <h3 className="font-bold text-lg">Clear Recommendation History</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Remove all past size calculations. This will reset the learning algorithm for your profile.</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full sm:w-auto mt-4 sm:mt-0 group-hover:text-destructive group-hover:border-destructive/50">Clear</Button>
                                    </CardContent>
                                </Card>

                                <Card className="border-destructive/20 bg-destructive/5 shadow-sm relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 w-full">
                                        <div className="w-full">
                                            <h3 className="font-bold text-lg text-destructive flex items-center gap-2"><Trash2 className="w-5 h-5" /> Delete Account</h3>
                                            <p className="text-sm text-destructive/80 mt-1 max-w-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                        </div>
                                        <Button variant="destructive" className="w-full sm:w-auto shadow-md shadow-destructive/20 shrink-0">Delete Account</Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-12 pt-6 border-t flex gap-4 text-sm text-muted-foreground w-full flex-wrap">
                                <a href="#" className="hover:text-primary hover:underline underline-offset-4 transition-all">Privacy Policy</a>
                                <span>•</span>
                                <a href="#" className="hover:text-primary hover:underline underline-offset-4 transition-all">Terms of Service</a>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

        </div>
    )
}
