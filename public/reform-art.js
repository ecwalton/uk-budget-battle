const colours = ["#ff725e", "#f6bb42", "#32b6a3", "#6889ef", "#ad85dc"];
export function policyIcon(index) {
  const drawings = [
    '<path d="M34 77L100 35l66 42" fill="#fff5e7"/><path d="M43 83h114v64H43z" fill="#fff5e7"/><path d="M28 153h144v13H28z" fill="#fff5e7"/><path d="M58 91v48m28-48v48m28-48v48m28-48v48"/><path d="M93 57h14m-7-7v14"/><path d="M157 34h28m-14-14v28" stroke="#fff5e7"/>',
    '<rect x="33" y="60" width="133" height="98" rx="16" fill="#fff5e7"/><path d="M45 60V45l91-15 10 30" fill="#fff5e7"/><path d="M119 90h55v40h-55a20 20 0 0 1 0-40z" fill="#ffe39b"/><circle cx="139" cy="110" r="5" fill="#243b46" stroke="none"/><path d="M66 89v39m-10-17h26m-23 17h27m-19-39c18-13 28 3 23 7"/>',
    '<path d="M38 165V63h17v102m91 0V63h17v102" fill="#fff5e7"/><path d="M52 68l89-47 9 17-89 47z" fill="#fff5e7"/><path d="M74 139h62m-18-18 18 18-18 18" stroke="#fff5e7"/><path d="M30 174h142"/><circle cx="51" cy="67" r="10" fill="#ffe39b"/>',
    '<path d="M103 21L49 113h48l-4 67 62-100h-46l14-59z" fill="#ffe39b"/><path d="M31 50l15 10M168 44l-14 17M25 139l22-4m126-4-19-6" stroke="#fff5e7"/><circle cx="34" cy="89" r="4" fill="#fff5e7" stroke="none"/><circle cx="172" cy="87" r="4" fill="#fff5e7" stroke="none"/>',
    '<rect x="35" y="37" width="86" height="125" rx="9" fill="#fff5e7"/><circle cx="78" cy="86" r="25" fill="#e2d1f5"/><path d="M53 86h50m-25-25c-17 17-17 33 0 50m0-50c17 17 17 33 0 50m-22 20h44"/><path d="M118 129h54m-15-15 15 15-15 15" stroke="#fff5e7"/><path d="M176 69h-42m15-15-15 15 15 15" stroke="#fff5e7"/>',
  ];
  return `<svg viewBox="0 0 200 200" aria-hidden="true" class="policy-icon"><circle cx="100" cy="100" r="96" fill="${colours[index]}"/><g stroke="#243b46" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${drawings[index]}</g></svg>`;
}
export function heroArt() {
  return `<div class="hero-art" aria-label="Five connected reforms: spending, tax, rules, energy and migration"><div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div><div class="art-centre"><span>YOUR BRIEF</span><strong>Make your<br>Budget count</strong><svg viewBox="0 0 120 55" aria-hidden="true"><path d="M8 44L42 30l22 5 44-25m-25 0h25v25" fill="none" stroke="#f6bb42" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>${["SPENDING", "TAX", "RULES", "ENERGY", "MIGRATION"].map((t, i) => `<div class="art-node node-${i}">${policyIcon(i)}<span>${t}</span></div>`).join("")}<div class="art-caption">Five decisions. Your government.</div></div>`;
}
