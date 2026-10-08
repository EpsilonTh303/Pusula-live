/* Browser/Node contract: cash calculation mirrors engine/cash.py; no network/storage. */
(function(root) {
  function calc(p, c, months) {
    for (const key of ['initial_cash','initial_cost','income_monthly','expense_monthly','reserve']) {
      if (typeof p[key] !== 'number' || !Number.isFinite(p[key]) || p[key] < 0) throw Error('Geçerli, negatif olmayan tutar gir.');
    }
    if (!Number.isInteger(months) || months < 1 || months > 600) throw Error('Süre 1–600 ay olmalı.');
    let relative = -p.initial_cost, minimum = relative, pending = 0;
    const balances = [p.initial_cash + relative];
    for (let m=1;m<=months;m++) {
      const lost = c.income_loss_start !== null && m >= c.income_loss_start && m < c.income_loss_start+c.income_loss_months;
      let receipt = lost ? 0 : p.income_monthly;
      if (m <= c.delay_months) { pending += receipt; receipt = 0; }
      else { receipt += pending; pending = 0; }
      let cost = p.expense_monthly*c.expense_multiplier*Math.pow(1+c.annual_inflation,(m-1)/12);
      if (m===c.shock_month) cost += p.expense_monthly*c.shock_expense_months;
      relative += receipt-cost;
      minimum = Math.min(minimum,relative);
      balances.push(p.initial_cash+relative);
    }
    const firstNegative = balances.findIndex(b=>b<0);
    return {balance:balances, minimum_initial_cash:Math.max(0,p.reserve-minimum), first_negative_month:firstNegative<0?null:firstNegative};
  }
  if (typeof module !== 'undefined') module.exports = {calc};
  else root.ImmigrationCash = {calc};
})(globalThis);
