import React from 'react'

/* eslint-disable @next/next/no-img-element */
const NextImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const { alt, ...rest } = props
  return <img {...rest} alt={alt || 'Mocked Image'} />
}

export default NextImage