type LoopVideoProps = {
  src: string
  className?: string
  preload?: "auto" | "metadata" | "none"
}

export function LoopVideo({
  src,
  className,
  preload = "metadata",
}: LoopVideoProps) {
  return (
    <video
      className={className}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload={preload}
      aria-hidden="true"
      ref={(node) => {
        if (node) node.muted = true
      }}
    />
  )
}
