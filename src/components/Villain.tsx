import { motion } from 'framer-motion'

const painPoints = [
  {
    title: '"Just sign it."',
    description: 'Pressure from sales teams and partners to move faster.',
  },
  {
    title: 'Ctrl+F Hunts.',
    description: 'Frantically searching for "Limitation of Liability" and "Indemnification" and praying you understand the implications.',
  },
  {
    title: 'ChatGPT Gibberish.',
    description: 'Pasting clauses into an AI, getting a confident-sounding but context-free summary, and hoping for the best.',
  },
  {
    title: 'Billable-Hour Dread.',
    description: 'Wondering if this is the question that will cost you another $500 in legal fees.',
  },
]

export function Villain() {
  return (
    <section className="relative pt-40 sm:pt-56 lg:pt-72 pb-20 px-6 bg-zinc-900 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="font-clash text-3xl sm:text-4xl lg:text-5xl font-semibold text-center leading-tight text-zinc-400"
        >
          You're not a lawyer.
          <br />
          <span className="text-white">But you always end up acting like one.</span>
        </motion.h2>

        {/* Intro paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 text-lg text-zinc-300 text-center max-w-2xl mx-auto"
        >
          Contracts are designed to be opaque. A fortress of defined terms, cross-references, and liabilities, built by lawyers, for lawyers.
        </motion.p>

        {/* Pain points list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <p className="text-lg text-zinc-400 text-center mb-8">It's a world of:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {painPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="p-5 rounded-xl bg-zinc-800/50 border border-zinc-700/50"
              >
                <h3 className="font-satoshi font-bold text-white mb-2">{point.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-lg text-zinc-300 text-center max-w-2xl mx-auto"
        >
          This isn't just inefficient; it's <span className="text-white font-medium">dangerous</span>. It's how you end up agreeing to unlimited liability for a data breach or a 90-day payment term that kills your cash flow.
        </motion.p>
      </div>
    </section>
  )
}
