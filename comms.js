// Hover logic for placeholders
const placeholderInputs = document.querySelectorAll('input[data-jp]');
placeholderInputs.forEach(input => {
  const original = input.placeholder;
  const jp = input.getAttribute('data-jp');

  input.addEventListener('mouseenter', () => input.placeholder = jp);
  input.addEventListener('mouseleave', () => input.placeholder = original);
});

// Optional: Hover effect for headings (English → Japanese) already handled by CSS using .hover-jp
// Make sure your CSS includes .hover-jp rules for headings/text if needed
