'use client'

export function SalesHostBio() {
  return (
    <div className="py-20 px-6 bg-gradient-to-b from-white/30 to-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="glass-strong p-12 rounded-2xl space-y-8 border-2 border-primary/20">
          <div className="text-center space-y-4">
            <div className="text-6xl">👩‍🌾</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Meet Your Masterclass Host
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 text-center">
              <img 
                src="/e14a922d-247f-4069-b439-b491bfd5d785_removalai_preview.png" 
                alt="Clotilda Mwansa Cholamwaanga (Clo)" 
                className="w-40 h-48 rounded-lg object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-foreground">Clotilda Mwansa Chola Mwaanga (Clo)</h3>
              <p className="text-primary text-sm font-medium">Founder, Luchiz Farm</p>
              <p className="text-muted-foreground text-sm mt-1">Chisamba, Central Province | Kabwe, Zambia</p>
              <p className="text-sm italic mt-2 text-foreground/70">"If you ate today, thank a farmer."</p>
            </div>

            <div className="md:w-2/3 text-left space-y-4">
              <p className="text-lg text-foreground/90">
                <span className="font-semibold text-foreground">Clotilda Mwansa Cholamwaanga (Clo)</span> is a Zambian farmer and founder of <span className="font-semibold text-foreground">Luchiz Farm</span>, based in Chisamba with operations in Kabwe. Her farm produces fresh vegetables and responsibly raised livestock, supplying households and businesses across Zambia.
              </p>

              <p className="text-lg text-foreground/90">
                Passionate about empowering farmers, Clo authored <span className="font-semibold text-foreground">"The Pig Farmer's Guide"</span>, a practical handbook covering pig production essentials from housing to marketing. Her work focuses on quality, ethical farming, and strengthening Zambia's agricultural sector.
              </p>
            </div>
          </div>

          {/* Farm Image */}
          <div className="glass p-4 rounded-xl">
            <img 
              src="/583483774_2092451911492716_382330113565335213_n.jpg" 
              alt="Healthy pigs at Luchiz Farm" 
              className="rounded-lg w-full h-64 object-cover"
            />
          </div>

          {/* Contact Info */}
          <div className="glass p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-bold text-foreground text-center">Get In Touch</h3>
            <div className="flex flex-wrap justify-center gap-6 text-foreground/80">
              <div className="flex items-center gap-2">
                <span>📱</span>
                <span>+260 979 654 602</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Chisamba, Central Province</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏢</span>
                <span>Kabwe, Zambia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
