'use client'

import { useMemo, useState } from 'react'
import { buildReceipt, totalRate, unitPhrase } from '@/lib/receipt'
import { lensLabel } from '@/lib/lenses'
import { cents, money } from '@/lib/format'
import { toast } from '@/lib/toast'
import type { PlaceBundle } from '@/lib/types'

const RENT_SHARE = 0.17

type Mode = 'own' | 'rent'

const digits = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0

const PRESETS = [
  { label: 'Starter home', value: 385000 },
  { label: 'Median', value: 548000 },
  { label: 'Larger home', value: 780000 }
]

export function ReceiptBuilder({ bundle }: { bundle: PlaceBundle }) {
  const { place } = bundle
  const [mode, setMode] = useState<Mode>('own')
  const [assessedText, setAssessedText] = useState(place.medianAssessedValue.toLocaleString('en-US'))
  const [rentText, setRentText] = useState('2,650')
  const [printed, setPrinted] = useState(0)
  const [openBody, setOpenBody] = useState<string | null>(null)

  const assessed = useMemo(() => {
    if (mode === 'own') return digits(assessedText)
    const yearlyTax = digits(rentText) * 12 * RENT_SHARE
    return (yearlyTax / totalRate(bundle)) * 100
  }, [mode, assessedText, rentText, bundle])

  const receipt = useMemo(() => buildReceipt(bundle, assessed), [bundle, assessed])

  const highlights = receipt.sections
    .flatMap((s) => s.lines)
    .filter((l) => l.units !== null && l.units >= 1)
    .sort((a, b) => b.dollars - a.dollars)
    .slice(0, 5)

  const asText = () => {
    const lines = [
      `TAXPAYER RECEIPT, ${place.name.toUpperCase()}, ${place.stateCode}`,
      `Tax year ${place.fiscalYear}`,
      `${mode === 'own' ? 'Assessed value' : 'Equivalent value'}: ${money(receipt.assessed)}`,
      ''
    ]
    for (const section of receipt.sections) {
      lines.push(`${section.body.name}: ${cents(section.dollars)}`)
      for (const l of section.lines) {
        lines.push(`  ${l.line.plainLabel}: ${cents(l.dollars)}${l.units !== null && l.units >= 0.1 ? ` (about ${unitPhrase(l.line, l.units)})` : ''}`)
      }
      lines.push('')
    }
    lines.push(`TOTAL: ${cents(receipt.total)} a year, ${cents(receipt.total / 12)} a month, ${cents(receipt.perDay)} a day`)
    lines.push('')
    lines.push('Line amounts split each government share of the bill in proportion to its adopted budget.')
    return lines.join(String.fromCharCode(10))
  }

  const download = () => {
    const blob = new Blob([asText()], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tax-receipt-${place.id}-${place.fiscalYear}.txt`
    link.click()
    URL.revokeObjectURL(url)
    toast('Receipt saved to your downloads')
  }

  const share = async () => {
    const text = `My ${place.shortName} property tax bill is ${cents(receipt.total)} a year. Here is where it goes.`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My tax receipt', text, url: window.location.href })
        return
      }
      await navigator.clipboard.writeText(`${text} ${window.location.href}`)
      toast('Link copied')
    } catch {
      toast('Could not share from this browser')
    }
  }

  let row = 0

  return (
    <div className="receipt-page">
      <form
        className="receipt-form"
        onSubmit={(e) => {
          e.preventDefault()
          setPrinted((n) => n + 1)
        }}
      >
        <fieldset className="letter__set">
          <legend className="field__label">Your home</legend>
          <div className="seg seg--full">
            <label className={`seg__opt${mode === 'own' ? ' is-on' : ''}`}>
              <input type="radio" className="sr-only" name="mode" checked={mode === 'own'} onChange={() => setMode('own')} />
              I own
            </label>
            <label className={`seg__opt${mode === 'rent' ? ' is-on' : ''}`}>
              <input type="radio" className="sr-only" name="mode" checked={mode === 'rent'} onChange={() => setMode('rent')} />
              I rent
            </label>
          </div>
        </fieldset>

        {mode === 'own' ? (
          <label className="field">
            <span className="field__label">Assessed value on my tax bill</span>
            <span className="input-money">
              <span aria-hidden="true">$</span>
              <input
                className="input input--money"
                inputMode="numeric"
                value={assessedText}
                onChange={(e) => setAssessedText(digits(e.target.value) ? digits(e.target.value).toLocaleString('en-US') : '')}
              />
            </span>
            <span className="field__help">
              Printed on your tax bill as &quot;Net Taxable Value.&quot; The {place.shortName} median is {money(place.medianAssessedValue)}.
            </span>
          </label>
        ) : (
          <label className="field">
            <span className="field__label">Monthly rent</span>
            <span className="input-money">
              <span aria-hidden="true">$</span>
              <input
                className="input input--money"
                inputMode="numeric"
                value={rentText}
                onChange={(e) => setRentText(digits(e.target.value) ? digits(e.target.value).toLocaleString('en-US') : '')}
              />
            </span>
            <span className="field__help">
              Landlords pass property tax through in rent. We estimate {Math.round(RENT_SHARE * 100)} percent of rent in New Jersey goes to it. Treat this as a rough figure.
            </span>
          </label>
        )}

        {mode === 'own' ? (
          <div className="slider">
            <label className="field__label" htmlFor="assessed-range">
              Drag to try another value
            </label>
            <input
              id="assessed-range"
              className="range"
              type="range"
              min={100000}
              max={1500000}
              step={5000}
              value={Math.min(1500000, Math.max(100000, assessed))}
              onChange={(e) => setAssessedText(Number(e.target.value).toLocaleString('en-US'))}
            />
            <div className="slider__marks" aria-hidden="true">
              <span>$100K</span>
              <span>{money(place.medianAssessedValue)} median</span>
              <span>$1.5M</span>
            </div>
            <ul className="chips">
              {PRESETS.map((p) => (
                <li key={p.label}>
                  <button
                    type="button"
                    className={`chip${assessed === p.value ? ' is-on' : ''}`}
                    aria-pressed={assessed === p.value}
                    onClick={() => setAssessedText(p.value.toLocaleString('en-US'))}
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="receipt-form__actions">
          <button type="submit" className="btn btn--primary">
            Print my receipt
          </button>
          <button type="button" className="btn btn--secondary" onClick={download}>
            Download
          </button>
          <button type="button" className="btn btn--secondary" onClick={share}>
            Share
          </button>
        </div>

        <div className="receipt-form__summary">
          <p className="panel__eyebrow">In things you can picture</p>
          <ul className="picture-list">
            {highlights.map((h) => (
              <li key={h.line.id}>
                <span className="picture-list__qty">{unitPhrase(h.line, h.units!)}</span>
                <span className="picture-list__basis">{h.line.unitRate!.basis}</span>
              </li>
            ))}
          </ul>
          <p className="panel__eyebrow">By part of your life</p>
          <ul className="share-list">
            {receipt.byLens.map((l) => (
              <li key={l.lensId}>
                <span>{lensLabel(l.lensId)}</span>
                <span className="num">{money(l.dollars)}</span>
              </li>
            ))}
          </ul>
        </div>
      </form>

      <div className="printer">
        <div className="printer__slot" aria-hidden="true" />
        <div className="receipt" key={printed} role="region" aria-label="Your tax receipt" aria-live="polite">
          <div className="receipt__paper">
            <p className="receipt__line receipt__center receipt__strong" style={{ ['--i' as string]: row++ }}>
              TAXPAYER RECEIPT
            </p>
            <p className="receipt__line receipt__center" style={{ ['--i' as string]: row++ }}>
              {place.name.toUpperCase()}, {place.stateCode}
            </p>
            <p className="receipt__line receipt__center" style={{ ['--i' as string]: row++ }}>
              TAX YEAR {place.fiscalYear}
            </p>
            <p className="receipt__rule" style={{ ['--i' as string]: row++ }} aria-hidden="true" />
            <p className="receipt__line receipt__pair" style={{ ['--i' as string]: row++ }}>
              <span>{mode === 'own' ? 'ASSESSED VALUE' : 'EQUIVALENT VALUE'}</span>
              <span>{money(receipt.assessed)}</span>
            </p>
            <p className="receipt__line receipt__pair" style={{ ['--i' as string]: row++ }}>
              <span>TOTAL RATE PER $100</span>
              <span>{totalRate(bundle).toFixed(3)}</span>
            </p>
            <p className="receipt__rule" style={{ ['--i' as string]: row++ }} aria-hidden="true" />

            {receipt.sections.map((s) => {
              const expanded = openBody === s.body.id || s.lines.length <= 4
              const visibleLines = expanded ? s.lines : s.lines.slice(0, 3)
              return (
                <div key={s.body.id} className="receipt__section">
                  <p className="receipt__line receipt__pair receipt__strong" style={{ ['--i' as string]: row++ }}>
                    <span>{s.body.shortName.toUpperCase()}</span>
                    <span>{cents(s.dollars)}</span>
                  </p>
                  {visibleLines.map((l) => (
                    <div key={l.line.id} className="receipt__line receipt__item" style={{ ['--i' as string]: row++ }}>
                      <p className="receipt__pair">
                        <span>{l.line.plainLabel}</span>
                        <span>{cents(l.dollars)}</span>
                      </p>
                      {l.units !== null && l.units >= 0.1 ? <p className="receipt__units">= {unitPhrase(l.line, l.units)}</p> : null}
                      <a
                        className="receipt__ask"
                        href={`mailto:${s.body.clerkEmail}?subject=${encodeURIComponent(`Question about ${l.line.plainLabel}`)}&body=${encodeURIComponent(`My tax bill sends about ${cents(l.dollars)} a year to "${l.line.officialLabel}". I would like to know:\n\n`)}`}
                      >
                        Ask about this
                      </a>
                    </div>
                  ))}
                  {!expanded ? (
                    <button type="button" className="receipt__more" style={{ ['--i' as string]: row++ }} onClick={() => setOpenBody(s.body.id)}>
                      + {s.lines.length - 3} more lines
                    </button>
                  ) : null}
                </div>
              )
            })}

            <p className="receipt__rule receipt__rule--double" style={{ ['--i' as string]: row++ }} aria-hidden="true" />
            <p className="receipt__line receipt__pair receipt__total" style={{ ['--i' as string]: row++ }}>
              <span>TOTAL</span>
              <span>{cents(receipt.total)}</span>
            </p>
            <p className="receipt__line receipt__pair" style={{ ['--i' as string]: row++ }}>
              <span>PER MONTH</span>
              <span>{cents(receipt.total / 12)}</span>
            </p>
            <p className="receipt__line receipt__pair" style={{ ['--i' as string]: row++ }}>
              <span>PER DAY</span>
              <span>{cents(receipt.perDay)}</span>
            </p>
          </div>
          <svg className="receipt__edge" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
            <polygon points={Array.from({ length: 25 }, (_, i) => `${i * 4},0 ${i * 4 + 2},4`).join(' ') + ' 100,0'} />
          </svg>
        </div>
        <button type="button" className="btn btn--secondary btn--small printer__print" onClick={() => window.print()}>
          Save or print
        </button>
      </div>
    </div>
  )
}
