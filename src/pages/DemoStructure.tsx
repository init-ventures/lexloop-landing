import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronDown,
  Layers,
  ArrowLeft,
  FileText,
  ExternalLink,
  BookOpen,
  Brain,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Users,
  Scale,
  Network,
  Check,
  BarChart3,
  Lightbulb,
  DollarSign,
  Calendar,
  RotateCcw,
  MessageCircle,
  Sparkles,
} from 'lucide-react'

// Data structures
type ClauseNode = {
  id: string
  number: string
  title: string
  children?: ClauseNode[]
}

type Definition = {
  id: string
  term: string
  definition: string
  usedIn?: string
}

type Fact = {
  id: string
  label: string
  value: string
  source: string
  party?: string
  semanticConfidence: number
  crossRefConfidence: number
  relatedInsightId?: string
}

type FactCategory = {
  id: string
  title: string
  icon: 'users' | 'scale' | 'shield' | 'dollar' | 'calendar'
  items: Fact[]
}

type Insight = {
  id: string
  title: string
  explanation: string
  clause: string
  type: 'optimization' | 'compliance' | 'risk' | 'consistency'
  targetFactId?: string
}

type PillCategory = 'definition' | 'amount' | 'date' | 'duration' | 'percentage'

type ClauseContent = {
  id: string
  number: string
  title: string
  content: React.ReactNode
}

// Outline data
const outline: ClauseNode[] = [
  {
    id: 'clause-1',
    number: '1',
    title: 'Definitions',
    children: [
      { id: 'clause-1-1', number: '1.1', title: 'Interpretation' },
      { id: 'clause-1-2', number: '1.2', title: 'Key Definitions' },
    ],
  },
  {
    id: 'clause-2',
    number: '2',
    title: 'Services',
    children: [
      { id: 'clause-2-1', number: '2.1', title: 'Scope of Services' },
      { id: 'clause-2-2', number: '2.2', title: 'Service Levels' },
    ],
  },
  {
    id: 'clause-3',
    number: '3',
    title: 'Fees and Payment',
    children: [
      { id: 'clause-3-1', number: '3.1', title: 'Fee Structure' },
      { id: 'clause-3-2', number: '3.2', title: 'Invoices and Late Payment' },
    ],
  },
  {
    id: 'clause-4',
    number: '4',
    title: 'Term and Termination',
    children: [
      { id: 'clause-4-1', number: '4.1', title: 'Term' },
      { id: 'clause-4-2', number: '4.2', title: 'Termination for Cause' },
    ],
  },
  {
    id: 'clause-5',
    number: '5',
    title: 'Confidentiality and Data Protection',
    children: [
      { id: 'clause-5-1', number: '5.1', title: 'Confidential Information' },
      { id: 'clause-5-2', number: '5.2', title: 'Data Protection' },
    ],
  },
  {
    id: 'clause-6',
    number: '6',
    title: 'Liability and Indemnity',
    children: [
      { id: 'clause-6-1', number: '6.1', title: 'Limitation of Liability' },
      { id: 'clause-6-2', number: '6.2', title: 'Indemnity' },
    ],
  },
  {
    id: 'clause-7',
    number: '7',
    title: 'Insurance',
    children: [],
  },
  {
    id: 'clause-8',
    number: '8',
    title: 'Miscellaneous',
    children: [
      { id: 'clause-8-1', number: '8.1', title: 'Notices' },
      { id: 'clause-8-2', number: '8.2', title: 'Governing Law' },
    ],
  },
  {
    id: 'schedule-1',
    number: 'Schedule 1',
    title: 'Service Description',
    children: [],
  },
  {
    id: 'schedule-2',
    number: 'Schedule 2',
    title: 'Fees & Service Credits',
    children: [],
  },
]

const definitions: Definition[] = [
  { id: 'def-1', term: 'Service Hours', definition: '08:00 – 18:00 CET on Business Days', usedIn: 'clause-2-2' },
  { id: 'def-2', term: 'Business Days', definition: 'Any day except Saturday, Sunday, or public holiday in France', usedIn: 'clause-1-2' },
  { id: 'def-3', term: 'Availability Target', definition: 'Monthly percentage of uptime measured per Schedule 1', usedIn: 'clause-2-2' },
  { id: 'def-4', term: 'Service Credits', definition: 'Credits owed when Service Levels not met', usedIn: 'clause-2-2' },
  { id: 'def-5', term: 'Confidential Information', definition: 'Any non-public business, technical or financial information', usedIn: 'clause-5-1' },
  { id: 'def-6', term: 'Personal Data', definition: 'Information relating to an identified or identifiable person (GDPR)', usedIn: 'clause-5-2' },
  { id: 'def-7', term: 'Effective Date', definition: '1 March 2025', usedIn: 'clause-4-1' },
  { id: 'def-service-provider', term: 'Service Provider', definition: 'Nexora Technologies Ltd.', usedIn: 'clause-1-2' },
  { id: 'def-client', term: 'Client', definition: 'Altavia Retail Group SA', usedIn: 'clause-1-2' },
]

