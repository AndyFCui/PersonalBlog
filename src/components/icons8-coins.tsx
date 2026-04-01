interface Icons8CoinsProps {
  size?: number
  className?: string
}

export function Icons8Coins({ size = 20, className = '' }: Icons8CoinsProps) {
  return (
    <img
      src="https://img.icons8.com/?size=100&id=13009&format=png&color=000000"
      alt="Coins"
      width={size}
      height={size}
      className={className}
    />
  )
}
