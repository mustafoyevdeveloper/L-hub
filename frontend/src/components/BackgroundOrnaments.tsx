export default function BackgroundOrnaments() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-primary opacity-30 blur-3xl animate-float" />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-gradient-primary opacity-20 blur-3xl animate-float-slow" />
      <div className="absolute left-1/3 bottom-[-120px] h-96 w-96 rounded-full bg-gradient-primary opacity-20 blur-3xl animate-float" />
    </div>
  )
}


