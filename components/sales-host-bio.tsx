'use client'

export function SalesHostBio() {
  return (
    <div className="py-20 px-6 bg-gradient-to-b from-white/30 to-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="glass-strong p-12 rounded-2xl space-y-8 border-2 border-primary/20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Meet Your Trainer
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 text-center">
              <img 
                src="/e14a922d-247f-4069-b439-b491bfd5d785_removalai_preview.png" 
                alt="Clotilda Mwansa Cholamwaanga (Clo)" 
                className="w-40 h-48 rounded-lg object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-foreground">Clotilda Mwansa Cholamwaanga (Clo)</h3>
              <p className="text-primary text-sm font-medium">Founder, Luchiz Farm</p>
              <p className="text-muted-foreground text-sm mt-1">Chisamba, Central Province | Kabwe, Zambia</p>
            </div>

            <div className="md:w-2/3 text-left space-y-4">
              <p className="text-lg text-foreground/90">
                <span className="font-semibold text-foreground">Clotilda Mwansa Cholamwaanga (Clo)</span> is a Zambian farmer and founder of <span className="font-semibold text-foreground">Luchiz Farm</span>, based in Chisamba with operations in Kabwe. Her farm produces fresh vegetables and responsibly raised livestock, supplying households and businesses across Zambia.
              </p>

              <p className="text-lg text-foreground/90">
                Passionate about empowering farmers, Clo authored <span className="font-semibold text-foreground">"The Pig Farmer's Guide"</span>, a practical handbook covering pig production essentials from housing to marketing.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="glass px-4 py-2 rounded-lg">
                  <p className="text-sm font-semibold text-primary">Author</p>
                  <p className="text-xs text-foreground/70">The Pig Farmer's Guide</p>
                </div>
                <div className="glass px-4 py-2 rounded-lg">
                  <p className="text-sm font-semibold text-primary">Location</p>
                  <p className="text-xs text-foreground/70">Chisamba & Kabwe, Zambia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
