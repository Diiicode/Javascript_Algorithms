const input = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const clearBtn = document.getElementById('clear-btn');
const results = document.getElementById('results-div');

// Valid US formats (optional leading 1), balanced parens, spaces/dashes allowed
const usPhoneRegex = /^(1\s?)?(\(\d{3}\)|\d{3})([\s-])?\d{3}([\s-])?\d{4}$/;

function validate() {
  const value = (input.value || '').trim();

  if (!value) {
    alert('Please provide a phone number');
    return;
  }

  const isValid = usPhoneRegex.test(value);
  results.textContent = (isValid ? 'Valid US number: ' : 'Invalid US number: ') + value;
}

function clearResult() {
  results.textContent = '';
}

checkBtn.addEventListener('click', validate);
clearBtn.addEventListener('click', clearResult);

// Optional: Enter key to check
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') validate();
});
