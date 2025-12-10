import { motion } from 'framer-motion'

const features = [
  {
    id: 1,
    title: 'Structure, Not Walls of Text',
    description: 'Contracts become navigable. Clauses, definitions, schedules — organized in a sidebar you can actually use. Click "Service Hours" and see exactly what it means. No more Ctrl+F hunting.',
    image: 'poc-structure.png',
    imageAlt: 'Document structure sidebar with definitions',
  },
  {
    id: 2,
    title: 'AI That Shows Its Work',
    description: 'Every suggestion comes with reasoning. "Reduce P1 response time to 20 minutes" — here\'s why, here\'s the clause, here\'s the cost impact. Accept or reject with confidence.',
    image: 'poc-ai-suggestion.png',
    imageAlt: 'AI suggestion with explanation',
  },
  {
    id: 3,
    title: 'Facts Extracted, Risks Surfaced',
    description: 'Liability caps, payment terms, availability targets — pulled out automatically with confidence scores. See who owes what, by when, and what happens if they don\'t.',
    image: 'poc-constraints.png',
    imageAlt: 'Extracted constraints panel',
  },
]

export function Features() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-clash text-3xl sm:text-4xl font-semibold text-text-primary">
            You're not a lawyer.
            <br />
            <span className="text-text-secondary">But here you are.</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Buried in MSAs, NDAs, and vendor agreements. Copying clauses into ChatGPT.
            Hoping you didn't miss something important. There's a better way.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative bg-bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="aspect-4/3 bg-linear-to-br from-slate-100 to-slate-50 border-b border-border overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-text-secondary">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-accent/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs">{feature.image}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-satoshi text-xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
