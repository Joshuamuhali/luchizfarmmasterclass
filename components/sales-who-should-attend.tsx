export function WhoShouldAttend() {
  return (
    <div className="py-20 px-6 bg-gradient-to-b from-white/30 to-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="glass-strong p-12 rounded-2xl space-y-8 border-2 border-primary/20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Who This Masterclass Is For
            </h2>
            <p className="text-lg text-foreground/80">
              Ideal if you are:
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 glass p-4 rounded-xl">
              <span className="text-2xl text-primary">✓</span>
              <span className="text-foreground/90">Starting pig farming</span>
            </div>
            <div className="flex items-center gap-4 glass p-4 rounded-xl">
              <span className="text-2xl text-primary">✓</span>
              <span className="text-foreground/90">Already farming but not profitable</span>
            </div>
            <div className="flex items-center gap-4 glass p-4 rounded-xl">
              <span className="text-2xl text-primary">✓</span>
              <span className="text-foreground/90">Looking to reduce feed costs</span>
            </div>
            <div className="flex items-center gap-4 glass p-4 rounded-xl">
              <span className="text-2xl text-primary">✓</span>
              <span className="text-foreground/90">Planning to expand your farm</span>
            </div>
            <div className="flex items-center gap-4 glass p-4 rounded-xl">
              <span className="text-2xl text-primary">✓</span>
              <span className="text-foreground/90">Interested in commercial pig production</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
