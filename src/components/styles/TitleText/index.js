import React from 'react'
import { motion } from 'framer-motion';
import { textVariant2 } from '../../../utils/motion';

const TitleText = ({textStyles,title,}) => {
  return (
    <motion.h2
    variants={textVariant2}
    initial="hidden"
    whileInView="show"
    className={`mt-3px font-bold md:text-[44px] text-[40px] text-gray-900 ${textStyles}`}
  >
    {title}
  </motion.h2>
  )
}

export default TitleText