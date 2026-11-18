export const DAY_RATE_HT = 450
export const VAT_RATE = 0.085

export const PROJECT_KINDS = ['web', 'mobile', 'plateforme'] as const
export const COMPLEXITIES = ['simple', 'standard', 'elevee'] as const

export type ProjectKind = (typeof PROJECT_KINDS)[number]
export type Complexity = (typeof COMPLEXITIES)[number]
export type Origin = 'reference' | 'tjm'
export type ProviderName = 'gemini' | 'mistral' | 'anthropic'

export type MoneyLine = {
  id: string
  label: string
  detail: string
  amountHt: number
  origin: Origin
}

export type StackChoice = {
  layer: string
  choice: string
  why: string
}

export type Estimate = {
  kind: 'mobile' | 'visio' | 'web' | 'boutique'
  formulaName: string
  lines: MoneyLine[]
  options: MoneyLine[]
  totalHt: number
  vat: number
  totalTtc: number
  maintenanceAnnualHt: number
  maintenanceBasis: string
  hosting: string
  payment: string[]
  conditions: string[]
  warnings: string[]
  stack: StackChoice[]
}

export type Narrative = {
  title: string
  context: string
  objectives: string[]
  vigilance: string[]
  functionalScope: { title: string; detail: string }[]
  technicalRequirements: string[]
  method: string[]
  security: string[]
}

export type DossierRequest = {
  brief: string
  clientName: string
  kind: ProjectKind
  complexity: Complexity
  deadline: string
}

export type DossierResponse = {
  source: 'modele' | 'grille'
  provider: ProviderName | null
  warning: string | null
  clientName: string
  deadline: string | null
  estimate: Estimate
  narrative: Narrative
  texts: {
    cahierDesCharges: string
    propositionTechnique: string
    propositionFinanciere: string
  }
}
