
let price = 19.5;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];


const cashInput = document.getElementById('cash');
const changeDue = document.getElementById('change-due');
const purchaseBtn = document.getElementById('purchase-btn');


const DENOMS = [
  ["ONE HUNDRED", 10000],
  ["TWENTY", 2000],
  ["TEN", 1000],
  ["FIVE", 500],
  ["ONE", 100],
  ["QUARTER", 25],
  ["DIME", 10],
  ["NICKEL", 5],
  ["PENNY", 1],
];


function fmt(cents) {
  if (cents % 100 === 0) return String(cents / 100);
  if (cents % 10 === 0) return (cents / 100).toFixed(1);
  return (cents / 100).toFixed(2);
}

function sumCidCents(cidArr) {

  return Math.round(
    cidArr.reduce((t, [, amt]) => t + amt, 0) * 100
  );
}

function toCidCentsMap(cidArr) {

  const map = new Map();
  for (const [name, amt] of cidArr) {
    map.set(name, Math.round(amt * 100));
  }
  return map;
}

function makeChange(changeCents, drawerMap) {
  const changeLineItems = [];
  let remaining = changeCents;

  for (const [name, value] of DENOMS) {
    if (remaining <= 0) break;

    const available = drawerMap.get(name) || 0;
    if (available <= 0 || value > remaining) continue;

    const neededUnits = Math.floor(remaining / value);
    const availableUnits = Math.floor(available / value);
    const unitsToUse = Math.min(neededUnits, availableUnits);

    const usedCents = unitsToUse * value;
    if (usedCents > 0) {
      changeLineItems.push([name, usedCents]);
      remaining -= usedCents;
    }
  }

  return { remaining, changeLineItems };
}

function buildOpenLine(items) {
  return "Status: OPEN " + items.map(([name, cents]) => `${name}: $${fmt(cents)}`).join(" ");
}

function buildClosedLine(items) {
  return "Status: CLOSED " + items.map(([name, cents]) => `${name}: $${fmt(cents)}`).join(" ");
}

function handlePurchase() {
  const raw = cashInput.value;
  const cash = Number(raw);

  if (!Number.isFinite(cash)) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  const priceCents = Math.round(price * 100);
  const cashCents = Math.round(cash * 100);

  if (cashCents < priceCents) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cashCents === priceCents) {
    changeDue.textContent = "No change due - customer paid with exact cash";
    return;
  }

  const changeNeeded = cashCents - priceCents;

  const drawerTotal = sumCidCents(cid);
  const drawerMap = toCidCentsMap(cid);

  if (drawerTotal < changeNeeded) {
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  // Attempt to make change
  const { remaining, changeLineItems } = makeChange(changeNeeded, drawerMap);

  if (remaining > 0) {
    // Can't make exact change with given denominations
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  const dispensedTotal = changeLineItems.reduce((t, [, c]) => t + c, 0);

  if (dispensedTotal === drawerTotal) {
    changeDue.textContent = buildClosedLine(changeLineItems);
  } else {
    changeDue.textContent = buildOpenLine(changeLineItems);
  }
}

// Events
purchaseBtn.addEventListener('click', handlePurchase);

// Optional: Enter key convenience
cashInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handlePurchase();
});
