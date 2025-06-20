document.addEventListener('DOMContentLoaded', () => {
  const hoodies = document.querySelectorAll('.hoodie-item');
  const instructions = document.getElementById('instructions');
  const previewContainer = document.getElementById('previewContainer');
  const selectedImage = document.getElementById('selectedImage');
  const hoodieName = document.getElementById('hoodieName');
  const hoodiePrice = document.getElementById('hoodiePrice');
  const addToCartBtn = document.getElementById('addToCart');
  const notification = document.getElementById('notification');

  const hoodieData = {
    1: {
      name: 'White Champion Hoodie',
      images: ['Imagenes/hoodie1-front.png'],
      price: 59.99
    },
    2: {
      name: 'Grey Zip Hoodie',
      images: ['Imagenes/hoodie2-front.png'],
      price: 64.99
    },
    3: {
      name: 'Blue Pullover Hoodie',
      images: ['Imagenes/hoodie3-front.png'],
      price: 69.99
    }
  };

  let selectedHoodieId = null;

  hoodies.forEach(hoodie => {
    hoodie.addEventListener('click', () => {
      const id = hoodie.dataset.id;
      const data = hoodieData[id];
      if (!data) return;

      selectedHoodieId = id;

      // Hide instructions, show preview
      instructions.style.display = 'none';
      previewContainer.style.display = 'flex';

      // Reset opacity and trigger fadeInUp animation
      previewContainer.style.opacity = 0;
      void previewContainer.offsetWidth;
      previewContainer.style.animation = 'fadeInUp 0.6s ease-out forwards';

      // Fill hoodie info
      selectedImage.src = data.images[0];
      hoodieName.textContent = data.name;
      hoodiePrice.textContent = `$${data.price.toFixed(2)}`;
      addToCartBtn.disabled = false;
    });
  });

  addToCartBtn.addEventListener('click', () => {
    if (!selectedHoodieId) return;

    addToCartBtn.disabled = true;

    const data = hoodieData[selectedHoodieId];
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value || 'S';

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.name === data.name && item.size === selectedSize);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        name: data.name,
        size: selectedSize,
        qty: 1,
        price: data.price,
        image: data.images[0]
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    notification.textContent = `${data.name} (${selectedSize}) added to cart!`;
    notification.style.display = 'block';

    // Trigger fade-in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Fade out after 1.5s and re-enable button shortly after
    setTimeout(() => {
      notification.classList.remove('show');

      setTimeout(() => {
        notification.style.display = 'none';
        addToCartBtn.disabled = false;
      }, 500); // wait for fade-out transition
    }, 1500);
  });
});
