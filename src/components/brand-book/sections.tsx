import {
  Download,
  FileText,
  LayoutGrid,
  Palette,
  PenLine,
  ShieldCheck,
  Sparkles,
  Type,
} from 'lucide-react'
import Image from 'next/image'
import { formatCmyk, formatHsl, formatRgb, hexToRgb, rgbToCmyk, rgbToHsl, shades } from '@/lib/color/color'
import { contrastRatio, formatRatio, suggestForeground } from '@/lib/color/contrast'
import { activeSections, sectionTitle, type SectionId } from '@/lib/brand/catalog'
import { complianceChecks, contrastPairs } from '@/lib/brand/compliance'
import { getLabels } from '@/lib/brand/labels'
import { renderTokensCss } from '@/lib/brand/tokens'
import type { BrandColor, ResolvedBrand } from '@/lib/brand/types'

const ROLE_LABELS: Record<BrandColor['role'], string> = {
  primary: 'Primaire',
  secondary: 'Secondaire',
  accent: 'Accent',
  background: 'Fond',
  surface: 'Surface',
  text: 'Texte',
  textSecondary: 'Texte secondaire',
  border: 'Bordure',
  success: 'Succès',
  error: 'Erreur',
  warning: 'Avertissement',
  custom: 'Personnalisé',
}

const ICONS = [
  ['sparkles', Sparkles],
  ['file', FileText],
  ['pen', PenLine],
  ['grid', LayoutGrid],
  ['type', Type],
  ['palette', Palette],
  ['shield', ShieldCheck],
  ['download', Download],
] as const

function colorLine(color: BrandColor) {
  const rgb = hexToRgb(color.hex)
  return {
    rgb: formatRgb(rgb),
    hsl: formatHsl(rgbToHsl(rgb.r, rgb.g, rgb.b)),
    cmyk: formatCmyk(rgbToCmyk(rgb.r, rgb.g, rgb.b)),
  }
}

function Logo({ brand, mark = false, className = '' }: { brand: ResolvedBrand; mark?: boolean; className?: string }) {
  return (
    <Image
      src={mark ? brand.logoMarkSrc : brand.logoSrc}
      alt=""
      width={mark ? brand.markWidth : brand.logoWidth}
      height={mark ? brand.markHeight : brand.logoHeight}
      className={className}
    />
  )
}

export function renderSection(id: SectionId, brand: ResolvedBrand) {
  switch (id) {
    case 'cover':
      return <Cover brand={brand} />
    case 'toc':
      return <Toc brand={brand} />
    case 'identity':
      return <Identity brand={brand} />
    case 'logo':
      return <LogoPage brand={brand} />
    case 'clearance':
      return <Clearance brand={brand} />
    case 'misuse':
      return <Misuse brand={brand} />
    case 'palette':
      return <PalettePage brand={brand} />
    case 'gradients':
      return <Gradients brand={brand} />
    case 'accessibility':
      return <Accessibility brand={brand} />
    case 'combinations':
      return <Combinations brand={brand} />
    case 'typography':
      return <Typography brand={brand} />
    case 'typeScale':
      return <TypeScalePage brand={brand} />
    case 'grid':
      return <GridPage brand={brand} />
    case 'icons':
      return <IconsPage brand={brand} />
    case 'components':
      return <ComponentsPage brand={brand} />
    case 'documents':
      return <DocumentsPage brand={brand} />
    case 'tokens':
      return <TokensPage brand={brand} />
    case 'checklist':
      return <ChecklistPage brand={brand} />
    default: {
      const exhaustive: never = id
      return exhaustive
    }
  }
}

