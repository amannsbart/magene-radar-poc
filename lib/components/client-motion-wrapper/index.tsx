'use client'

import { motion, Variants } from 'motion/react'

const variant: Variants = {
  hidden: { filter: 'blur(10px)', opacity: 0 },
  visible: { filter: 'blur(0px)', opacity: 1 },
}

export function ClientMotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 1.2 }}
      variants={variant}
      className="space-y-24"
    >
      {children}
    </motion.div>
  )
}
