import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Shirt, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuthStore()

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.email, data.password)
            toast.success('Successfully logged in')
            navigate('/dashboard')
        } catch {
            toast.error('Failed to log in. Please check your credentials.')
        }
    }

    return (
        <div className="min-h-screen w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            {/* Left side form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="flex flex-col items-center">
                        <Link to="/" className="bg-primary/10 p-3 rounded-xl mb-4">
                            <Shirt className="h-8 w-8 text-primary" />
                        </Link>
                        <h2 className="text-3xl font-display font-bold text-center tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4 rounded-md shadow-sm">
                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="name@example.com"
                                    {...register('email')}
                                    className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm">
                                        <a href="#" className="font-medium text-primary hover:text-primary/80">
                                            Forgot?
                                        </a>
                                    </div>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-background"
                            />
                            <Label htmlFor="remember-me" className="ml-2 block text-sm font-normal">
                                Remember me
                            </Label>
                        </div>

                        <div>
                            <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                                {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                            </Button>
                        </div>

                        <div className="relative mt-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button variant="outline" type="button" className="w-full group">
                                <svg className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" type="button" className="w-full group">
                                <svg className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform dark:fill-white" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09.105.152.218.312.338.486 1.042 1.503 2.253 3.228 4.026 3.195 1.685-.034 2.338-1.033 4.381-1.033 2.031 0 2.651 1.033 4.418 1.002 1.776-.035 2.822-1.579 3.868-3.085.12-.174.234-.347.34-.514 1.187-1.688 1.684-3.328 1.714-3.411-.038-.016-3.218-1.222-3.266-4.904-.044-3.084 2.508-4.571 2.624-4.639-1.442-2.11-3.69-2.385-4.502-2.433-2.007-.156-3.98.98-4.991.98-1.01 0-2.618-.946-4.254-.908zm4.743-4.103c.895-1.075 1.498-2.583 1.332-4.085-1.294.053-2.883.856-3.805 1.95-.828.983-1.536 2.529-1.341 4.015 1.458.113 2.924-.805 3.814-1.88z" />
                                </svg>
                                Apple
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Right side visual */}
            <div className="hidden lg:flex lg:flex-col lg:justify-center relative bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-primary/5" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
                <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-primary/20 blur-3xl opacity-50 mix-blend-multiply" />
                <div className="absolute bottom-32 -right-32 w-80 h-80 rounded-full bg-accent/20 blur-3xl opacity-50 mix-blend-multiply" />

                <div className="relative z-10 p-12 lg:p-24 h-full flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-20"
                    >
                        <h3 className="text-4xl font-display font-bold leading-tight mb-4">
                            Your perfect fit,<br />waiting to be discovered.
                        </h3>
                        <p className="text-xl text-muted-foreground flex items-center flex-wrap gap-2">
                            <span>Sign in to access your fit history and new features.</span>
                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        </p>
                    </motion.div>

                    <div className="relative w-full max-w-sm ml-auto mr-6 lg:mr-12 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="bg-card w-[280px] ml-auto p-4 rounded-xl shadow-lg border absolute -top-16 -right-6 lg:-right-12 rotate-[4deg] z-0"
                        >
                            <p className="text-sm text-muted-foreground mb-1">Recommended for you</p>
                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 p-2.5 rounded-lg flex items-center justify-center shrink-0 w-12 h-12">
                                    <Shirt className="h-6 w-6 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-sm sm:text-base truncate">Nike Hoodie • Size L</p>
                                    <p className="text-xs text-green-500 font-medium">92% Match</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="bg-card p-6 rounded-2xl shadow-xl border relative z-10"
                        >
                            <h4 className="font-display font-bold text-lg mb-4">Your Fit Profile</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Preferred Fit</span>
                                    <span className="font-medium bg-secondary px-2 py-0.5 rounded">Regular</span>
                                </div>
                                <div className="w-full bg-secondary h-px" />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Successful Matches</span>
                                    <span className="font-medium">12 Items</span>
                                </div>
                                <div className="w-full bg-secondary h-px" />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Brands Explored</span>
                                    <span className="font-medium">5 Brands</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
