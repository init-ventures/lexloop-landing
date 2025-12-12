import { motion } from 'framer-motion'
import nicolasImg from '../assets/nicolas.jpg'

export function FounderStory() {
  return (
    <section className="py-20 px-6 bg-accent-subtle">
      <div className="max-w-3xl mx-auto">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="font-clash text-3xl sm:text-4xl font-semibold text-text-primary text-center"
        >
          Built by founders who've felt the pain.
        </motion.h2>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12"
        >
          <blockquote className="relative">
            <p className="text-lg sm:text-xl text-text-primary leading-relaxed pl-8 border-l-4 border-accent">
              I spent the last four years running a startup studio focused on early-stage SaaS startups.
              <br />
              For all our early-stage startups, I had to manage legal docs without a legal team.
              <br />
              I negotiated investment term sheets, drafted service agreements, and reviewed vendor contracts.
              <br />
              <br />
              My "workflow" was a messy combination of Google Docs, ChatGPT, and a constant, low-grade anxiety. I knew there had to be a better way.
              <br />
              <br />
              LexLoop is the tool I wish I'd had.
              <br />
              <span className="text-accent font-bold">So I'm building it.</span>
            </p>
          </blockquote>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 pl-8 flex items-center gap-4"
          >
            <img
              src={nicolasImg}
              alt="Nicolas, founder of LexLoop"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-satoshi font-bold text-text-primary">Nicolas</p>
              <p className="text-sm text-text-secondary">Founder of LexLoop</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
