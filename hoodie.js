document.addEventListener('DOMContentLoaded', () => {
  const hoodies = document.querySelectorAll('.hoodie-item');
  const instructions = document.getElementById('instructions');
  const previewContainer = document.getElementById('previewContainer');
  const selectedImage = document.getElementById('selectedImage');
  const hoodieName = document.getElementById('hoodieName');
  const hoodiePrice = document.getElementById('hoodiePrice');
  const addToCartBtn = document.getElementById('addToCart');

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

    const data = hoodieData[selectedHoodieId];
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value || 'S';

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if same item + size exists, then increase qty
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
    alert(`${data.name} (${selectedSize}) added to cart!`);
  });
});
