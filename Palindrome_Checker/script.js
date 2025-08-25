const input = document.getElementById('text-input');
const btn = document.getElementById('check-btn');
const result = document.getElementById('result');

const clean = (str) => str.replace(/[^a-z0-9]/gi, '').toLowerCase();

btn.addEventListener('click', () => {
  const raw = input.value;
  if (!raw) {
    alert('Please input a value');
    return;
  }
  const norm = clean(raw);
  const reversed = [...norm].reverse().join('');
  const isPal = norm === reversed;

  result.textContent = isPal
    ? `${raw} is a palindrome.`
    : `${raw} is not a palindrome.`;
});
