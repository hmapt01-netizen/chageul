(function (root) {
  'use strict';
  function number(value, min = 0, max = 1e9) {
    if (value === null || value === undefined || String(value).trim() === '') throw Error('값을 입력해 주세요.');
    const n = Number(value);
    if (!Number.isFinite(n) || n < min || n > max) throw Error(`${min.toLocaleString()}~${max.toLocaleString()} 범위로 입력해 주세요.`);
    return n;
  }
  function savings(v) {
    const distance = number(v.distance, 0, 200000), iceEff = number(v.iceEff, .1, 100), evEff = number(v.evEff, .1, 30);
    const fuel = number(v.fuel, 0, 10000), slow = number(v.slow, 0, 10000), fast = number(v.fast, 0, 10000), share = number(v.share, 0, 100) / 100;
    const icePrice = number(v.icePrice, 0, 100000), evPrice = number(v.evPrice, 0, 100000), fees = number(v.fees, 0, 100000);
    const iceCost = distance / iceEff * fuel, rate = slow * share + fast * (1 - share), evCost = distance / evEff * rate;
    const annual = iceCost - evCost, investment = (evPrice + fees - icePrice) * 10000;
    return { iceCost, evCost, rate, annual, investment, fiveFuel: annual * 5, fiveNet: annual * 5 - investment,
      months: investment > 0 && annual > 0 ? investment / annual * 12 : null,
      reverseMonths: investment < 0 && annual < 0 ? -investment / -annual * 12 : null };
  }
  function chargeCost(v) {
    const cap = number(v.cap, .1, 300), start = number(v.start, 0, 100), end = number(v.end, 0, 100);
    if (end < start) throw Error('목표 잔량은 현재 잔량 이상이어야 합니다.');
    const rate = number(v.rate, 0, 10000), loss = number(v.loss, 0, 40) / 100;
    const net = cap * (end - start) / 100, billed = net / (1 - loss);
    return { net, billed, cost: billed * rate };
  }
  function chargeTime(v, net) {
    const charger = number(v.charger, .1, 1000), vehicle = number(v.vehicle, .1, 1000), average = number(v.average, .1, 1000);
    if (average > Math.min(charger, vehicle)) throw Error('평균 충전 출력은 충전기와 차량 한도 이하로 입력해 주세요.');
    return net / average * 60;
  }
  function charge(v) {
    const cost = chargeCost(v);
    return {...cost, minutes: chargeTime(v, cost.net)};
  }
  function winter(v) {
    const range = number(v.range, .1, 1500), drop = number(v.drop, 0, 80) / 100;
    const start = number(v.wstart, 0, 100), reserve = number(v.reserve, 0, 100);
    if (reserve > start) throw Error('남겨둘 잔량은 출발 잔량 이하여야 합니다.');
    const full = range * (1 - drop);
    return { full, available: full * (start - reserve) / 100, loss: range - full };
  }
  const api = { number, savings, charge, chargeCost, chargeTime, winter };
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.EVCalculator = api;
  if (typeof document === 'undefined') return;
  const money = n => Math.round(n).toLocaleString('ko-KR') + '원';
  const decimal = n => n.toLocaleString('ko-KR', { maximumFractionDigits: 1 });
  function duration(months) {
    const total = Math.ceil(months - 1e-9);
    return total < 1 ? '1개월 미만' : `${Math.floor(total / 12) ? Math.floor(total / 12) + '년 ' : ''}${total % 12 ? total % 12 + '개월' : ''}`.trim();
  }
  function boot() {
    const box = document.getElementById('ev-tool');
    if (!box) return;
    function values(form) { return Object.fromEntries(new FormData(form)); }
    function output(id, text) { document.getElementById(id).textContent = text; }
    function update(form) {
      const result = form.querySelector('.ev-result'), error = form.querySelector('.ev-error');
      error.textContent = '';
      form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
      if (form.id === 'ev-cost-form') {
        const trade = form.elements.namedItem('mode').value === 'trade';
        output('ev-ice-label', trade ? '기존 차 현재 매각 예상액 (만 원)' : '비교 신차 최종 구매가 (만 원)');
        output('ev-mode-note', trade ? '타던 차를 계속 타는 경우와 교체하는 경우의 추가 지출을 비교합니다. 실제 중고 견적을 입력하세요.' : '두 신차의 할인·보조금을 반영한 최종 견적을 같은 기준으로 입력하세요.');
      }
      try {
        for (const input of form.querySelectorAll('input[type="number"]')) {
          const optional = input.closest('details');
          if (optional && ['ev-price-options','ev-time-options'].includes(optional.id)) continue;
          if (optional && optional.id === 'ev-mix-options' && form.elements.namedItem('mixMode').value !== 'mixed') continue;
          try { number(input.value, Number(input.min), Number(input.max)); }
          catch (e) { input.setAttribute('aria-invalid', 'true'); throw Error(input.labels[0].textContent.trim() + ': ' + e.message); }
        }
        const v = values(form);
        if (form.id === 'ev-cost-form') {
          Object.assign(v, {icePrice:0,evPrice:0,fees:0});
          if (v.mixMode !== 'mixed') Object.assign(v, {fast:v.slow,share:100});
        }
        
        if (form.id === 'ev-cost-form') {
          const r = savings(v);
          const trade = v.mode === 'trade';
          output('ev-ice-label', trade ? '기존 차 현재 매각 예상액 (만 원)' : '비교 신차 최종 구매가 (만 원)');
          output('ev-mode-note', trade ? '타던 차를 계속 타는 경우와 교체하는 경우의 추가 지출을 비교합니다. 실제 중고 견적을 입력하세요.' : '두 신차의 할인·보조금을 반영한 최종 견적을 같은 기준으로 입력하세요.');
          output('ev-annual', r.annual === 0 ? '연료비 차이 없음' : `전기차가 연 ${money(Math.abs(r.annual))} ${r.annual > 0 ? '덜 듭니다' : '더 듭니다'}`);
          result.classList.toggle('ev-loss', r.annual < 0);
          output('ev-ice-cost', money(r.iceCost)); output('ev-ev-cost', money(r.evCost)); output('ev-mixed-rate', decimal(r.rate) + '원/kWh');
          output('ev-five-fuel', money(Math.abs(r.fiveFuel)) + (r.fiveFuel >= 0 ? ' 절감' : ' 추가 지출'));
          try {
          Object.assign(r, savings({...v,icePrice:values(form).icePrice,evPrice:values(form).evPrice,fees:values(form).fees}));
          output('ev-investment', money(Math.abs(r.investment)) + (r.investment >= 0 ? ' 추가 지출' : ' 초기 지출 감소'));
          output('ev-five-net', Math.round(Math.abs(r.fiveNet)) === 0 ? '두 차량의 비용이 같습니다 (원 단위 반올림)' : money(Math.abs(r.fiveNet)) + (r.fiveNet > 0 ? ' 전기차 쪽이 적음' : ' 전기차 쪽이 많음'));
          let payback;
          if (r.investment > 0) payback = r.months === null ? '현재 조건에서는 연료비로 추가 지출을 회수할 수 없습니다.' : `연료비로 추가 지출 회수: 약 ${duration(r.months)}${r.months > 600 ? ' (50년 초과·장기 단순 추산)' : ''}`;
          else if (r.investment === 0) payback = '초기 구매 차액이 없습니다. 연료비 차이만 비교하세요.';
          else payback = r.reverseMonths === null ? '초기 지출이 더 적어 회수할 추가 구매비가 없습니다.' : `초기 지출은 적지만 운행비는 더 듭니다. 약 ${duration(r.reverseMonths)} 후 초기 차액이 소진됩니다.`;
          output('ev-payback', payback);
          } catch(e) { output('ev-investment','차량 가격 입력 확인'); output('ev-five-net','—'); output('ev-payback','차량 가격을 확인해 주세요. '+e.message); }
        } else if (form.id === 'ev-charge-form') {
          const r = chargeCost(v);
          output('ev-charge-cost', '예상 충전 금액 ' + money(r.cost));
          output('ev-net', decimal(r.net) + 'kWh'); output('ev-billed', decimal(r.billed) + 'kWh');
          try {
          const mins = Math.ceil(chargeTime(v, r.net) - 1e-9);
          output('ev-time', mins === 0 ? '충전할 전력이 없습니다.' : `입력한 평균 출력 기준 약 ${Math.floor(mins / 60) ? Math.floor(mins / 60) + '시간 ' : ''}${mins % 60}분`);
          } catch(e) { output('ev-time','시간 계산: '+e.message); }
        } else {
          const r = winter(v);
          output('ev-winter-range', '설정 조건의 예상 거리 ' + decimal(r.available) + 'km');
          output('ev-full-range', decimal(r.full) + 'km');
          const gauge = document.getElementById('ev-range-gauge'); gauge.value = 100 - Number(v.drop);
          output('ev-gauge-caption', `기준 거리의 ${100 - Number(v.drop)}% · 감소율 ${v.drop}% 가정`);
        }
        const bottom = form.querySelector('.ev-bottom-result');
        bottom.textContent = document.getElementById(bottom.dataset.resultSource).textContent;
        result.hidden = false;
        form.querySelector('.ev-detail-result').hidden = false;
        form.querySelectorAll('.ev-purchase-result, #ev-time').forEach(el => el.hidden = false);
      } catch (e) { error.textContent = e.message; form.querySelector('.ev-bottom-result').textContent = e.message; result.hidden = true; form.querySelector('.ev-detail-result').hidden = true; form.querySelectorAll('.ev-purchase-result, #ev-time').forEach(el => el.hidden = true); }
    }
    for (const form of box.querySelectorAll('form')) {
      form.addEventListener('submit', event => event.preventDefault());
      form.addEventListener('input', () => update(form));
      form.addEventListener('change', event => {
        if (event.target.id === 'ev-mix-mode' && event.target.value === 'mixed') document.getElementById('ev-mix-options').open = true;
        update(form);
      });

      update(form);
    }
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    function activate(tab, focus) {
      for (const item of tabs) { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; document.getElementById(item.getAttribute('aria-controls')).hidden = !active; }
      if (focus) tab.focus();
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab, false));
      tab.addEventListener('keydown', e => { let index; if(e.key === 'ArrowRight') index=(i+1)%tabs.length; if(e.key === 'ArrowLeft') index=(i+tabs.length-1)%tabs.length; if(e.key === 'Home') index=0; if(e.key === 'End') index=tabs.length-1; if(index !== undefined){e.preventDefault();activate(tabs[index], true);} });
    });
    for (const button of box.querySelectorAll('[data-charge-preset]')) button.addEventListener('click', () => {
      const vals = button.dataset.chargePreset.split(','); const form = document.getElementById('ev-charge-form');
      ['charger','vehicle','average'].forEach((name,i)=>form.elements.namedItem(name).value=vals[i]); update(form);
    });
    for (const button of box.querySelectorAll('[data-drop]')) button.addEventListener('click', () => { const form=document.getElementById('ev-winter-form'); form.elements.namedItem('drop').value=button.dataset.drop; update(form); });
    document.getElementById('ev-reset').addEventListener('click', () => {
      const form = box.querySelector('[role="tabpanel"]:not([hidden]) form');
      form.reset(); update(form);
    });
    for (const form of box.querySelectorAll('form')) {
      const fix = form.querySelector('.ev-fix-input');
      fix.addEventListener('click', () => {
        const input = form.querySelector('[aria-invalid="true"]');
        if (!input) return;
        const detail = input.closest('details');
        if (detail) detail.open = true;
        input.focus();
      });
      const sync = () => { fix.hidden = !form.querySelector('[aria-invalid="true"]'); };
      form.addEventListener('input', sync); form.addEventListener('change', sync);
      form.addEventListener('reset', () => { fix.hidden = true; });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(typeof globalThis !== 'undefined' ? globalThis : this);
