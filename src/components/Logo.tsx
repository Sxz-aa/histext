
import Image from 'next/image'
import React from 'react'

interface LogoProps {
  className?: string
  imageClassName?: string
}

const Logo: React.FC<LogoProps> = ({ className = '', imageClassName = 'img' }) => {
  return (
    <div className={`relative ${className} layoutimg`}>
      <div className="flex items-center  logoimg" style={{ 
        width:375,
            left:0,
            position: 'relative',
            padding: 0
          }}>
        <Image
          src="/abicon.png"
          alt="Logo"
          width={26}
          height={26}
          
          className={`md:w-12 md:h-12 object-contain ${imageClassName}`}
        />
        <div className="ml-3 md:ml-4">
          <div className="text-xl md:text-2xl leading-tight">AB Connect</div>
          <div className="text-xl md:text-2xl leading-tight">Explorer</div>
        </div>
      </div>
      <style jsx>{`

      /* 基础样式 */
      .layoutimg {
        position: relative;
      }

      /* 仅在 PC 端生效 */
      @media (min-width: 769px) {
        .layoutimg {
          margin-left: 130px;
        }
      }


      `}</style>


    </div>
  )
}

export default Logo