function Cover({ brand }: { brand: ResolvedBrand }) {
  const labels = getLabels(brand.language)
  const band = brand.template === 'minimal' ? 'var(--brand-accent)' : brand.gradients[0]?.css ?? 'var(--brand-accent)'
  return (
    <div className="cover">
      <div className="cover-band" style={{ background: band }} />
      <p className="cover-kicker">{labels.coverKicker}</p>
      <Image className="cover-logo" src={brand.logoSrc} alt={brand.logoAlt} width={brand.logoWidth} height={brand.logoHeight} />
      <h1 className="cover-title">{brand.name}</h1>
      <p className="cover-sub">{labels.coverSubtitle}</p>
      {brand.baseline ? <p className="cover-baseline">« {brand.baseline} »</p> : null}
      <dl className="cover-meta">
        <div><dt>{labels.version}</dt><dd>{brand.version}</dd></div>
        <div><dt>{labels.date}</dt><dd>{brand.dateLabel}</dd></div>
        <div><dt>{labels.sector}</dt><dd>{brand.sector}</dd></div>
      </dl>
    </div>
  )
}

function Toc({ brand }: { brand: ResolvedBrand }) {
  const pages = activeSections(brand.enabledSections)
  return (
    <ol className="toc-list">
      {pages.filter((page) => page.toc).map((page) => {
        const number = pages.findIndex((item) => item.id === page.id) + 1
        return (
          <li key={page.id}>
            <a href={`#section-${page.id}`}>
              <span>{sectionTitle(page.id, brand.language)}</span>
              <span>{number}</span>
            </a>
          </li>
        )
      })}
    </ol>
  )
}

function Identity({ brand }: { brand: ResolvedBrand }) {
  return (
    <>
      <p className="lead">{brand.copy.identity}</p>
      <p className="lead">{brand.description}</p>
      <div className="grid-4">
        {brand.values.map((value) => (
          <article className="card" key={value}>
            <h3>{value}</h3>
          </article>
        ))}
      </div>
      <ol className="rules" style={{ marginTop: '4mm' }}>
        {brand.copy.principles.map((principle) => (
          <li key={principle}>{principle}</li>
        ))}
      </ol>
    </>
  )
}

function LogoPage({ brand }: { brand: ResolvedBrand }) {
  return (
    <>
      <p className="lead">{brand.copy.logo}</p>
      <div className="logo-grid">
        <figure>
          <div className="logo-frame"><Logo brand={brand} /></div>
          <figcaption className="caption">Principal — fond clair</figcaption>
        </figure>
        <figure>
          <div className="logo-frame" style={{ background: 'var(--brand-background)' }}><Logo brand={brand} /></div>
          <figcaption className="caption">Signature — fond de marque</figcaption>
        </figure>
        <figure>
          <div className="logo-frame logo-on-dark"><Logo brand={brand} className="logo-mono-light" /></div>
          <figcaption className="caption">Monochrome clair — fond sombre</figcaption>
        </figure>
        <figure>
          <div className="logo-frame"><Logo brand={brand} className="logo-mono-dark" /></div>
          <figcaption className="caption">Monochrome foncé — impression</figcaption>
        </figure>
      </div>
    </>
  )
}

function Clearance({ brand }: { brand: ResolvedBrand }) {
  const labels = getLabels(brand.language)
  return (
    <div className="grid-2">
      <figure>
        <div className="clearspace"><Logo brand={brand} /></div>
        <figcaption className="caption">{brand.clearSpaceLabel}</figcaption>
      </figure>
      <div>
        <h3 style={{ fontFamily: 'var(--brand-font-heading)', marginTop: 0 }}>{labels.minSize}</h3>
        <ul className="rules">
          <li>{labels.withBaseline} : {brand.minWidthWithBaselinePx} px de large.</li>
          <li>En dessous : masquer la baseline et ne garder que le monogramme.</li>
          <li>Ne pas déformer, incliner ni remplacer les teintes du symbole.</li>
        </ul>
        <div className="specimens" style={{ marginTop: '4mm' }}>
          <figure>
            <Image src={brand.logoSrc} alt="" width={brand.logoWidth} height={brand.logoHeight} style={{ width: `${brand.minWidthWithBaselinePx}px`, height: 'auto' }} />
            <figcaption className="caption">{brand.minWidthWithBaselinePx} px</figcaption>
          </figure>
          <figure>
            <Image src={brand.logoMarkSrc} alt="" width={brand.markWidth} height={brand.markHeight} style={{ width: '18mm', height: 'auto' }} />
            <figcaption className="caption">{labels.withoutBaseline}</figcaption>
          </figure>
        </div>
      </div>
    </div>
  )
}

