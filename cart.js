// Fully updated cart.js with proper stacked polaroids

document.addEventListener('DOMContentLoaded', () => {
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById('cartItems');
  const polaroidGallery = document.getElementById('polaroidGallery');
  const totalDisplay = document.getElementById('totalPrice');
  const receiptFooter = document.querySelector('.receipt-footer');
  receiptFooter.style.display = 'none';

  let total = 0;
  const itemPolaroidStacks = {};

  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  function printItem(index) {
    if (index >= cartItems.length) {
      updateTotal();
      receiptFooter.style.display = 'block';
      return;
    }

    const item = cartItems[index];
    const row = document.createElement('div');
    row.classList.add('receipt-item');
    row.dataset.index = index;

    row.innerHTML = `
      <span class="name"></span>
      <span class="qty"></span>
      <span class="price"></span>
    `;

    cartContainer.appendChild(row);

    const nameEl = row.querySelector('.name');
    const qtyEl = row.querySelector('.qty');
    const priceEl = row.querySelector('.price');

    const speed = 15;
    const numericPrice = parseFloat(item.price);
    const displayName = item.size ? `${item.name} (${item.size})` : item.name;

    const key = `${item.name}_${item.size}`;
    if (!itemPolaroidStacks[key]) {
      const stack = document.createElement('div');
      stack.classList.add('polaroid-stack');
      stack.dataset.key = key;
      polaroidGallery.appendChild(stack);
      itemPolaroidStacks[key] = stack;
    }

    const stack = itemPolaroidStacks[key];

    for (let i = 0; i < item.qty; i++) {
      const polaroid = createPolaroid(item, displayName, index, stack.children.length);
      stack.appendChild(polaroid);
    }

    typeWriter(nameEl, displayName, speed, () => {
      typeWriter(qtyEl, `x${item.qty}`, speed, () => {
        typeWriter(priceEl, `$${(item.qty * numericPrice).toFixed(2)}`, speed, () => {
          total += item.qty * numericPrice;
          setTimeout(() => printItem(index + 1), 100);
        });
      });
    });
  }

  function createPolaroid(item, displayName, index, position) {
    const polaroid = document.createElement('div');
    polaroid.classList.add('polaroid');
    polaroid.dataset.index = index;

    const offset = position * 10;
    const rotation = Math.floor(Math.random() * 6 - 3);
    polaroid.style.transform = `translateY(${offset}px) rotate(${rotation}deg)`;

    polaroid.innerHTML = `
      <div class="pin" title="Remove"></div>
      <img src="${item.image}" alt="${displayName}" />
      <div class="caption">${displayName}</div>
    `;

    polaroid.querySelector('img').addEventListener('click', () => {
      showExpandedPolaroid(item.image, displayName);
    });

    polaroid.querySelector('.pin').addEventListener('click', () => {
      polaroid.classList.add('fall-off');
      setTimeout(() => removeItem(index, polaroid.parentElement, polaroid), 800);
    });

    return polaroid;
  }

  function typeWriter(element, text, speed, callback) {
    let i = 0;
    element.textContent = '';
    function typing() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typing, speed);
      } else if (callback) {
        callback();
      }
    }
    typing();
  }

  function showExpandedPolaroid(imageSrc, captionText) {
    const overlay = document.createElement('div');
    overlay.className = 'polaroid-overlay';

    const expanded = document.createElement('div');
    expanded.className = 'polaroid-expanded';
    expanded.innerHTML = `
      <img src="${imageSrc}" alt="${captionText}" />
      <div class="caption">${captionText}</div>
    `;

    overlay.appendChild(expanded);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  function removeItem(indexToRemove, stack, polaroidElement) {
    cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cartItems[indexToRemove];
    const row = document.querySelector(`.receipt-item[data-index="${indexToRemove}"]`);
    const qtyEl = row?.querySelector('.qty');
    const priceEl = row?.querySelector('.price');

    if (item.qty > 1) {
      item.qty -= 1;
      localStorage.setItem('cart', JSON.stringify(cartItems));
      polaroidElement.remove();

      if (qtyEl && priceEl) {
        typeWriter(qtyEl, `x${item.qty}`, 15);
        const updatedTotal = (item.qty * item.price).toFixed(2);
        typeWriter(priceEl, `$${updatedTotal}`, 15);
        updateTotal();
      }
    } else {
      cartItems.splice(indexToRemove, 1);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      window.location.reload();
    }
  }

  function updateTotal() {
    let sum = 0;
    cartItems.forEach(i => sum += i.price * i.qty);
    totalDisplay.textContent = `$${sum.toFixed(2)}`;
  }

  printItem(0);
});
