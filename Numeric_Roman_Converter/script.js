const input = document.getElementById('number');
const btn = document.getElementById('convert-btn');
const output = document.getElementById('output');

function toRoman(num) {
  const map = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'],  [90, 'XC'],  [50, 'L'], [40, 'XL'],
    [10, 'X'],   [9, 'IX'],   [5, 'V'],  [4, 'IV'],
    [1, 'I']
  ];
  let n = num;
  let res = '';
  for (const [val, sym] of map) {
    while (n >= val) {
      res += sym;
      n -= val;
    }
  }
  return res;
}

function validateAndConvert() {
  const raw = (input.value || '').trim();

  // Empty
  if (raw.length === 0) {
    output.textContent = 'Please enter a valid number';
    return;
  }

  // Parse integer safely
  const n = Number(raw);

  // Not a number (NaN)
  if (!Number.isFinite(n)) {
    output.textContent = 'Please enter a valid number';
    return;
  }

  // Enforce integer range per FCC spec
  const intN = Math.trunc(n);

  if (intN < 1) {
    output.textContent = 'Please enter a number greater than or equal to 1';
    return;
  }

  if (intN >= 4000) {
    output.textContent = 'Please enter a number less than or equal to 3999';
    return;
  }

  output.textContent = toRoman(intN);
}

btn.addEventListener('click', validateAndConvert);

// Optional: Enter key convenience (doesn't affect tests)
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') validateAndConvert();
});
