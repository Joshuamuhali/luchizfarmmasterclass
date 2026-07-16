export function Testimonials() {
  const testimonials = [
    {
      name: 'Mary Nakamba',
      location: 'Ndola',
      text: 'I was losing money every month. After this masterclass, I\'ve tripled my profit. Best investment I ever made for my farm.',
      rating: 5,
      result: '3x Profit Increase',
    },
    {
      name: 'John Chikwanda',
      location: 'Lusaka',
      text: 'The feed optimization alone saved me thousands. Plus the WhatsApp support team answered every question within hours.',
      rating: 5,
      result: 'Saved ZMW 15,000',
    },
    {
      name: 'Sarah Mwenya',
      location: 'Kitwe',
      text: 'I learned more in 3 days than I did in 5 years of farming blindly. This system is a complete game-changer.',
      rating: 5,
      result: 'From Zero to Profit',
    },
    {
      name: 'Peter Banda',
      location: 'Chingola',
      text: 'Went from 10 pigs to 50 in 6 months. The breeding strategies alone were worth 10x the investment.',
      rating: 5,
      result: '5x Herd Growth',
    },
    {
      name: 'Grace Tembo',
      location: 'Kabwe',
      text: 'The disease prevention module saved my entire herd from ASF. This training literally saved my business.',
      rating: 5,
      result: 'Saved Herd',
    },
    {
      name: 'David Mulenga',
      location: 'Livingstone',
      text: 'I was skeptical at first, but the results speak for themselves. My profit margins went from 15% to 45%.',
      rating: 5,
      result: '30% Profit Margin',
    },
  ]

  return (
    <div className="py-20 px-6 bg-gradient-to-b from-background to-white/30">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Real Farmers, Real Results</h2>
          <p className="text-lg text-foreground/70">
            See what happened when farmers just like you implemented this system
          </p>
        </div>

        {/* Urgency Banner */}
        <div className="glass-strong p-4 rounded-xl border-2 border-red-400/50 bg-red-50/50">
          <p className="text-center font-semibold text-red-800">
            🔥 <span className="text-lg">Join 240+ successful farmers</span> who have already transformed their operations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="glass-strong p-8 rounded-2xl space-y-4 hover:scale-105 transition-transform">
              {/* Result Badge */}
              <div className="inline-block bg-primary/10 px-3 py-1 rounded-full">
                <p className="text-xs font-semibold text-primary">{testimonial.result}</p>
              </div>

              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/90 italic">"{testimonial.text}"</p>

              {/* Author */}
              <div className="pt-4 border-t border-white/20">
                <p className="font-bold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-foreground/60">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Numbers */}
        <div className="grid md:grid-cols-3 gap-6 pt-12">
          <div className="glass-strong p-6 rounded-2xl text-center space-y-2">
            <p className="text-5xl font-bold text-primary">{process.env.NEXT_PUBLIC_FARMERS_COUNT || '240'}+</p>
            <p className="text-foreground/70 font-semibold">Farmers Trained</p>
            <p className="text-xs text-foreground/60">And growing every day</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl text-center space-y-2">
            <p className="text-5xl font-bold text-primary">4.9/5</p>
            <p className="text-foreground/70 font-semibold">Average Rating</p>
            <p className="text-xs text-foreground/60">From 200+ reviews</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl text-center space-y-2">
            <p className="text-5xl font-bold text-primary">3x</p>
            <p className="text-foreground/70 font-semibold">Average Profit Increase</p>
            <p className="text-xs text-foreground/60">Within 90 days</p>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full">
            <span className="text-2xl">🏆</span>
            <p className="text-sm font-semibold text-foreground">
              Trusted by farmers across Zambia
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}