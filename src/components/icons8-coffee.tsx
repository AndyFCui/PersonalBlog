interface Icons8CoffeeProps {
  size?: number
  className?: string
}

export function Icons8Coffee({ size = 20, className = '' }: Icons8CoffeeProps) {
  return (
    <img
      src="https://img.icons8.com/?size=100&id=iKeFSWF9ihHl&format=png&color=000000"
      alt="Coffee"
      width={size}
      height={size}
      className={className}
    />
  )
}
