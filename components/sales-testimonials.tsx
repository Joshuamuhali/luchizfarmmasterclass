export function Testimonials() {
  const testimonials = [
    {
      name: 'Mary Nakamba',
      location: 'Ndola',
      text: 'I was new to pig farming and struggling. This masterclass gave me the foundation I needed to start properly.',
      rating: 5,
      type: 'Beginner',
    },
    {
      name: 'John Chikwanda',
      location: 'Lusaka',
      text: 'I\'ve been farming for years but wasn\'t profitable. The systems I learned here completely changed my operation.',
      rating: 5,
      type: 'Experienced Farmer',
    },
    {
      name: 'Sarah Mwenya',
      location: 'Kitwe',
      text: 'As a woman in agriculture, I found this training incredibly supportive and practical. Highly recommend.',
      rating: 5,
      type: 'Woman Farmer',
    },
  ]

  return (
    <div className="py-20 px-6 bg-gradient-to-b from-background to-white/30">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">What Farmers Say</h2>
          <p className="text-lg text-foreground/70">
            Hear from farmers who have taken this masterclass
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="glass-strong p-8 rounded-2xl space-y-4">
              {/* Type Badge */}
              <div className="inline-block bg-primary/10 px-3 py-1 rounded-full">
                <p className="text-xs font-semibold text-primary">{testimonial.type}</p>
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
            <p className="text-5xl font-bold text-primary">240+</p>
            <p className="text-foreground/70 font-semibold">Farmers Trained</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl text-center space-y-2">
            <p className="text-5xl font-bold text-primary">4.9★</p>
            <p className="text-foreground/70 font-semibold">Average Rating</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl text-center space-y-2">
            <p className="text-5xl font-bold text-primary">100%</p>
            <p className="text-foreground/70 font-semibold">Would Recommend</p>
          </div>
        </div>
      </div>
    </div>
  )
}