// Fact categories from POC registry
const factCategories: FactCategory[] = [
  {
    id: 'parties',
    title: 'Parties',
    icon: 'users',
    items: [
      { id: 'fact-party-service-provider', label: 'Service Provider', value: 'Nexora Technologies Ltd.', source: 'Preamble', semanticConfidence: 96, crossRefConfidence: 90 },
      { id: 'fact-party-client', label: 'Client', value: 'Altavia Retail Group SA', source: 'Preamble', semanticConfidence: 95, crossRefConfidence: 83 },
    ],
  },
  {
    id: 'legal',
    title: 'Legal Context',
    icon: 'scale',
    items: [
      { id: 'fact-legal-governing-law', label: 'Governing Law', value: 'France', source: 'Clause 8.2', semanticConfidence: 97, crossRefConfidence: 92 },
      { id: 'fact-legal-jurisdiction', label: 'Jurisdiction', value: 'Paris Commercial Court', source: 'Clause 8.2', semanticConfidence: 94, crossRefConfidence: 84 },
    ],
  },
  {
    id: 'constraints',
    title: 'Constraints & Limits',
    icon: 'shield',
    items: [
      { id: 'constraint-liability', label: 'Liability Cap', value: '≤ € 1 000 000 per 12 months', source: '6.1', party: 'Both', semanticConfidence: 93, crossRefConfidence: 89 },
      { id: 'constraint-availability', label: 'Availability Target', value: '≥ 99.9 % monthly', source: '2.2', party: 'Service Provider', semanticConfidence: 92, crossRefConfidence: 88, relatedInsightId: 'sug-3' },
      { id: 'constraint-response-p1', label: 'Response Time (P1)', value: '≤ 30 minutes', source: 'Schedule 2', party: 'Service Provider', semanticConfidence: 90, crossRefConfidence: 87, relatedInsightId: 'sug-1' },
      { id: 'constraint-payment', label: 'Payment Term', value: '≤ 30 days from invoice', source: '3.2', party: 'Client', semanticConfidence: 90, crossRefConfidence: 85 },
      { id: 'constraint-interest', label: 'Interest Rate', value: 'ECB base rate + 5 %', source: '3.2', party: 'Client', semanticConfidence: 88, crossRefConfidence: 84 },
      { id: 'constraint-data-transfer', label: 'Data Transfer Mechanism', value: 'Must use EU‑approved mechanism', source: '5.2', party: 'Service Provider', semanticConfidence: 86, crossRefConfidence: 82, relatedInsightId: 'sug-2' },
    ],
  },
  {
    id: 'amounts',
    title: 'Amounts & Rates',
    icon: 'dollar',
    items: [
      { id: 'amount-annual-fee', label: 'Annual Fee', value: '€ 240 000', source: '3.1', semanticConfidence: 94, crossRefConfidence: 90 },
      { id: 'amount-fee-cap', label: 'Fee Cap', value: '€ 1 200 000 (initial term)', source: '3.1', semanticConfidence: 90, crossRefConfidence: 86 },
      { id: 'amount-insurance', label: 'Insurance Coverage', value: '≥ € 2 000 000 per claim', source: '7', semanticConfidence: 82, crossRefConfidence: 78 },
      { id: 'amount-credit-availability', label: 'Availability Credit', value: 'Credit 2 % per 0.1 % drop below 99.9 %', source: 'Schedule 2', party: 'Service Provider', semanticConfidence: 90, crossRefConfidence: 85 },
      { id: 'amount-credit-p1', label: 'P1 Response Credit', value: 'Credit 1 % per incident', source: 'Schedule 2', party: 'Service Provider', semanticConfidence: 88, crossRefConfidence: 84 },
      { id: 'amount-credit-p2', label: 'P2 Response Credit', value: 'Credit 0.5 % per incident', source: 'Schedule 2', party: 'Service Provider', semanticConfidence: 87, crossRefConfidence: 82 },
    ],
  },
  {
    id: 'dates',
    title: 'Dates & Durations',
    icon: 'calendar',
    items: [
      { id: 'date-effective', label: 'Effective Date', value: '1 March 2025', source: '1.2', semanticConfidence: 98, crossRefConfidence: 95 },
      { id: 'duration-term', label: 'Term', value: '3 years (auto‑renew 1 year)', source: '4.1', semanticConfidence: 90, crossRefConfidence: 86 },
      { id: 'duration-termination', label: 'Termination Notice', value: '90 days', source: '4.1', semanticConfidence: 88, crossRefConfidence: 84 },
      { id: 'duration-termination-cure', label: 'Breach Remedy Period', value: '30 days', source: '4.2', semanticConfidence: 88, crossRefConfidence: 84 },
      { id: 'duration-liability-period', label: 'Liability Cap Period', value: '12 months', source: '6.1', semanticConfidence: 88, crossRefConfidence: 84 },
      { id: 'duration-schedule2-p1', label: 'P1 Response Threshold (Schedule 2)', value: '≤ 20 minutes', source: 'Schedule 2', semanticConfidence: 87, crossRefConfidence: 83 },
      { id: 'duration-schedule2-p2', label: 'P2 Response Threshold (Schedule 2)', value: '≤ 2 hours', source: 'Schedule 2', semanticConfidence: 86, crossRefConfidence: 82 },
      { id: 'compliance-gdpr', label: 'GDPR Transfer Clause Required', value: 'Yes (missing)', source: '5.2', semanticConfidence: 80, crossRefConfidence: 76 },
    ],
  },
]

// AI Suggestions from POC registry
const insights: Insight[] = [
  { id: 'sug-1', title: 'Reduce P1 response time to 20 minutes', explanation: 'Industry benchmark for P1 incidents is 15–30 min. Current 30 min meets minimum but exceeds median. Reducing to 20 min aligns with Schedule 2 and qualifies for Premium Support. Cost impact: +3%.', clause: 'clause-2-2', type: 'optimization', targetFactId: 'constraint-response-p1' },
  { id: 'sug-2', title: 'Add GDPR Art. 46 transfer clause', explanation: 'Missing explicit reference to international data transfer mechanism required under GDPR Art. 46. Recommend adding Standard Contractual Clauses (SCCs) or adequacy decision reference.', clause: 'clause-5-2', type: 'compliance', targetFactId: 'constraint-data-transfer' },
  { id: 'sug-3', title: 'Align Schedule 2 availability with Clause 2.2', explanation: 'Schedule 2 references 99.95% availability target, but Clause 2.2 states 99.9%. This creates contractual ambiguity. Recommend standardizing to 99.9% across both documents.', clause: 'clause-2-2', type: 'consistency', targetFactId: 'constraint-availability' },
  { id: 'sug-4', title: 'Define "Service Window" term', explanation: 'Term "Service Window" used in Clause 2.2 but not defined. Creates interpretation risk. Recommend adding definition in Clause 1.2 or cross-referencing "Service Hours".', clause: 'clause-2-2', type: 'risk' },
]

// Loop types and data
type LoopMessage = {
  id: string
  userId: string
  userName: string
  isAI?: boolean
  content: string
  timestamp: string
}

type Loop = {
  id: string
  title: string
  status: 'open' | 'closed'
  updatedAt: string
  messageCount: number
  messages: LoopMessage[]
}

