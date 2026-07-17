export function ProblemSolution() {
  return (
    <div className="py-20 px-6 bg-white/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Problem Section */}
        <div className="space-y-8" id="problem">
          <h2 className="text-4xl font-bold text-foreground text-center">Why Most Pig Farmers Struggle</h2>
          <p className="text-center text-lg text-foreground/80 max-w-2xl mx-auto">
            Many farmers lose money not because pig farming doesn't work—but because they lack a proven production system.
          </p>

          <div className="glass-strong p-8 rounded-2xl">
            <p className="text-sm font-semibold text-foreground mb-4">Common challenges include:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-red-500">✓</span>
                <span className="text-foreground/80">High feed costs</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500">✓</span>
                <span className="text-foreground/80">Disease outbreaks</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500">✓</span>
                <span className="text-foreground/80">Poor breeding practices</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500">✓</span>
                <span className="text-foreground/80">Low market prices</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-500">✓</span>
                <span className="text-foreground/80">Weak financial planning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Modules Section */}
        <div className="space-y-8" id="course-outline">
          <h2 className="text-4xl font-bold text-foreground text-center">Here's What You'll Learn</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass p-6 rounded-xl space-y-2">
              <p className="text-sm font-semibold text-primary">Module 1</p>
              <h3 className="font-bold text-foreground">Pig Housing</h3>
            </div>
            <div className="glass p-6 rounded-xl space-y-2">
              <p className="text-sm font-semibold text-primary">Module 2</p>
              <h3 className="font-bold text-foreground">Nutrition & Feed Formulation</h3>
            </div>
            <div className="glass p-6 rounded-xl space-y-2">
              <p className="text-sm font-semibold text-primary">Module 3</p>
              <h3 className="font-bold text-foreground">Breeding</h3>
            </div>
            <div className="glass p-6 rounded-xl space-y-2">
              <p className="text-sm font-semibold text-primary">Module 4</p>
              <h3 className="font-bold text-foreground">Disease Prevention</h3>
            </div>
            <div className="glass p-6 rounded-xl space-y-2">
              <p className="text-sm font-semibold text-primary">Module 5</p>
              <h3 className="font-bold text-foreground">Marketing</h3>
            </div>
            <div className="glass p-6 rounded-xl space-y-2">
              <p className="text-sm font-semibold text-primary">Module 6</p>
              <h3 className="font-bold text-foreground">Financial Management</h3>
            </div>
            <div className="glass p-6 rounded-xl space-y-2 md:col-span-2">
              <p className="text-sm font-semibold text-primary">Module 7</p>
              <h3 className="font-bold text-foreground">Scaling Your Farm</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