function Misuse({ brand }: { brand: ResolvedBrand }) {
  const labels = getLabels(brand.language)
  const cases: { title: string; className: string; stage: string }[] = [
    { title: 'Étirer', className: 'misuse-stretch', stage: '' },
    { title: 'Pivoter', className: 'misuse-rotate', stage: '' },
    { title: 'Changer les teintes', className: 'misuse-recolor', stage: '' },
    { title: 'Ajouter des effets', className: 'misuse-effects', stage: '' },
    { title: 'Fond sans contraste', className: '', stage: 'misuse-low' },
    { title: 'Fond chargé', className: '', stage: 'misuse-busy' },
    { title: 'Taille trop petite', className: 'misuse-tiny', stage: '' },
    { title: 'Changer la typographie', className: '', stage: '' },
  ]
  return (
    <div className="misuse">
      {cases.map((item) => (
        <figure className="misuse-card" key={item.title}>
          <div className={`misuse-stage ${item.stage}`}>
            {item.title === 'Changer la typographie' ? (
              <span className="misuse-type">{brand.name}</span>
            ) : (
              <Logo brand={brand} className={item.className} />
            )}
          </div>
          <figcaption><span className="forbid">{labels.forbidden}.</span> {item.title}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function PalettePage({ brand }: { brand: ResolvedBrand }) {
  const labels = getLabels(brand.language)
  return (
    <>
      <p className="lead">{brand.copy.palette}</p>
      <table>
        <thead>
          <tr>
            <th>Aperçu</th>
            <th>Nom</th>
            <th>{labels.role}</th>
            <th>{labels.hex}</th>
            <th>{labels.rgb}</th>
            <th>{labels.cmyk}</th>
          </tr>
        </thead>
        <tbody>
          {brand.colors.map((color) => {
            const line = colorLine(color)
            return (
              <tr key={color.id}>
                <td><span className="chip" style={{ background: color.hex }} /></td>
                <td>{color.name}<div className="caption">{color.usage}</div></td>
                <td>{ROLE_LABELS[color.role]}</td>
                <td className="meta">{color.hex}</td>
                <td>{line.rgb}</td>
                <td>{line.cmyk}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="caption">{labels.indicative}</p>
    </>
  )
}

function Gradients({ brand }: { brand: ResolvedBrand }) {
  const primary = brand.colorsByRole.primary?.hex ?? '#000000'
  const accent = brand.colorsByRole.accent?.hex ?? '#CCCCCC'
  const scaleOf = (hex: string) => shades(hex)
  return (
    <>
      <div className="grid-2">
        {brand.gradients.map((gradient) => (
          <article key={gradient.name}>
            <h3 style={{ fontFamily: 'var(--brand-font-heading)', margin: '0 0 2mm' }}>{gradient.name}</h3>
            <div className="gradient-bar" style={{ background: brand.template === 'minimal' ? 'var(--brand-accent)' : gradient.css }} />
            <p className="caption">{gradient.usage}</p>
          </article>
        ))}
      </div>
      <ShadeRow name={brand.colorsByRole.primary?.name ?? 'Primaire'} scale={scaleOf(primary)} />
      <ShadeRow name={brand.colorsByRole.accent?.name ?? 'Accent'} scale={scaleOf(accent)} />
    </>
  )
}

function ShadeRow({ name, scale }: { name: string; scale: ReturnType<typeof shades> }) {
  return (
    <div>
      <p className="caption">{name} — 100 à 900</p>
      <div className="shades">
        {([100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map((step) => {
          const hex = scale[step]
          return (
            <div className="shade" key={step} style={{ background: hex, color: suggestForeground(hex) }}>
              {step}
              <br />
              {hex}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Accessibility({ brand }: { brand: ResolvedBrand }) {
  const labels = getLabels(brand.language)
  const pairs = contrastPairs(brand)
  return (
    <>
      <p className="lead">Les ratios ci-dessous visent le texte courant (AA 4,5:1, AAA 7:1). Une paire non conforme reçoit une couleur de texte de remplacement.</p>
      <table>
        <thead>
          <tr>
            <th>Texte</th>
            <th>Fond</th>
            <th>{labels.ratio}</th>
            <th>{labels.level}</th>
            <th>{labels.recommendation}</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair) => (
            <tr key={pair.id}>
              <td>{pair.foreground}<div className="meta">{pair.foregroundHex}</div></td>
              <td>{pair.background}<div className="meta">{pair.backgroundHex}</div></td>
              <td>{formatRatio(pair.ratio, brand.language)}</td>
              <td className={pair.level === 'fail' ? 'bad' : 'ok'}>{pair.level === 'fail' ? labels.fix : pair.level}</td>
              <td className="meta">{pair.level === 'fail' ? pair.suggestion : '—'}{pair.critical ? '' : ' · mesuré'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function Combinations({ brand }: { brand: ResolvedBrand }) {
  return (
    <div className="matrix">
      {contrastPairs(brand).map((pair) => {
        const ink = suggestForeground(pair.backgroundHex)
        return (
          <div className="matrix-cell" key={pair.id} style={{ background: pair.backgroundHex, color: ink, outline: pair.level === 'fail' ? '2px solid var(--brand-error)' : undefined }}>
            <strong>{pair.foreground}</strong>
            <span>sur {pair.background}</span>
            <span>{formatRatio(pair.ratio, brand.language)} · {pair.level === 'fail' ? `remplacer par ${pair.suggestion}` : pair.level}</span>
          </div>
        )
      })}
    </div>
  )
}

function Typography({ brand }: { brand: ResolvedBrand }) {
  return (
    <>
      <p className="lead">{brand.copy.typography}</p>
      <div className="grid-3">
        {brand.fonts.filter((font) => font.role !== 'fallback').map((font) => (
          <article className="card" key={font.role}>
            <h3>{font.family}</h3>
            <p className="caption">{font.role} · graisses {font.weights.join(', ')}</p>
            <p style={{ fontFamily: font.role === 'mono' ? 'var(--brand-font-mono)' : font.role === 'heading' ? 'var(--brand-font-heading)' : 'var(--brand-font-body)', fontSize: font.role === 'heading' ? '22px' : '15px', fontWeight: font.weights.at(-1) ?? 400, marginTop: '2mm' }}>
              {font.role === 'mono' ? 'Ag 01 850' : brand.name}
            </p>
            <p className="caption">{font.usage}</p>
          </article>
        ))}
      </div>
    </>
  )
}

function TypeScalePage({ brand }: { brand: ResolvedBrand }) {
  const family = (role: 'heading' | 'body' | 'mono') =>
    role === 'mono' ? 'var(--brand-font-mono)' : role === 'heading' ? 'var(--brand-font-heading)' : 'var(--brand-font-body)'
  return (
    <div>
      {brand.typeScale.map((step) => (
        <div className="scale-row" key={step.id}>
          <span className="meta">{step.label}<br />{step.sizePx} px · {step.weight}</span>
          <p style={{ margin: 0, fontFamily: family(step.fontRole), fontSize: `${Math.min(step.sizePx, 40)}px`, fontWeight: step.weight, lineHeight: step.lineHeight, letterSpacing: `${step.letterSpacingEm}em`, fontVariantNumeric: 'tabular-nums' }}>{step.sample}</p>
          <span className="meta">{step.lineHeight}</span>
        </div>
      ))}
    </div>
  )
}

function GridPage({ brand }: { brand: ResolvedBrand }) {
  return (
    <>
      <p className="lead">Conteneur {brand.grid.containerPx} px, {brand.grid.columns} colonnes, gouttière {brand.grid.gutterPx} px. Rayons {brand.grid.radiusSmPx} px et {brand.grid.radiusMdPx} px.</p>
      <div className="columns" aria-hidden="true">
        {Array.from({ length: brand.grid.columns }, (_, index) => <i key={index} />)}
      </div>
      <div className="grid-3" style={{ marginTop: '5mm' }}>
        <article className="card"><h3>Rayon {brand.grid.radiusSmPx}</h3><p className="caption">Boutons et champs.</p></article>
        <article className="card"><h3>Rayon {brand.grid.radiusMdPx}</h3><p className="caption">Cartes et modules.</p></article>
        <article className="card"><h3>Ombre de carte</h3><p className="caption">0 4 px 20 px, encre à 5 %.</p></article>
      </div>
    </>
  )
}

function IconsPage({ brand }: { brand: ResolvedBrand }) {
  const primary = brand.colorsByRole.primary?.hex ?? '#000000'
  const background = brand.colorsByRole.background?.hex ?? '#FFFFFF'
  const text = brand.colorsByRole.text?.hex ?? '#000000'
  const primaryOk = contrastRatio(primary, background) >= 3
  const iconColor = primaryOk ? primary : text
  return (
    <>
      <p className="lead">Icônes filaires, épaisseur 1,75 px. Une icône informative doit atteindre 3:1 sur son fond.</p>
      <div className="icon-row" style={{ color: iconColor }}>
        {ICONS.map(([name, Icon]) => (
          <span key={name}>
            <Icon strokeWidth={1.75} aria-hidden="true" />
          </span>
        ))}
      </div>
      <p className="caption">
        {primaryOk
          ? 'La primaire porte les icônes : le contraste non textuel est suffisant.'
          : `La primaire (${primary}) n’atteint pas 3:1 sur le fond. Les icônes utilisent le texte ${text}.`}
      </p>
    </>
  )
}

function ComponentsPage({ brand }: { brand: ResolvedBrand }) {
  const labels = getLabels(brand.language)
  const bubble = brand.colors.find((color) => color.id === 'surface-ia')?.hex
  return (
    <div className="grid-2">
      <div className="specimens">
        <div className="btn btn-primary">{labels.primaryAction}</div>
        <div className="btn btn-accent">{labels.secondaryAction}</div>
        <span className="badge">{labels.specimen}</span>
      </div>
      <label className="field">
        <span className="field-label">{labels.fieldLabel}</span>
        <span className="field-box">{brand.name}</span>
      </label>
      <article className="selected">
        <strong>{labels.selected}</strong>
        <p className="caption">Carte active, filet primaire.</p>
      </article>
      <aside className="bubble" style={bubble ? { ['--bubble' as string]: bubble } : undefined}>
        <strong>{brand.name}.</strong> Les textes de section partent du nom, du secteur et des valeurs.
      </aside>
    </div>
  )
}

function DocumentsPage({ brand }: { brand: ResolvedBrand }) {
  const labels = getLabels(brand.language)
  return (
    <div className="grid-2">
      <article className="card">
        <p className="caption">{labels.specimen}</p>
        <h3 style={{ fontFamily: 'var(--brand-font-heading)', fontSize: '28px', margin: '4mm 0' }}>{brand.name}</h3>
        <p>{brand.baseline}</p>
      </article>
      <table>
        <thead>
          <tr><th>Planche</th><th>Présence</th></tr>
        </thead>
        <tbody>
          <tr><td>Couverture</td><td>Incluse</td></tr>
          <tr><td>Palette et contrastes</td><td>Calculés</td></tr>
          <tr className="total"><td>Sections actives</td><td>{activeSections(brand.enabledSections).length}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

function TokensPage({ brand }: { brand: ResolvedBrand }) {
  return <pre className="token-block">{renderTokensCss(brand)}</pre>
}

function ChecklistPage({ brand }: { brand: ResolvedBrand }) {
  const labels = getLabels(brand.language)
  const items = complianceChecks(brand)
  return (
    <>
      {brand.watermark ? <p className="lead">{labels.watermark}</p> : null}
      <ul className="checks">
        {items.map((item) => (
          <li key={item.id}>
            <strong className={item.ok ? 'ok' : 'bad'}>{item.ok ? labels.compliant : labels.fix} — {item.label}</strong>
            <span className="caption">{item.detail}</span>
          </li>
        ))}
        {brand.warnings.map((warning) => (
          <li key={warning}>
            <strong className="bad">{labels.fix}</strong>
            <span className="caption">{warning}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
