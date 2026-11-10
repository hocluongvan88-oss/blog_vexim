"use client"

import { useState, useRef, type KeyboardEvent } from "react"
import { ArrowUpRight, Database, Search, ChartNoAxesCombined } from "lucide-react"
import { PROOF_VIEWS } from "@/lib/homepage-content"
import styles from "./home.module.css"

/** A truthful evidence-ready component. Populate only with approved, sourced reports. */
export function PerformanceShowcase() {
  const [active, setActive] = useState(0)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const selectWithKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index
    if (event.key === "ArrowRight") next = (index + 1) % PROOF_VIEWS.length
    else if (event.key === "ArrowLeft") next = (index - 1 + PROOF_VIEWS.length) % PROOF_VIEWS.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = PROOF_VIEWS.length - 1
    else return
    event.preventDefault(); setActive(next); tabs.current[next]?.focus()
  }
  return <div className={styles.proofConsole}>
    <div className={styles.consoleBar}><span><span className={styles.statusDot} /> EVIDENCE WORKSPACE</span><span className={styles.outlineBadge}>NO LIVE DATA CONNECTED</span></div>
    <div className={styles.proofTabs} role="tablist" aria-label="Performance evidence">
      {PROOF_VIEWS.map((item, i) => <button key={item.id} ref={el => { tabs.current[i] = el }} type="button" role="tab" id={`proof-tab-${item.id}`} aria-selected={active === i} aria-controls={`proof-panel-${item.id}`} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={event => selectWithKey(event, i)}>{item.label}</button>)}
    </div>
    {PROOF_VIEWS.map((view, i) => <div key={view.id} hidden={active !== i} className={styles.proofPanel} role="tabpanel" id={`proof-panel-${view.id}`} aria-labelledby={`proof-tab-${view.id}`} tabIndex={0}>
      <div className={styles.metricHeading}><div><p>{view.title}</p><strong>—</strong></div><ChartNoAxesCombined size={34} strokeWidth={1.2} aria-hidden="true" /></div>
      <div className={styles.evidencePlaceholder}><Search size={26} strokeWidth={1.4} aria-hidden="true" /><h3>Verified evidence comes first.</h3><p>No ranking, traffic or conversion results are published here yet. This workspace is ready for approved, dated evidence—not illustrative success metrics.</p></div>
      <div className={styles.proofFields}>{view.fields.map(field => <div key={field}><span>{field}</span><strong>Awaiting evidence</strong></div>)}</div>
      <div className={styles.proofSource}><Database size={14} aria-hidden="true" /><span>Required source: {view.source}</span></div>
      <p className={styles.proofExplanation}>{view.explanation}</p>
    </div>)}
    <div className={styles.consoleFooter}><span>Source → context → verification → publication</span><ArrowUpRight size={16} aria-hidden="true" /></div>
  </div>
}