const loops: Loop[] = [
  {
    id: 'loop-1',
    title: 'Scope of Services Discussion',
    status: 'open',
    updatedAt: '30 min ago',
    messageCount: 4,
    messages: [
      { id: 'msg-1', userId: 'sarah', userName: 'Sarah K.', content: 'Looking at Clause 2.2 - the 99.9% availability target. What happens if we miss this?', timestamp: '5h ago' },
      { id: 'msg-2', userId: 'ai', userName: 'LexAI', isAI: true, content: 'Credits are 2% of monthly fees per 0.1% drop below target. Falls to 99.5%? That\'s 8% back to the client.', timestamp: '5h ago' },
      { id: 'msg-3', userId: 'michael', userName: 'Michael T.', content: 'Our platform had 99.7% uptime last quarter. This target is aggressive.', timestamp: '4h ago' },
      { id: 'msg-4', userId: 'john', userName: 'John D.', content: 'From legal side - 99.9% is market standard for B2B SaaS.', timestamp: '4h ago' },
    ],
  },
  {
    id: 'loop-2',
    title: 'Liability Cap Analysis',
    status: 'open',
    updatedAt: '1.5h ago',
    messageCount: 3,
    messages: [
      { id: 'msg-5', userId: 'john', userName: 'John D.', content: 'The €1M liability cap is only 83% of our total contract value.', timestamp: '7h ago' },
      { id: 'msg-6', userId: 'emma', userName: 'Emma K.', content: 'Why is that a problem? Isn\'t any cap protecting us?', timestamp: '6h ago' },
      { id: 'msg-7', userId: 'ai', userName: 'LexAI', isAI: true, content: 'For enterprise SaaS, typical caps are 1-3x annual fees. Your €1M is above the high end.', timestamp: '5h ago' },
    ],
  },
  {
    id: 'loop-3',
    title: 'Payment Terms & Termination',
    status: 'open',
    updatedAt: '30 min ago',
    messageCount: 2,
    messages: [
      { id: 'msg-8', userId: 'emma', userName: 'Emma K.', content: 'Payment terms are 30 days net. Is that standard?', timestamp: '3h ago' },
      { id: 'msg-9', userId: 'sarah', userName: 'Sarah K.', content: '30 days is standard for B2B. We could ask for 45 or 60.', timestamp: '2h ago' },
    ],
  },
]

// Pill Popover Component
function PillPopover({
  actions,
  position,
  onClose,
}: {
  actions: { type: string; label: string; icon: React.ReactNode; onClick: () => void }[]
  position: { top: number; left: number }
  onClose: () => void
}) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  if (actions.length === 0) return null

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 animate-in fade-in duration-150"
      style={{ top: position.top, left: position.left }}
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden min-w-[180px]">
        <div className="py-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {action.icon}
              <span className="font-medium text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Ontology Pill component
