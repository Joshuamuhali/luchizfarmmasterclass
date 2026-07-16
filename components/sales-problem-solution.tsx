export function ProblemSolution() {
  return (
    <div className="py-20 px-6 bg-white/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Problem Section */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-foreground text-center">The Problem Most Farmers Face</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass p-8 rounded-2xl border-l-4 border-red-400 space-y-4">
              <p className="text-2xl font-bold text-red-500">❌</p>
              <h3 className="font-bold text-foreground">No Proven System</h3>
              <p className="text-foreground/70">
                You're learning as you go, making expensive mistakes that cost thousands.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border-l-4 border-red-400 space-y-4">
              <p className="text-2xl font-bold text-red-500">❌</p>
              <h3 className="font-bold text-foreground">Inconsistent Results</h3>
              <p className="text-foreground/70">
                Some months profit, some months loss. No way to predict or control outcomes.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl border-l-4 border-red-400 space-y-4">
              <p className="text-2xl font-bold text-red-500">❌</p>
              <h3 className="font-bold text-foreground">Wasting Money</h3>
              <p className="text-foreground/70">
                Wrong feed, wrong genetics, wrong timeline. Bleeding money every week.
              </p>
            </div>
          </div>

          {/* Scarcity Message */}
          <div className="glass-strong p-6 rounded-2xl border-2 border-orange-400/50 bg-orange-50/50">
            <p className="text-center text-lg font-semibold text-orange-800">
              ⚠️ Every day you wait is another day of losses. While you're thinking about it, other farmers are already implementing these systems and pulling ahead.
            </p>
          </div>
        </div>

        {/* Solution Section */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-foreground text-center">Our Proven Solution</h2>

          <div className="glass-strong p-12 rounded-2xl space-y-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <p className="text-3xl font-bold text-primary">1</p>
                <h3 className="font-bold text-foreground">System</h3>
                <p className="text-sm text-foreground/70">
                  The exact blueprint successful farmers use
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-3xl font-bold text-primary">2</p>
                <h3 className="font-bold text-foreground">Implementation</h3>
                <p className="text-sm text-foreground/70">
                  Step-by-step guides you can apply today
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-3xl font-bold text-primary">3</p>
                <h3 className="font-bold text-foreground">Support</h3>
                <p className="text-sm text-foreground/70">
                  2 weeks of direct support from experts
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-3xl font-bold text-primary">4</p>
                <h3 className="font-bold text-foreground">Community</h3>
                <p className="text-sm text-foreground/70">
                  Network with successful pig farmers
                </p>
              </div>
            </div>

            <div className="border-t border-white/30 pt-8 space-y-4">
              <h4 className="font-bold text-foreground text-lg">What You'll Learn:</h4>
              <ul className="grid md:grid-cols-2 gap-4 text-foreground/80">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Feed optimization to cut costs by 40%</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Breeding strategies for maximum growth</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Disease prevention that saves lives</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Marketing to command premium prices</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Financial tracking & scaling strategies</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Building systems that run without you</span>
                </li>
              </ul>
            </div>

            {/* FOMO Message */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20">
              <p className="text-center text-lg font-semibold text-foreground">
                🎯 <span className="text-primary">Limited to {process.env.NEXT_PUBLIC_SPOTS_LIMIT || '15'} farmers only</span> - We keep groups small for personalized attention
              </p>
              <p className="text-center text-sm text-foreground/70 mt-2">
                Once spots are filled, registration closes until next cohort
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
