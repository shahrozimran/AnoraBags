import React from "react"
import Image from "next/image"

interface BrandLogoProps {
  className?: string
  showTagline?: boolean
  variant?: "dark" | "light"
  size?: "sm" | "md" | "lg"
}

export function BrandLogo({
  className = "",
  showTagline = true,
  variant = "dark",
  size = "md"
}: BrandLogoProps) {
  const isLight = variant === "light"
  const logoSrc = isLight ? "/images/logo-tight-light.png" : "/images/logo-tight.png"

  // Dimensions matching the exact aspect ratio of the Anora Bags logo mark (1.29:1)
  const sizeConfig = {
    sm: { width: 44, height: 34, className: "h-8 sm:h-9 w-auto" },
    md: { width: 62, height: 48, className: "h-11 sm:h-13 w-auto" },
    lg: { width: 88, height: 68, className: "h-16 sm:h-18 w-auto" }
  }

  const currentSize = sizeConfig[size] || sizeConfig.md

  return (
    <div className={`flex flex-col items-center select-none group ${className}`}>
      <div className="relative transition-all duration-300 group-hover:opacity-90 group-hover:scale-[1.02]">
        <Image
          src={logoSrc}
          alt="Anora Bags — Bags For Every You"
          width={currentSize.width}
          height={currentSize.height}
          className={`${currentSize.className} object-contain`}
          priority
        />
      </div>
      <span className="sr-only">Anora Bags</span>
    </div>
  )
}
