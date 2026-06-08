import { motion } from 'framer-motion'
import { cn } from '@/utils/utils'

interface ConfidenceGaugeProps {
    score: number // 0-100
    size?: 'small' | 'medium' | 'large'
    animated?: boolean
    showLabel?: boolean
    variant?: 'circular' | 'linear'
    className?: string
}

export function ConfidenceGauge({
    score,
    size = 'medium',
    animated = true,
    showLabel = true,
    variant = 'circular',
    className,
}: ConfidenceGaugeProps) {
    // Determine color based on score
    let colorClass = 'text-green-500' // green by default
    let ringClass = 'stroke-green-500'
    let bgClass = 'bg-green-500'

    if (score < 60) {
        colorClass = 'text-red-500'
        ringClass = 'stroke-red-500'
        bgClass = 'bg-red-500'
    } else if (score < 80) {
        colorClass = 'text-amber-500'
        ringClass = 'stroke-amber-500'
        bgClass = 'bg-amber-500'
    }

    // Linear Variant
    if (variant === 'linear') {
        return (
            <div className={cn('w-full', className)}>
                <div className="flex justify-between mb-1">
                    {showLabel && <span className="text-sm font-medium">Confidence</span>}
                    <span className={cn('text-sm font-bold', colorClass)}>{score}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                    <motion.div
                        initial={animated ? { width: 0 } : { width: `${score}%` }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={cn('h-2.5 rounded-full', bgClass)}
                    ></motion.div>
                </div>
            </div>
        )
    }

    // Circular Variant Dimensions
    const sizes = {
        small: { radius: 20, stroke: 4, text: 'text-sm' },
        medium: { radius: 40, stroke: 6, text: 'text-xl' },
        large: { radius: 70, stroke: 10, text: 'text-4xl' },
    }
    const currentSize = sizes[size]
    const normalizedRadius = currentSize.radius - currentSize.stroke * 2
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
        <div className={cn('relative flex flex-col items-center justify-center', className)}>
            <svg
                height={currentSize.radius * 2}
                width={currentSize.radius * 2}
                className="rotate-[-90deg]"
            >
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={currentSize.stroke}
                    r={normalizedRadius}
                    cx={currentSize.radius}
                    cy={currentSize.radius}
                    className="text-secondary"
                />
                <motion.circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={currentSize.stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset: circumference }}
                    animate={animated ? { strokeDashoffset } : { strokeDashoffset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={currentSize.radius}
                    cy={currentSize.radius}
                    className={ringClass}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className={cn('font-bold font-display', currentSize.text, colorClass)}>
                    {score}%
                </span>
            </div>
            {showLabel && size !== 'small' && (
                <span className="mt-2 text-sm font-medium text-muted-foreground">Match</span>
            )}
        </div>
    )
}