function OntologyPill({
  category,
  children,
  definitionId,
  factId,
  insightId,
  onPillClick,
}: {
  category: PillCategory
  children: React.ReactNode
  definitionId?: string
  factId?: string
  insightId?: string
  onPillClick?: (element: HTMLElement, definitionId?: string, factId?: string, insightId?: string) => void
}) {
  const pillRef = useRef<HTMLSpanElement>(null)

  const getCategoryStyle = () => {
    switch (category) {
      case 'definition':
        return 'bg-[#EEF0F3] text-slate-700 hover:bg-[#E0E3E8]'
      case 'amount':
        return 'bg-[#E8F5E9] text-green-700 hover:bg-green-100'
      case 'date':
        return 'bg-[#E3F2FD] text-blue-700 hover:bg-blue-100'
      case 'duration':
        return 'bg-[#FFF3E0] text-orange-700 hover:bg-orange-100'
      case 'percentage':
        return 'bg-[#F3E5F5] text-purple-700 hover:bg-purple-100'
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPillClick && pillRef.current) {
      onPillClick(pillRef.current, definitionId, factId, insightId)
    }
  }

  const isClickable = onPillClick && (definitionId || factId || insightId)

  return (
    <span
      ref={pillRef}
      onClick={isClickable ? handleClick : undefined}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[13px] font-medium transition-colors ${getCategoryStyle()} ${isClickable ? 'cursor-pointer' : ''}`}
    >
      {children}
      {insightId && <Brain className="w-3 h-3 ml-0.5 text-blue-600" />}
    </span>
  )
}

// View state types
type ViewState =
  | { type: 'structure' }
  | { type: 'clause'; clauseId: string }
  | { type: 'intelligence'; highlightId?: string }

// Demo variant types
type DemoVariant = 'structure' | 'insights' | 'facts' | 'loops' | 'clause'

type DemoStructureProps = {
  variant?: DemoVariant
  embedded?: boolean
  allowNavigation?: boolean // Whether to show back button and allow view transitions
  initialClauseId?: string // For 'clause' variant - which clause to show
  hiddenTabs?: string[] // Tabs to hide (e.g., ['facts'] to hide facts tab)
}

// Main component
export function DemoStructure({
  variant = 'structure',
  embedded = false,
  allowNavigation = true,
  initialClauseId = 'clause-2-2',
  hiddenTabs = [],
}: DemoStructureProps = {}) {
  // Determine initial state based on variant
  const getInitialViewState = (): ViewState => {
    switch (variant) {
      case 'structure': return { type: 'structure' }
      case 'clause': return { type: 'clause', clauseId: initialClauseId }
      default: return { type: 'intelligence' }
    }
  }

  const initialViewState = getInitialViewState()
  const initialStructureTab = 'outline'
  const initialIntelligenceTab = variant === 'facts' ? 'facts' : 'insights'

  const [structureTab, setStructureTab] = useState<'outline' | 'definitions'>(initialStructureTab)
  const [intelligenceTab, setIntelligenceTab] = useState<'loops' | 'insights' | 'facts'>(variant === 'loops' ? 'loops' : initialIntelligenceTab)
  const [activeLoopId, setActiveLoopId] = useState<string | null>(null)
  const [viewState, setViewState] = useState<ViewState>(initialViewState)
  const [history, setHistory] = useState<ViewState[]>([])
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [expandedFactCategories, setExpandedFactCategories] = useState<Record<string, boolean>>({
    parties: true,
    legal: true,
    constraints: true,
    amounts: false,
    dates: false,
  })

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const intelligenceScrollRef = useRef<HTMLDivElement>(null)

  // Popover state
  const [popover, setPopover] = useState<{
    position: { top: number; left: number }
    definitionId?: string
    factId?: string
    insightId?: string
  } | null>(null)

  // Insight context popover state
  const [insightPopover, setInsightPopover] = useState<{
    position: { top: number; left: number }
    insight: Insight
  } | null>(null)

  // Helper to convert source reference to clause ID
  const getClauseIdFromSource = (source: string): string => {
    if (source === 'Preamble') return 'preamble'
    // Handle Schedule references
    if (source.toLowerCase() === 'schedule 1') return 'schedule-1'
    if (source.toLowerCase() === 'schedule 2') return 'schedule-2'
    if (source.toLowerCase().includes('schedule 1')) return 'schedule-1'
    if (source.toLowerCase().includes('schedule 2')) return 'schedule-2'
    // Handle "Clause X.X" format
    const clauseMatch = source.match(/Clause\s+(\d+)\.(\d+)/i)
    if (clauseMatch) return `clause-${clauseMatch[1]}-${clauseMatch[2]}`
    // Handle "X.X" format
    const parts = source.split('.')
    if (parts.length === 1) return `clause-${parts[0]}`
    return `clause-${parts[0]}-${parts[1]}`
  }

  // Navigation helpers
  const navigateTo = (newState: ViewState) => {
    setHistory(prev => [...prev, viewState])
    setViewState(newState)
  }

  const goBack = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1]
      setHistory(prev => prev.slice(0, -1))
      setViewState(previousState)
    }
  }

  const handleTabChange = (tab: 'outline' | 'definitions') => {
    setStructureTab(tab)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }

  const handleIntelligenceTabChange = (tab: 'loops' | 'insights' | 'facts') => {
    setIntelligenceTab(tab)
    setActiveLoopId(null)
    if (intelligenceScrollRef.current) {
      intelligenceScrollRef.current.scrollTop = 0
    }
  }

  // Reset to initial state
  const handleReset = () => {
    setViewState(initialViewState)
    setHistory([])
    setStructureTab(initialStructureTab)
    setIntelligenceTab(variant === 'loops' ? 'loops' : initialIntelligenceTab)
    setActiveLoopId(null)
    setHighlightedId(null)
    setPopover(null)
    setInsightPopover(null)
  }

  const handleClauseClick = (clauseId: string) => {
    if (!allowNavigation) return
    navigateTo({ type: 'clause', clauseId })
  }

  const handlePillClick = (
    element: HTMLElement,
    definitionId?: string,
    factId?: string,
    insightId?: string
  ) => {
    const rect = element.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (containerRect) {
      setPopover({
        position: {
          top: rect.bottom - containerRect.top + 4,
          left: Math.max(8, rect.left - containerRect.left - 40),
        },
        definitionId,
        factId,
        insightId,
      })
    }
  }

  const handleViewDefinition = (definitionId: string) => {
    navigateTo({ type: 'structure' })
    setStructureTab('definitions')
    setHighlightedId(definitionId)
    setPopover(null)
    // Scroll to definition after state update
    setTimeout(() => {
      const element = document.getElementById(`definition-${definitionId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const handleViewFact = (factId: string) => {
    navigateTo({ type: 'intelligence', highlightId: factId })
    setIntelligenceTab('facts')
    setHighlightedId(factId)
    setPopover(null)
    // Expand the category containing this fact
    const category = factCategories.find(cat => cat.items.some(item => item.id === factId))
    if (category) {
      setExpandedFactCategories(prev => ({ ...prev, [category.id]: true }))
    }
    // Wait for view transition + category expand animation
    setTimeout(() => {
      const element = document.getElementById(`fact-${factId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 350)
  }

  const handleViewInsight = (insightId: string) => {
    navigateTo({ type: 'intelligence', highlightId: insightId })
    setIntelligenceTab('insights')
    setHighlightedId(insightId)
    setPopover(null)
    // Wait for view transition animation
    setTimeout(() => {
      const element = document.getElementById(`insight-${insightId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 350)
  }

  const handleCheckText = (clauseId: string) => {
    navigateTo({ type: 'clause', clauseId })
  }

  // Clear highlight after animation
  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [highlightedId])

  // Build popover actions
  const getPopoverActions = () => {
    if (!popover) return []
    const actions: { type: string; label: string; icon: React.ReactNode; onClick: () => void }[] = []

    if (popover.definitionId) {
      actions.push({
        type: 'definition',
        label: 'View definition',
        icon: <BookOpen className="w-4 h-4 text-blue-600" />,
        onClick: () => handleViewDefinition(popover.definitionId!),
      })
    }
    if (popover.factId) {
      actions.push({
        type: 'fact',
        label: 'View fact',
        icon: <BarChart3 className="w-4 h-4 text-green-600" />,
        onClick: () => handleViewFact(popover.factId!),
      })
    }
    if (popover.insightId) {
      actions.push({
        type: 'insight',
        label: 'View insight',
        icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
        onClick: () => handleViewInsight(popover.insightId!),
      })
    }
    return actions
  }

  // Clause content with clickable pills
  const getClauseContent = (clauseId: string): ClauseContent => {
    const contents: Record<string, ClauseContent> = {
      'preamble': {
        id: 'preamble',
        number: '',
        title: 'Preamble',
        content: (
          <>
            <p className="mb-3">This Master Services Agreement (the "Agreement") is entered into as of <OntologyPill category="date" factId="date-effective" onPillClick={handlePillClick}>1 March 2025</OntologyPill> (the "Effective Date") by and between:</p>
            <p className="mb-3"><strong><OntologyPill category="definition" factId="fact-party-service-provider" onPillClick={handlePillClick}>Nexora Technologies Ltd.</OntologyPill></strong>, a company incorporated in France, with registered office at 45 Avenue des Champs-Élysées, 75008 Paris ("Service Provider"); and</p>
            <p className="mb-3"><strong><OntologyPill category="definition" factId="fact-party-client" onPillClick={handlePillClick}>Altavia Retail Group SA</OntologyPill></strong>, a company incorporated in France, with registered office at 12 Rue de la Paix, 75002 Paris ("Client").</p>
            <p>Together referred to as the "Parties" and individually as a "Party".</p>
          </>
        ),
      },
      'clause-1-1': {
        id: 'clause-1-1',
        number: '1.1',
        title: 'Interpretation',
        content: (
          <>
            <p className="mb-3">In this Agreement, unless the context otherwise requires:</p>
            <ul className="space-y-1 ml-4 list-disc mb-3">
              <li>references to "Clauses" and "Schedules" are to clauses and schedules of this Agreement;</li>
              <li>words importing the singular include the plural and vice versa;</li>
              <li>headings are for convenience only and shall not affect interpretation.</li>
            </ul>
            <p>Defined terms used throughout are detailed in Schedule 1 and Clause 1.2.</p>
          </>
        ),
      },
      'clause-1-2': {
        id: 'clause-1-2',
        number: '1.2',
        title: 'Key Definitions',
        content: (
          <div className="space-y-2">
            <p>"<strong><OntologyPill category="definition" definitionId="def-1" onPillClick={handlePillClick}>Service Hours</OntologyPill></strong>" means 08:00 – 18:00 CET on <OntologyPill category="definition" definitionId="def-2" onPillClick={handlePillClick}>Business Days</OntologyPill>.</p>
            <p>"<strong><OntologyPill category="definition" definitionId="def-2" onPillClick={handlePillClick}>Business Days</OntologyPill></strong>" means any day other than a Saturday, Sunday, or public holiday in France.</p>
            <p>"<strong><OntologyPill category="definition" definitionId="def-3" onPillClick={handlePillClick}>Availability Target</OntologyPill></strong>" means the monthly percentage of uptime measured per Schedule 1.</p>
            <p>"<strong><OntologyPill category="definition" definitionId="def-4" onPillClick={handlePillClick}>Service Credits</OntologyPill></strong>" means credits owed to the Client when Service Levels are not met as detailed in Schedule 2.</p>
            <p>"<strong><OntologyPill category="definition" definitionId="def-7" onPillClick={handlePillClick}>Effective Date</OntologyPill></strong>" means 1 March 2025.</p>
          </div>
        ),
      },
      'clause-2-1': {
        id: 'clause-2-1',
        number: '2.1',
        title: 'Scope of Services',
        content: (
          <p>The <OntologyPill category="definition" definitionId="def-service-provider" onPillClick={handlePillClick}>Service Provider</OntologyPill> shall host, operate, and maintain the <OntologyPill category="definition" definitionId="def-client" onPillClick={handlePillClick}>Client</OntologyPill>'s retail analytics platform described in Schedule 1, ensuring continuous availability, performance, and data security.</p>
        ),
      },
      'clause-2-2': {
        id: 'clause-2-2',
        number: '2.2',
        title: 'Service Levels',
        content: (
          <>
            <p className="mb-3">The Provider shall maintain system availability of at least <OntologyPill category="percentage" factId="constraint-availability" insightId="sug-3" onPillClick={handlePillClick}>99.9%</OntologyPill>, during <OntologyPill category="definition" definitionId="def-1" onPillClick={handlePillClick}>Service Hours</OntologyPill> on a monthly basis. Response time for Priority 1 incidents shall not exceed <OntologyPill category="duration" factId="constraint-response-p1" insightId="sug-1" onPillClick={handlePillClick}>30 minutes</OntologyPill>, as stated in Schedule 2.</p>
            <p>Should the Provider fail to meet these Service Levels, <OntologyPill category="definition" definitionId="def-4" onPillClick={handlePillClick}>Service Credits</OntologyPill> shall apply in accordance with Schedule 2.</p>
          </>
        ),
      },
      'clause-3-1': {
        id: 'clause-3-1',
        number: '3.1',
        title: 'Fee Structure',
        content: (
          <p>The <OntologyPill category="definition" definitionId="def-client" onPillClick={handlePillClick}>Client</OntologyPill> shall pay the <OntologyPill category="definition" definitionId="def-service-provider" onPillClick={handlePillClick}>Service Provider</OntologyPill> an annual service fee of <OntologyPill category="amount" factId="amount-annual-fee" onPillClick={handlePillClick}>€ 240,000</OntologyPill>, as set out in Schedule 2, payable quarterly in arrears. Total fees for the initial term shall not exceed <OntologyPill category="amount" factId="amount-fee-cap" onPillClick={handlePillClick}>€ 1,200,000</OntologyPill> unless otherwise agreed in writing.</p>
        ),
      },
      'clause-3-2': {
        id: 'clause-3-2',
        number: '3.2',
        title: 'Invoices and Late Payment',
        content: (
          <p>Invoices are due within <OntologyPill category="duration" factId="constraint-payment" onPillClick={handlePillClick}>thirty (30) days</OntologyPill> of receipt. Late payments shall bear interest at the European Central Bank base rate plus <OntologyPill category="percentage" factId="constraint-interest" onPillClick={handlePillClick}>5%</OntologyPill>.</p>
        ),
      },
      'clause-4-1': {
        id: 'clause-4-1',
        number: '4.1',
        title: 'Term',
        content: (
          <p>This Agreement shall commence on the <OntologyPill category="definition" definitionId="def-7" onPillClick={handlePillClick}>Effective Date</OntologyPill> and continue for an initial period of <OntologyPill category="duration" factId="duration-term" onPillClick={handlePillClick}>three (3) years</OntologyPill>, renewing automatically for successive <OntologyPill category="duration" factId="duration-renewal" onPillClick={handlePillClick}>one-year terms</OntologyPill> unless terminated by either party with <OntologyPill category="duration" factId="duration-termination" onPillClick={handlePillClick}>ninety (90) days</OntologyPill> written notice prior to the end of the then-current term.</p>
        ),
      },
      'clause-4-2': {
        id: 'clause-4-2',
        number: '4.2',
        title: 'Termination for Cause',
        content: (
          <p>Either party may terminate this Agreement immediately upon written notice if the other party materially breaches this Agreement and fails to remedy such breach within <OntologyPill category="duration" factId="duration-cure" onPillClick={handlePillClick}>thirty (30) days</OntologyPill> of notice, or becomes insolvent or enters liquidation.</p>
        ),
      },
      'clause-5-1': {
        id: 'clause-5-1',
        number: '5.1',
        title: 'Confidential Information',
        content: (
          <p>Each party shall treat all <OntologyPill category="definition" definitionId="def-5" onPillClick={handlePillClick}>Confidential Information</OntologyPill> received from the other as strictly confidential and shall not disclose it to any third party except to employees or contractors bound by equivalent obligations.</p>
        ),
      },
      'clause-5-2': {
        id: 'clause-5-2',
        number: '5.2',
        title: 'Data Protection',
        content: (
          <p>Each party shall comply with GDPR (EU 2016/679). The <OntologyPill category="definition" definitionId="def-service-provider" onPillClick={handlePillClick}>Service Provider</OntologyPill> acts as Processor with respect to the <OntologyPill category="definition" definitionId="def-client" onPillClick={handlePillClick}>Client</OntologyPill>'s <OntologyPill category="definition" definitionId="def-6" onPillClick={handlePillClick}>Personal Data</OntologyPill> and shall process such data only on documented instructions.</p>
        ),
      },
      'clause-6-1': {
        id: 'clause-6-1',
        number: '6.1',
        title: 'Limitation of Liability',
        content: (
          <p>The aggregate liability of either party under this Agreement shall not exceed <OntologyPill category="amount" factId="constraint-liability" onPillClick={handlePillClick}>€ 1,000,000</OntologyPill> in any twelve (12) month period.</p>
        ),
      },
      'clause-6-2': {
        id: 'clause-6-2',
        number: '6.2',
        title: 'Indemnity',
        content: (
          <p>Each party shall indemnify the other against all losses arising from any breach of this Agreement or negligent acts, subject to the limitations in Clause 6.1.</p>
        ),
      },
      'clause-7': {
        id: 'clause-7',
        number: '7',
        title: 'Insurance',
        content: (
          <p>The <OntologyPill category="definition" definitionId="def-service-provider" onPillClick={handlePillClick}>Service Provider</OntologyPill> shall maintain professional indemnity insurance of at least <OntologyPill category="amount" factId="amount-insurance" onPillClick={handlePillClick}>€ 2,000,000</OntologyPill> per claim throughout the term of this Agreement.</p>
        ),
      },
      'clause-8-1': {
        id: 'clause-8-1',
        number: '8.1',
        title: 'Notices',
        content: (
          <p>All notices under this Agreement shall be in writing and delivered by hand, registered post, or email to the addresses specified in Schedule 3.</p>
        ),
      },
      'clause-8-2': {
        id: 'clause-8-2',
        number: '8.2',
        title: 'Governing Law',
        content: (
          <p>This Agreement shall be governed by and construed in accordance with the laws of <OntologyPill category="definition" factId="fact-legal-governing-law" onPillClick={handlePillClick}>France</OntologyPill>. Any disputes shall be submitted to the exclusive jurisdiction of the <OntologyPill category="definition" factId="fact-legal-jurisdiction" onPillClick={handlePillClick}>Paris Commercial Court</OntologyPill>.</p>
        ),
      },
      'schedule-1': {
        id: 'schedule-1',
        number: 'Schedule 1',
        title: 'Service Description',
        content: (
          <>
            <p className="mb-3"><strong>1. Platform Overview</strong></p>
            <p className="mb-3">The <OntologyPill category="definition" definitionId="def-service-provider" onPillClick={handlePillClick}>Service Provider</OntologyPill> shall provide, host, and maintain a cloud-based retail analytics platform comprising:</p>
            <ul className="list-disc ml-5 mb-3 space-y-1">
              <li>Real-time sales dashboard and reporting</li>
              <li>Inventory management integration</li>
              <li>Customer behavior analytics</li>
              <li>Predictive demand forecasting</li>
            </ul>
            <p className="mb-3"><strong>2. Availability Measurement</strong></p>
            <p className="mb-3">The <OntologyPill category="definition" definitionId="def-3" onPillClick={handlePillClick}>Availability Target</OntologyPill> shall be calculated as: (Total Minutes in Month - Downtime Minutes) / Total Minutes in Month × 100.</p>
            <p>Scheduled maintenance windows (notified 48 hours in advance) are excluded from downtime calculations.</p>
          </>
        ),
      },
      'schedule-2': {
        id: 'schedule-2',
        number: 'Schedule 2',
        title: 'Fees & Service Credits',
        content: (
          <>
            <p className="mb-3"><strong>1. Fee Structure</strong></p>
            <p className="mb-3">Annual platform fee: <OntologyPill category="amount" factId="amount-annual-fee" onPillClick={handlePillClick}>€ 240,000</OntologyPill>, payable quarterly in arrears.</p>
            <p className="mb-3"><strong>2. Service Level Targets</strong></p>
            <ul className="list-disc ml-5 mb-3 space-y-1">
              <li>System Availability: <OntologyPill category="percentage" factId="constraint-availability" insightId="sug-3" onPillClick={handlePillClick}>≥ 99.9%</OntologyPill> monthly</li>
              <li>P1 Response Time: <OntologyPill category="duration" factId="duration-schedule2-p1" onPillClick={handlePillClick}>≤ 20 minutes</OntologyPill></li>
              <li>P2 Response Time: <OntologyPill category="duration" factId="duration-schedule2-p2" onPillClick={handlePillClick}>≤ 2 hours</OntologyPill></li>
            </ul>
            <p className="mb-3"><strong>3. Service Credits</strong></p>
            <ul className="list-disc ml-5 mb-3 space-y-1">
              <li><OntologyPill category="amount" factId="amount-credit-availability" onPillClick={handlePillClick}>Credit 2% per 0.1% drop</OntologyPill> below availability target</li>
              <li><OntologyPill category="amount" factId="amount-credit-p1" onPillClick={handlePillClick}>Credit 1% per P1 incident</OntologyPill> exceeding response threshold</li>
              <li><OntologyPill category="amount" factId="amount-credit-p2" onPillClick={handlePillClick}>Credit 0.5% per P2 incident</OntologyPill> exceeding response threshold</li>
            </ul>
            <p>Maximum monthly credit: 15% of monthly fees. Credits applied to next invoice.</p>
          </>
        ),
      },
    }

    if (contents[clauseId]) return contents[clauseId]

    let clause: ClauseNode | undefined
    for (const node of outline) {
      if (node.id === clauseId) { clause = node; break }
      if (node.children) {
        const child = node.children.find(c => c.id === clauseId)
        if (child) { clause = child; break }
      }
    }

    return {
      id: clauseId,
      number: clause?.number || '',
      title: clause?.title || 'Unknown Clause',
      content: <p className="text-slate-500 italic">Clause content would be displayed here...</p>,
    }
  }

  // ClauseTreeItem component
  function ClauseTreeItem({ node, level = 0 }: { node: ClauseNode; level?: number }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const hasChildren = node.children && node.children.length > 0

    const handleClick = () => {
      if (hasChildren) setIsExpanded(!isExpanded)
      else handleClauseClick(node.id)
    }

    return (
      <div>
        <div
          onClick={handleClick}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-slate-700 hover:bg-slate-50"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren && (
            <div className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </div>
          )}
          {!hasChildren && <div className="w-4" />}
          <span className={`text-sm flex-1 truncate ${level === 0 ? 'font-semibold' : 'font-normal'}`}>
            <span className="text-slate-500 mr-2">{node.number}</span>{node.title}
          </span>
          {!hasChildren && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
        </div>
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
              {node.children?.map(child => <ClauseTreeItem key={child.id} node={child} level={level + 1} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Render views
  const renderContent = () => {
    switch (viewState.type) {
      case 'structure':
        return (
          <motion.div key="structure" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">
            <div className="border-b border-slate-200 px-4 py-3 bg-white flex items-center gap-2">
              {allowNavigation && history.length > 0 && (
                <button onClick={goBack} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                </button>
              )}
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-800">Structure</span>
              <button onClick={handleReset} className="ml-auto flex items-center gap-1 px-1.5 py-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded hover:bg-slate-100" title="Reset">
                <RotateCcw className="w-3 h-3" />
                <span className="text-[10px] font-medium">Reset</span>
              </button>
            </div>
            <div className="border-b border-slate-200 flex bg-white">
              <button onClick={() => handleTabChange('outline')} className={`flex-1 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${structureTab === 'outline' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Outline</button>
              <button onClick={() => handleTabChange('definitions')} className={`flex-1 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${structureTab === 'definitions' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Definitions</button>
            </div>
            <div ref={scrollContainerRef} className="flex-1 p-3 overflow-y-auto bg-white [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {structureTab === 'outline' && (
                <div className="space-y-0.5">{outline.map(node => <ClauseTreeItem key={node.id} node={node} />)}</div>
              )}
              {structureTab === 'definitions' && (
                <div className="space-y-2">
                  {definitions.map(def => (
                    <div
                      key={def.id}
                      id={`definition-${def.id}`}
                      className={`bg-white rounded-lg border shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-3 transition-all duration-500 ${highlightedId === def.id ? 'border-blue-400 ring-2 ring-blue-200' : 'border-slate-200'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-slate-900">{def.term}</span>
                          <p className="text-sm text-slate-600 leading-relaxed mt-1">{def.definition}</p>
                        </div>
                        {def.usedIn && (
                          <button onClick={() => handleCheckText(def.usedIn!)} className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors" title="View in document">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )

      case 'clause':
        const clause = getClauseContent(viewState.clauseId)
        return (
          <motion.div key="clause" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">
            <div className="border-b border-slate-200 px-4 py-3 bg-white flex items-center gap-3">
              {allowNavigation && history.length > 0 && (
                <button onClick={goBack} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                </button>
              )}
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-800">Legal Document</span>
              <button onClick={handleReset} className="ml-auto flex items-center gap-1 px-1.5 py-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded hover:bg-slate-100" title="Reset">
                <RotateCcw className="w-3 h-3" />
                <span className="text-[10px] font-medium">Reset</span>
              </button>
            </div>
            <div className="border-b border-slate-200 px-4 py-2 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">{clause.number}</span>
              <span className="text-sm font-semibold text-slate-800 ml-2">{clause.title}</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              <div className="text-sm leading-relaxed text-slate-700">{clause.content}</div>
            </div>
          </motion.div>
        )

      case 'intelligence':
        return (
          <motion.div key="intelligence" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">
            <div className="border-b border-slate-200 px-4 py-3 bg-white flex items-center gap-3">
              {allowNavigation && history.length > 0 && (
                <button onClick={goBack} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                </button>
              )}
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-slate-800">Intelligence</span>
              <button onClick={handleReset} className="ml-auto flex items-center gap-1 px-1.5 py-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded hover:bg-slate-100" title="Reset">
                <RotateCcw className="w-3 h-3" />
                <span className="text-[10px] font-medium">Reset</span>
              </button>
            </div>
            <div className="border-b border-slate-200 flex bg-white">
              {!hiddenTabs.includes('loops') && (
                <button onClick={() => handleIntelligenceTabChange('loops')} className={`flex-1 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${intelligenceTab === 'loops' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Loops</button>
              )}
              {!hiddenTabs.includes('insights') && (
                <button onClick={() => handleIntelligenceTabChange('insights')} className={`flex-1 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${intelligenceTab === 'insights' ? 'border-purple-600 text-purple-600 bg-purple-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Insights</button>
              )}
              {!hiddenTabs.includes('facts') && (
                <button onClick={() => handleIntelligenceTabChange('facts')} className={`flex-1 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${intelligenceTab === 'facts' ? 'border-purple-600 text-purple-600 bg-purple-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Facts</button>
              )}
            </div>
            <div ref={intelligenceScrollRef} className="flex-1 overflow-y-auto bg-white [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {intelligenceTab === 'loops' && (
                <div className="h-full flex flex-col">
                  {!activeLoopId ? (
                    // Loop list view
                    <div className="p-3 space-y-2">
                      {loops.map(loop => (
                        <button
                          key={loop.id}
                          onClick={() => setActiveLoopId(loop.id)}
                          className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-900 truncate">{loop.title}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-500">{loop.messageCount} messages</span>
                                <span className="text-[10px] text-slate-400">·</span>
                                <span className="text-[10px] text-slate-500">{loop.updatedAt}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    // Loop conversation view
                    <div className="h-full flex flex-col">
                      <div className="px-3 py-2 border-b border-slate-200 flex items-center gap-2">
                        <button onClick={() => setActiveLoopId(null)} className="p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer">
                          <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                        <span className="text-xs font-semibold text-slate-800 truncate">{loops.find(l => l.id === activeLoopId)?.title}</span>
                      </div>
                      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                        {loops.find(l => l.id === activeLoopId)?.messages.map(msg => (
                          <div key={msg.id} className={`flex gap-2 ${msg.isAI ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${msg.isAI ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {msg.isAI ? <Sparkles className="w-3 h-3" /> : msg.userName.charAt(0)}
                            </div>
                            <div className={`flex-1 ${msg.isAI ? 'text-right' : ''}`}>
                              <div className="flex items-center gap-1.5 mb-0.5" style={{ flexDirection: msg.isAI ? 'row-reverse' : 'row' }}>
                                <span className="text-[10px] font-semibold text-slate-700">{msg.userName}</span>
                                <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                              </div>
                              <div className={`text-xs text-slate-600 leading-relaxed p-2 rounded-lg ${msg.isAI ? 'bg-purple-50 text-left' : 'bg-slate-100'}`}>
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {intelligenceTab === 'insights' && (
                <div className="p-3 space-y-2">
                  {insights.map(insight => {
                    const getTypeIcon = () => {
                      switch (insight.type) {
                        case 'optimization': return <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                        case 'compliance': return <Shield className="w-3.5 h-3.5 text-red-600" />
                        case 'risk': return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        case 'consistency': return <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      }
                    }
                    return (
                      <div
                        key={insight.id}
                        id={`insight-${insight.id}`}
                        className={`rounded-lg border p-3 transition-all duration-500 shadow-sm hover:shadow-md ${highlightedId === insight.id ? 'border-blue-400 ring-2 ring-blue-200' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon()}
                            <h4 className="text-xs font-semibold text-slate-900 flex-1">{insight.title}</h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{insight.explanation}</p>
                        </div>
                        <hr className="border-slate-200 my-2" style={{ marginLeft: '-0.75rem', marginRight: '-0.75rem' }} />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button className="px-2 py-1 text-[10px] font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer">
                              <Check className="w-2.5 h-2.5" />
                              Accept
                            </button>
                            <button className="px-1.5 py-1 text-[10px] font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer">
                              Reject
                            </button>
                            <button className="px-1.5 py-1 text-[10px] font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                              Simulate
                            </button>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const rect = e.currentTarget.getBoundingClientRect()
                              const containerRect = containerRef.current?.getBoundingClientRect()
                              if (containerRect) {
                                // Position above the button, aligned to the right edge
                                const popoverHeight = insight.targetFactId ? 80 : 44
                                setInsightPopover({
                                  position: {
                                    top: rect.top - containerRect.top - popoverHeight - 8,
                                    left: rect.right - containerRect.left - 180,
                                  },
                                  insight,
                                })
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            title="View context"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {intelligenceTab === 'facts' && (
                <div className="p-3 space-y-2">
                  {factCategories.map(category => {
                    const isExpanded = expandedFactCategories[category.id] ?? true
                    const getCategoryIcon = () => {
                      switch (category.icon) {
                        case 'users': return <Users className="w-3.5 h-3.5 text-blue-600" />
                        case 'scale': return <Scale className="w-3.5 h-3.5 text-blue-600" />
                        case 'shield': return <Shield className="w-3.5 h-3.5 text-blue-600" />
                        case 'dollar': return <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                        case 'calendar': return <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      }
                    }
                    return (
                      <div key={category.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                        <button
                          onClick={() => setExpandedFactCategories(prev => ({ ...prev, [category.id]: !prev[category.id] }))}
                          className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {getCategoryIcon()}
                            <span className="text-xs font-medium text-slate-900">{category.title}</span>
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="border-t border-slate-200">
                                {category.items.map((fact, index) => (
                                  <div
                                    key={fact.id}
                                    id={`fact-${fact.id}`}
                                    className={`px-3 py-2 space-y-1.5 transition-all duration-500 ${index > 0 ? 'border-t border-slate-100' : ''} ${highlightedId === fact.id ? 'bg-blue-50' : 'bg-white'}`}
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-slate-500 font-medium">{fact.label}</span>
                                      {fact.relatedInsightId && (
                                        <button
                                          onClick={() => handleViewInsight(fact.relatedInsightId!)}
                                          className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                                          title="View related insight"
                                        >
                                          <Brain className="w-2.5 h-2.5" />
                                        </button>
                                      )}
                                    </div>
                                    <div className="text-xs font-semibold text-slate-900">{fact.value}</div>
                                    {fact.party && (
                                      <div className="flex items-center gap-1.5">
                                        {fact.party === 'Both' ? (
                                          <>
                                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">Service Provider</span>
                                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">Client</span>
                                          </>
                                        ) : (
                                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">{fact.party}</span>
                                        )}
                                      </div>
                                    )}
                                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                      <div className="flex items-center gap-1">
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                                          <Brain className="w-2.5 h-2.5" />
                                          {fact.semanticConfidence}%
                                        </span>
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                                          <Network className="w-2.5 h-2.5" />
                                          {fact.crossRefConfidence}%
                                        </span>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleClauseClick(getClauseIdFromSource(fact.source))
                                        }}
                                        className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors flex items-center gap-0.5 cursor-pointer shrink-0"
                                      >
                                        <FileText className="w-2.5 h-2.5" />
                                        {fact.source.toLowerCase().includes('schedule') || fact.source === 'Preamble' || fact.source.toLowerCase().startsWith('clause') ? fact.source : `Clause ${fact.source}`}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )
    }
  }

  const demoContent = (
    <div ref={containerRef} className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200" style={{ width: '100%', maxWidth: '420px', aspectRatio: '4 / 3' }}>
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      {popover && <PillPopover actions={getPopoverActions()} position={popover.position} onClose={() => setPopover(null)} />}
      {insightPopover && (
        <InsightContextPopover
          position={insightPopover.position}
          insight={insightPopover.insight}
          onClose={() => setInsightPopover(null)}
          onHighlightInDocument={() => {
            handleClauseClick(insightPopover.insight.clause)
            setInsightPopover(null)
          }}
          onViewRelatedFact={() => {
            if (insightPopover.insight.targetFactId) {
              handleViewFact(insightPopover.insight.targetFactId)
            }
            setInsightPopover(null)
          }}
        />
      )}
    </div>
  )

  if (embedded) {
    return demoContent
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8">
      {demoContent}
    </div>
  )
}

// Insight Context Popover Component
function InsightContextPopover({
  position,
  insight,
  onClose,
  onHighlightInDocument,
  onViewRelatedFact,
}: {
  position: { top: number; left: number }
  insight: Insight
  onClose: () => void
  onHighlightInDocument: () => void
  onViewRelatedFact: () => void
}) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 animate-in fade-in duration-150"
      style={{ top: position.top, left: position.left }}
    >
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden min-w-[180px]">
        <div className="py-1">
          <button
            onClick={onHighlightInDocument}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Highlight in document</span>
          </button>
          {insight.targetFactId && (
            <button
              onClick={onViewRelatedFact}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-green-50 transition-colors cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">View related fact</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
