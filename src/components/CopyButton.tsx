
import { useCallback, useState } from 'react'
import { useAnimation, motion } from 'framer-motion'
import Image from 'next/image'

interface CopyButtonProps {
  text: string
  iconSize?: number
  className?: string
}

export function CopyButton({ 
  text,
  iconSize = 16,
  className = ''
}: CopyButtonProps) {
  const animationControls = useAnimation()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      
      animationControls.start({
        opacity: [0, 1],
        y: [10, 0],
        transition: { duration: 0.3 }
      }).then(() => {
        setTimeout(() => {
          animationControls.start({
            opacity: 0,
            transition: { duration: 0.2 }
          })
          setIsCopied(false)
        }, 2000)
      })
    } catch (error) {
      console.error('复制失败:', error)
      animationControls.start({
        opacity: 1,
        color: '#ef4444',
        content: '"复制失败"',
        transition: { duration: 0.2 }
      })
    }
  }, [text, animationControls])

  return (
    <div className={`relative !cursor-pointer inline-block ${className}`}>
        <motion.div
                onClick={handleCopy}
        className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
        aria-label={isCopied ? "已复制" : "复制内容"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
       {isCopied ? (
          <motion.svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <path
              d="M5 13L9 17L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        ) : (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Image
              src="/copyicon2x.png"
              alt="复制"
              width={iconSize}
              height={iconSize}
              quality={75}
            />
          </motion.div>
        )}
      </motion.div>

     <style jsx>{`



      `}</style>

    </div>
  )
}
