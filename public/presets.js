import { CONTROLS } from './scenario.js';
const year = (settings = {}) => CONTROLS.map(({id}) => `${id}:${settings[id] || 0}`);
// Incremental annual choices. Every omitted lever holds the previous settlement.
export const PRESETS = {
  gbtt: {
    name: 'GBTT plan',
    description: 'Smaller spending envelopes, then tax relief. £52bn recurring spending cuts and £30bn tax cuts by Budget 3: the closest discrete translation of the £50bn/£30bn targets.',
    limits: 'Welfare −£16bn, defence −£12bn and other services −£24bn. These are authored allocations, not an approved GBTT costing. Deregulation, net-zero policy and migration are not fiscal levers in this engine; no savings from them are assumed.',
    years: [year({welfare:-1,defence:-1,other:-1}),year({other:-1}),year({income:-1,vat:-1}),year(),year()],
  },
  revenue: {
    name: 'Revenue first',
    description: 'Protect cash spending envelopes. Raise the income-tax package in each of the first three Budgets: £45bn annual revenue by Budget 3.',
    limits: 'No inflation protection or service improvement is assumed. The household effects of higher taxes still count.',
    years: [year({income:1}),year({income:1}),year({income:1}),year(),year()],
  },
  investment: {
    name: 'Invest and tax',
    description: 'Grow investment once, raise income tax in all five Budgets and the business/wealth package once. Trade higher taxes for capacity.',
    limits: 'Investment maintenance arrives later; business receipts may disappoint. No automatic growth dividend funds the plan.',
    years: [year({investment:1,income:1,business:1}),year({income:1}),year({income:1}),year({income:1}),year({income:1})],
  },
};
export const presetYear = (id, index) => PRESETS[id]?.years[index]?.slice();
