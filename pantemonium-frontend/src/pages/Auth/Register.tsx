import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Shirt, ArrowRight, UserCheck, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
    const navigate = useNavigate()
    const { register: registerAction } = useAuthStore()
    const [passwordStrength, setPasswordStrength] = useState(0)

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { terms: false }
    })

    const passwordValue = watch('password')

    useEffect(() => {
        if (!passwordValue) {
            setPasswordStrength(0)
            return
        }
        let strength = 0
        if (passwordValue.length >= 8) strength += 25
        if (/[A-Z]/.test(passwordValue)) strength += 25
        if (/[0-9]/.test(passwordValue)) strength += 25
        if (/[^A-Za-z0-9]/.test(passwordValue)) strength += 25
        setPasswordStrength(strength)
    }, [passwordValue])

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerAction({ name: data.fullName, email: data.email, password: data.password })
            toast.success('Account created successfully!', {
                description: 'Redirecting to complete your profile...',
            })
            setTimeout(() => navigate('/onboarding/measurements'), 1500)
        } catch {
            toast.error('Failed to create account. Please try again.')
        }
    }

    const getStrengthColor = () => {
        if (passwordStrength < 50) return 'bg-red-500'
        if (passwordStrength < 100) return 'bg-amber-500'
        return 'bg-green-500'
    }

    return (
        <div className="min-h-screen w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            {/* Left side visual */}
            <div className="hidden lg:flex lg:flex-col lg:justify-center relative bg-muted overflow-hidden border-r">
                <div className="absolute inset-0 bg-primary/5" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0" />
                <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-accent/20 blur-3xl opacity-60 mix-blend-multiply" />

                <div className="relative z-10 p-12 lg:p-24 h-full flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-12"
                    >
                        <h3 className="text-4xl font-display font-bold leading-tight mb-6">
                            Join Pantemonium<br />Stop guessing sizes.
                        </h3>
                        <div className="space-y-6">
                            {[
                                { icon: <Shield className="h-6 w-6 text-primary" />, title: "Data Privacy", desc: "Your measurements are encrypted and secure." },
                                { icon: <UserCheck className="h-6 w-6 text-accent" />, title: "Personalized", desc: "Get recommendations tailored to your exact body type." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="bg-background p-2 rounded-lg shadow-sm border">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{item.title}</h4>
                                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right side form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="flex flex-col items-center">
                        <Link to="/" className="bg-primary/10 p-3 rounded-xl mb-4 lg:hidden">
                            <Shirt className="h-8 w-8 text-primary" />
                        </Link>
                        <h2 className="text-3xl font-display font-bold text-center tracking-tight">
                            Create an account
                        </h2>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="John Doe"
                                        {...register('fullName')}
                                        className={cn("pl-10", errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : '')}
                                    />
                                </div>
                                {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="name@example.com"
                                        {...register('email')}
                                        className={cn("pl-10", errors.email ? 'border-red-500 focus-visible:ring-red-500' : '')}
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        className={cn("pl-10", errors.password ? 'border-red-500 focus-visible:ring-red-500' : '')}
                                    />
                                </div>

                                {/* Strength Meter */}
                                <div className="mt-2 h-1 w-full bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        className={cn("h-full transition-colors", getStrengthColor())}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${passwordStrength}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                    <span>Strength</span>
                                    <span>{passwordStrength === 100 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : 'Weak'}</span>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        {...register('confirmPassword')}
                                        className={cn("pl-10", errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : '')}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    {...register('terms')}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary bg-background"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <Label htmlFor="terms" className="font-normal text-muted-foreground">
                                    I agree to the <a href="#" className="font-medium text-primary hover:underline">Terms, Privacy Policy</a>, and Cookie Policy.
                                </Label>
                                {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms.message as string}</p>}
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full h-11 text-base relative overflow-hidden group" disabled={isSubmitting}>
                                <span className="relative z-10 flex items-center justify-center">
                                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                                    {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                                </span>
                                {/* Button shine effect */}
                                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]" />
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(' ')
}
