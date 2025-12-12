import { motion } from 'framer-motion'
import { DemoStructure } from '../pages/DemoStructure'

// Curly arrow SVG with loop pointing down
function CurvedArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Arrow head */}
      <path
        d="M 80.224 73.891 c -0.049 0.007 -0.095 0.029 -0.145 0.029 c -0.029 0 -0.055 -0.014 -0.084 -0.017 c -0.038 -0.001 -0.073 0.012 -0.111 0.006 c -0.064 -0.009 -0.117 -0.042 -0.176 -0.063 c -0.007 -0.003 -0.013 -0.004 -0.019 -0.007 c -0.21 -0.078 -0.383 -0.211 -0.498 -0.393 l -8.733 -8.734 c -0.391 -0.391 -0.391 -1.023 0 -1.414 s 1.023 -0.391 1.414 0 l 7.41 7.411 c 1.64 -15.449 -4.181 -28.442 -16.193 -35.847 c -0.471 -0.29 -0.617 -0.906 -0.327 -1.376 s 0.906 -0.616 1.376 -0.326 C 75.44 40.125 81.578 51.72 81.578 65.636 c 0 1.505 -0.08 3.04 -0.225 4.596 l 6.934 -6.934 c 0.391 -0.391 1.023 -0.391 1.414 0 c 0.195 0.195 0.293 0.451 0.293 0.707 c 0 0.256 -0.098 0.512 -0.293 0.707 l -8.914 8.914 c -0.131 0.131 -0.298 0.204 -0.475 0.247 C 80.283 73.882 80.254 73.885 80.224 73.891 z"
        fill="currentColor"
        strokeLinecap="round"
      />
      {/* Curly path with loop */}
      <path
        d="M 32.153 16.912 c 10.517 2.136 19.862 8.403 23.81 15.969 c 0.929 1.793 1.383 3.915 1.383 6.185 c 0 3.564 -1.12 7.493 -3.284 11.086 c -2.334 3.879 -5.582 6.906 -9.145 8.525 c -3.689 1.676 -7.284 1.658 -10.124 -0.052 c -5.733 -3.451 -6.419 -12.871 -1.529 -20.994 c 0.003 -0.006 0.01 -0.009 0.013 -0.014 c 2.095 -3.475 4.99 -6.324 8.152 -8.022 c 0.486 -0.261 1.093 -0.079 1.354 0.408 c 0.081 0.15 0.119 0.313 0.119 0.472 c 0 0.356 -0.191 0.702 -0.527 0.882 c -2.855 1.534 -5.481 4.129 -7.395 7.308 c -0.003 0.004 -0.007 0.006 -0.01 0.01 c -4.314 7.178 -3.933 15.354 0.853 18.238 c 2.258 1.359 5.193 1.339 8.265 -0.057 c 3.197 -1.453 6.131 -4.2 8.259 -7.735 c 3.191 -5.299 3.913 -11.312 1.84 -15.317 c -3.679 -7.05 -12.484 -12.911 -22.434 -14.931 C 20.714 16.63 10.016 19.2 1.629 26.11 c -0.426 0.351 -1.056 0.29 -1.408 -0.136 c -0.351 -0.426 -0.291 -1.056 0.136 -1.408 C 9.218 17.266 20.51 14.547 32.153 16.912 z"
        fill="currentColor"
        strokeLinecap="round"
      />
    </svg>
  )
}

const features = [
  {
    id: 1,
    title: 'Structure, not static text',
    description: 'Contracts become navigable objects. Definitions, clauses, and payment terms are automatically identified and organized. Click "Governing Law" and instantly see the jurisdiction. No more endless scrolling.',
    demoProps: {
      variant: 'structure' as const,
      allowNavigation: true,
    },
  },
  {
    id: 2,
    title: 'LexAI joins the conversation',
    description: 'Ask a question about a clause, and your team can weigh in — legal, ops, finance. LexAI participates too, pulling in relevant context and explaining its reasoning. Every decision, documented. Every rationale, traceable.',
    demoProps: {
      variant: 'loops' as const,
      allowNavigation: false,
      hiddenTabs: ['facts'],
    },
  },
  {
    id: 3,
    title: 'Facts extracted, risks surfaced',
    description: 'Who owes what? By when? What\'s your liability cap? LexLoop pulls these critical facts out of the prose and puts them in a simple summary. See your obligations at a glance and spot red flags before they become disasters.',
    demoProps: {
      variant: 'clause' as const,
      allowNavigation: false,
      initialClauseId: 'clause-2-2',
    },
  },
]

export function Features() {
  return (
    <section className="py-24 px-6 bg-zinc-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-clash text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-primary">
            From a wall of text
            <br />
            to an
            <span className="text-accent"> actionable process.</span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto">
            LexLoop ingests your contracts and transforms them into an interactive workspace.
            <br />
            No more walls of text. <span className="text-accent font-bold">Just clarity.</span>
          </p>
        </motion.div>

        {/* Alternating feature rows */}
        <div className="space-y-24">
          {features.map((feature, index) => {
            const isReversed = index % 2 === 1
            const isFirst = index === 0
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16`}
              >
                {/* Text content */}
                <div className="flex-1 max-w-lg">
                  <h3 className="font-clash text-2xl sm:text-3xl font-semibold text-text-primary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Interactive demo with optional CTA */}
                <div className="flex-1 w-full flex flex-col items-center">
                  {isFirst && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="flex items-start gap-1.5 mb-3 self-start lg:self-start"
                    >
                      <span className="text-base font-semibold tracking-wide text-emerald-500">Click around. You'll see.</span>
                      <CurvedArrow className="w-14 h-10 text-accent -mb-1" />
                    </motion.div>
                  )}
                  <DemoStructure {...feature.demoProps} embedded />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
