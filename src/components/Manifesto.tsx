import { motion } from 'framer-motion'

const beliefs = [
  {
    title: 'Clarity is a right, not a privilege.',
    description: 'You should be able to understand your commitments without a law degree.',
  },
  {
    title: 'AI should show its work.',
    description: 'No black boxes. Every suggestion should come with a "why," letting you stay in control.',
  },
  {
    title: 'Structure liberates, it doesn\'t confine.',
    description: 'When you can see the moving parts of a contract, you can negotiate with confidence.',
  },
  {
    title: 'Founders deserve better tools.',
    description: 'Your stack has tools for code, design, and finance. It\'s time for a tool that handles legal with the same level of intelligence.',
  },
]

export function Manifesto() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="font-clash text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-primary text-center leading-tight"
        >
          Contracts are just data, though.
          <br />
          <span className="text-accent">We should be treating them that way.</span>
        </motion.h2>

        {/* Intro paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 text-lg text-text-secondary text-center max-w-2xl mx-auto"
        >
          A contract isn't a sacred scroll.
          It's a structured document with inputs, outputs, and obligations. It's a system of logic.
          <br />
          <br />
          So why do we keep treating it like arcane text, accessible only to people in the know?
        </motion.p>

        {/* Beliefs intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 text-lg text-text-primary font-medium text-center"
        >
          At LexLoop, we believe:
        </motion.p>

        {/* Beliefs grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {beliefs.map((belief, index) => (
            <motion.div
              key={belief.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="p-6 rounded-xl bg-bg-card border border-border hover:border-accent/30 transition-colors"
            >
              <h3 className="font-satoshi font-bold text-text-primary mb-2">{belief.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{belief.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Closing paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-lg text-text-secondary text-center max-w-2xl mx-auto"
        >
          LexLoop isn't built for enterprise legal teams or big law firms.
          <br />
          It's a co-pilot that turns legal documents from something you dread into <span className="text-accent font-bold">something you understand.</span>
        </motion.p>
      </div>
    </section>
  )
}
