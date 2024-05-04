import React from 'react'
import { textContainer , textVariant2 } from '../../../utils/motion'

import { motion } from 'framer-motion';


const TypingText = ({ title, textStyles }) => {
  return (
    <motionp
    variants={textContainer}
    className={`font-bold font-Lemon text-[34px] text-gray-900  ${textStyles}`}
  >
    {Array.from(title).map((letter, index) => (
      <motion.span variants={textVariant2} key={index}>
        {letter === ' ' ? '\u00A0' : letter}
      </motion.span>
    ))}
  </motionp>
  )
}

export default TypingText