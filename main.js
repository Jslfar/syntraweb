/* Syntra Supply - Global Fail-Proof Engine */
(function() {
  var STORAGE_KEY = 'syntra_catalog_state_v1';

  window.cart = [];
  window.currentCategory = 'all';
  window.catalogProducts = [];

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getConfig() {
    return window.__SYNTRA_SUPPLY__ || {};
  }

  window.openCartDrawer = function() {
    var overlay = document.getElementById('cart-drawer-overlay');
    var drawer = document.getElementById('cart-drawer');
    if (overlay) overlay.classList.add('active');
    if (drawer) drawer.classList.add('active');
  };

  window.closeCartDrawer = function() {
    var overlay = document.getElementById('cart-drawer-overlay');
    var drawer = document.getElementById('cart-drawer');
    if (overlay) overlay.classList.remove('active');
    if (drawer) drawer.classList.remove('active');
  };

  window.addToCart = function(id, name, sku) {
    var existing = window.cart.find(function(item) { return item.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      window.cart.push({ id: id, name: name, sku: sku, qty: 1 });
    }
    window.updateCartUI();
    window.openCartDrawer();
  };

  window.changeCartQty = function(index, delta) {
    if (window.cart[index]) {
      window.cart[index].qty += delta;
      if (window.cart[index].qty <= 0) window.cart.splice(index, 1);
      window.updateCartUI();
    }
  };

  window.updateCartUI = function() {
    var countEl = document.getElementById('nav-cart-count');
    var fabCountEl = document.getElementById('cart-fab-count');
    var itemsList = document.getElementById('cart-items-list');
    var checkoutBtn = document.getElementById('btn-cart-checkout');
    var config = getConfig();

    var totalQty = 0;
    window.cart.forEach(function(item) { totalQty += item.qty; });

    if (countEl) countEl.textContent = totalQty;
    if (fabCountEl) fabCountEl.textContent = totalQty;

    if (itemsList) {
      if (window.cart.length === 0) {
        itemsList.innerHTML = '<div style="text-align: center; padding: 30px; color: #888;">El carrito está vacío.</div>';
      } else {
        itemsList.innerHTML = '';
        window.cart.forEach(function(item, index) {
          var itemDiv = document.createElement('div');
          itemDiv.className = 'cart-item';
          itemDiv.innerHTML = '<div class="cart-item-info">' +
            '<h5 style="color:#fff; font-family:var(--font-title); font-size:0.95rem; font-weight:700;">' + item.name + '</h5>' +
            '<p style="color:#aaa; font-size:0.8rem;">SKU: ' + item.sku + '</p>' +
          '</div>' +
          '<div class="cart-item-qty" style="display:flex; align-items:center; gap:8px;">' +
            '<button class="qty-btn" onclick="window.changeCartQty(' + index + ', -1)">-</button>' +
            '<span style="font-weight:700; color:#00E5FF;">' + item.qty + '</span>' +
            '<button class="qty-btn" onclick="window.changeCartQty(' + index + ', 1)">+</button>' +
          '</div>';
          itemsList.appendChild(itemDiv);
        });
      }
    }

    if (checkoutBtn) {
      if (window.cart.length === 0) {
        checkoutBtn.setAttribute('href', '#');
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.pointerEvents = 'none';
      } else {
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.pointerEvents = 'auto';
        var deliverySelect = document.getElementById('cart-delivery-option');
        var deliveryText = deliverySelect ? deliverySelect.value : 'Delivery Express Lechería';
        var phoneWA = config && config.brand ? config.brand.phoneWhatsApp : '584223446675';
        var msg = '¡Hola Syntra Supply! 👋 Quisiera solicitar cotización para los siguientes ítems:\n\n🛒 LISTA DE PEDIDO:\n';
        window.cart.forEach(function(i) {
          msg += '• ' + i.qty + 'x ' + i.name + ' (SKU: ' + i.sku + ')\n';
        });
        msg += '\n🚚 Método de Entrega: ' + deliveryText + '\n📍 Ubicación: Lechería / Sector Morro II\n\n¿Tienen disponibilidad?';
        var waUrl = 'https://wa.me/' + phoneWA + '?text=' + encodeURIComponent(msg);
        checkoutBtn.setAttribute('href', waUrl);
        checkoutBtn.setAttribute('target', '_blank');
      }
    }
  };

  window.selectCategory = function(cat, btnEl) {
    window.currentCategory = cat;
    var btns = document.querySelectorAll('.tab-btn');
    btns.forEach(function(b) { b.classList.remove('active'); });
    if (btnEl) btnEl.classList.add('active');
    window.filterCatalog();
  };

  window.filterCatalog = function() {
    var searchInput = document.getElementById('search-products');
    var query = (searchInput ? searchInput.value.toLowerCase() : '').trim();
    var productCards = document.querySelectorAll('.product-card');
    var countBadge = document.getElementById('catalog-count-badge');
    var visibleCount = 0;

    productCards.forEach(function(card) {
      var cat = card.getAttribute('data-cat') || 'filaments';
      var searchStr = card.getAttribute('data-search') || '';
      var matchesCat = (window.currentCategory === 'all' || cat === window.currentCategory);
      var matchesSearch = !query || searchStr.indexOf(query) !== -1;
      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countBadge) {
      countBadge.textContent = 'Mostrando ' + visibleCount + ' de ' + productCards.length + ' ítems en inventario';
    }
  };

  window.loadRandomCuriosity = function() {
    var badgeEl = document.getElementById('curiosity-badge');
    var titleEl = document.getElementById('curiosity-title');
    var textEl = document.getElementById('curiosity-text');
    var config = getConfig();

    if (!config || !config.curiosities3D || config.curiosities3D.length === 0) return;
    var pool = config.curiosities3D;
    var randomIndex = Math.floor(Math.random() * pool.length);
    var item = pool[randomIndex];

    if (badgeEl) badgeEl.textContent = item.badge;
    if (titleEl) titleEl.textContent = item.title;
    if (textEl) textEl.innerHTML = item.text;
  };

  window.collectCatalogProducts = function() {
    var grid = document.getElementById('products-grid');
    if (!grid) return [];
    return Array.from(grid.querySelectorAll('.product-card')).map(function(card, index) {
      var title = card.querySelector('.product-title');
      var desc = card.querySelector('.product-desc');
      var brand = card.querySelector('.product-brand');
      var badge = card.querySelector('.product-badge');
      var stockTag = card.querySelector('.stock-tag');
      var image = card.querySelector('.product-img');
      var quantity = Number(card.getAttribute('data-quantity')) || 12;
      var price = Number(card.getAttribute('data-price')) || 0;
      var statusText = card.getAttribute('data-status-text') || (stockTag ? stockTag.textContent.replace(/[^A-Za-zÁÉÍÓÚáéíóú]/g, '').trim() : '');
      var inStock = card.getAttribute('data-in-stock') === 'false' ? false : (stockTag ? stockTag.textContent.indexOf('Disponible') !== -1 : true);
      return {
        id: card.getAttribute('data-id') || ('p_' + String(index + 1).padStart(3, '0')),
        title: title ? title.textContent.trim() : 'Producto sin nombre',
        description: desc ? desc.textContent.trim() : 'Descripción pendiente',
        brand: brand ? brand.textContent.trim() : 'Syntra Supply',
        sku: card.getAttribute('data-sku') || '',
        image: image ? image.getAttribute('src') : 'assets/img/spool_negro.png',
        category: card.getAttribute('data-cat') || 'filaments',
        search: card.getAttribute('data-search') || '',
        badge: badge ? badge.textContent.trim() : 'Stock Lechería',
        quantity: quantity,
        price: price,
        inStock: inStock,
        statusText: statusText || (inStock ? 'Disponible' : 'Agotado')
      };
    });
  };

  window.saveCatalogProducts = function() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(window.catalogProducts));
    } catch (err) {
      console.warn('No se pudo guardar el catálogo', err);
    }
  };

  window.loadCatalogProducts = function() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved) && saved.length) {
        window.catalogProducts = saved;
        return;
      }
    } catch (err) {
      console.warn('No se pudo restaurar el catálogo', err);
    }
    window.catalogProducts = window.collectCatalogProducts();
    window.saveCatalogProducts();
  };

  window.renderCatalogProducts = function() {
    if (!window.catalogProducts.length) window.loadCatalogProducts();
    var grid = document.getElementById('products-grid');
    if (!grid) return;

    var sortedProducts = window.catalogProducts.slice().sort(function(a, b) {
      var aBaseInStock = a.inStock !== false && Number(a.quantity) > 0;
      var bBaseInStock = b.inStock !== false && Number(b.quantity) > 0;
      var aStatus = String(a.statusText || '').trim() || (aBaseInStock ? 'Disponible' : 'Agotado');
      var bStatus = String(b.statusText || '').trim() || (bBaseInStock ? 'Disponible' : 'Agotado');
      if (aStatus === bStatus) return 0;
      return aStatus === 'Disponible' ? -1 : 1;
    });

    grid.innerHTML = sortedProducts.map(function(product) {
      var baseInStock = product.inStock !== false && Number(product.quantity) > 0;
      var statusText = String(product.statusText || '').trim() || (baseInStock ? 'Disponible' : 'Agotado');
      var inStock = statusText === 'Disponible' ? baseInStock : false;
      var stockLabel = inStock ? '🟢 Disponible' : '🔴 Agotado';
      var titleText = product.title || 'Producto sin nombre';
      var descText = product.description || 'Descripción pendiente';
      var brandText = product.brand || 'Syntra Supply';
      var skuText = product.sku || '';
      var searchText = product.search || (titleText + ' ' + skuText).toLowerCase();
      var imageSrc = product.image || 'assets/img/spool_negro.png';
      var category = product.category || 'filaments';
      var quantityValue = Number(product.quantity) > 0 ? Number(product.quantity) : 0;
      var priceValue = Number(product.price) || 0;
      var priceText = priceValue > 0 ? '$' + priceValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Precio a consultar';
      return '<div class="product-card' + (inStock ? '' : ' is-out-of-stock') + '" data-cat="' + escapeHtml(category) + '" data-search="' + escapeHtml(searchText.toLowerCase()) + '" data-sku="' + escapeHtml(skuText.toLowerCase()) + '" data-id="' + escapeHtml(product.id) + '" data-quantity="' + quantityValue + '" data-price="' + priceValue + '" data-status-text="' + escapeHtml(statusText) + '" data-in-stock="' + (inStock ? 'true' : 'false') + '">' +
        '<div class="product-img-wrapper">' +
          '<img src="' + escapeHtml(imageSrc) + '" alt="' + escapeHtml(titleText) + '" class="product-img" loading="lazy">' +
        '</div>' +
        '<div class="product-brand">' + escapeHtml(brandText) + '</div>' +
        '<h3 class="product-title">' + escapeHtml(titleText) + '</h3>' +
        '<p class="product-desc">' + escapeHtml(descText) + '</p>' +
        '<div class="product-price-bar">' +
          '<div class="price-val" style="font-size: 0.95rem; color: #00E5FF;">' + escapeHtml(priceText) + '</div>' +
          '<div class="stock-meta">' +
            '<div class="stock-tag">' + escapeHtml(stockLabel) + '</div>' +
            '<div class="stock-qty">' + escapeHtml(quantityValue + ' und') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="product-actions">' +
          '<button class="btn-card-add" onclick="window.addToCart(\'' + escapeHtml(product.id) + '\', \'' + escapeHtml(titleText) + '\', \'' + escapeHtml(skuText) + '\')">🛒 Agregar</button>' +
        '</div>' +
      '</div>';
    }).join('');
    window.filterCatalog();
    window.updateCartUI();
  };

  window.toggleAdminPanel = function() {
    var overlay = document.getElementById('admin-panel-overlay');
    if (!overlay) return;
    if (overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      return;
    }
    var user = prompt('Usuario de Administrador:');
    var pass = prompt('Contraseña:');
    if (user === 'admin' && pass === 'syntra2026') {
      overlay.classList.add('active');
      window.populateAdminEditor();
    } else {
      alert('Credenciales incorrectas.');
    }
  };

  window.populateAdminEditor = function() {
    var container = document.getElementById('admin-catalog-editor');
    if (!container) return;
    if (!window.catalogProducts.length) window.loadCatalogProducts();
    container.innerHTML = window.catalogProducts.map(function(product) {
      var inStock = product.inStock !== false && Number(product.quantity) > 0;
      var currentStatus = String(product.statusText || '').trim() || (inStock ? 'Disponible' : 'Agotado');
      return '<div style="border:1px solid var(--border-color); border-radius:10px; padding:10px; background:rgba(255,255,255,0.03); margin-bottom:10px;">' +
        '<div style="display:flex; justify-content:space-between; gap:8px; align-items:center; margin-bottom:8px;">' +
          '<strong style="color:#fff; font-size:0.9rem;">' + escapeHtml(product.title) + '</strong>' +
          '<button type="button" onclick="window.removeCatalogProduct(\'' + escapeHtml(product.id) + '\')" style="background:#ff4d4d; color:#fff; border:none; border-radius:6px; padding:4px 8px; cursor:pointer;">Eliminar</button>' +
        '</div>' +
        '<label style="display:block; font-size:0.75rem; color:#00E5FF; margin-bottom:4px;">Imagen</label>' +
        '<input type="text" value="' + escapeHtml(product.image) + '" onchange="window.updateCatalogProductField(\'' + escapeHtml(product.id) + '\', \'image\', this.value)" style="width:100%; margin-bottom:8px; padding:8px; border:1px solid var(--border-color); border-radius:6px; background:#121212; color:#fff;" />' +
        '<label style="display:block; font-size:0.75rem; color:#00E5FF; margin-bottom:4px;">Nombre</label>' +
        '<input type="text" value="' + escapeHtml(product.title) + '" onchange="window.updateCatalogProductField(\'' + escapeHtml(product.id) + '\', \'title\', this.value)" style="width:100%; margin-bottom:8px; padding:8px; border:1px solid var(--border-color); border-radius:6px; background:#121212; color:#fff;" />' +
        '<label style="display:block; font-size:0.75rem; color:#00E5FF; margin-bottom:4px;">Precio</label>' +
        '<input type="number" min="0" step="0.01" value="' + Number(product.price || 0) + '" onchange="window.updateCatalogProductField(\'' + escapeHtml(product.id) + '\', \'price\', Number(this.value))" style="width:100%; margin-bottom:8px; padding:8px; border:1px solid var(--border-color); border-radius:6px; background:#121212; color:#fff;" />' +
        '<label style="display:block; font-size:0.75rem; color:#00E5FF; margin-bottom:4px;">Cantidad disponible</label>' +
        '<input type="number" min="0" value="' + Number(product.quantity) + '" onchange="window.updateCatalogProductField(\'' + escapeHtml(product.id) + '\', \'quantity\', Number(this.value))" style="width:100%; margin-bottom:8px; padding:8px; border:1px solid var(--border-color); border-radius:6px; background:#121212; color:#fff;" />' +
        '<label style="display:block; font-size:0.75rem; color:#00E5FF; margin-bottom:4px;">Estado visible</label>' +
        '<select onchange="window.updateCatalogProductField(\'' + escapeHtml(product.id) + '\', \'statusText\', this.value)" style="width:100%; margin-bottom:8px; padding:8px; border:1px solid var(--border-color); border-radius:6px; background:#121212; color:#fff;">' +
          '<option value="Disponible" ' + (currentStatus === 'Disponible' ? 'selected' : '') + '>Disponible</option>' +
          '<option value="Agotado" ' + (currentStatus === 'Agotado' ? 'selected' : '') + '>Agotado</option>' +
        '</select>' +
      '</div>';
    }).join('');
  };

  window.updateCatalogProductField = function(id, field, value) {
    var product = window.catalogProducts.find(function(item) { return item.id === id; });
    if (!product) return;
    if (field === 'quantity') {
      product.quantity = Number(value) || 0;
    } else if (field === 'price') {
      product.price = Number(value) || 0;
    } else if (field === 'inStock') {
      product.inStock = value === true || value === 'true';
      product.statusText = product.inStock ? 'Disponible' : 'Agotado';
    } else if (field === 'statusText') {
      product.statusText = value;
      product.inStock = value === 'Disponible';
    } else {
      product[field] = value;
    }
    window.saveCatalogProducts();
    window.renderCatalogProducts();
    window.populateAdminEditor();
  };

  window.addCatalogProduct = function() {
    window.catalogProducts.unshift({
      id: 'p_' + Date.now(),
      title: 'Nuevo producto',
      description: 'Descripción del nuevo producto',
      brand: 'Syntra Supply',
      sku: 'SKU-NEW',
      image: 'assets/img/spool_negro.png',
      category: 'filaments',
      search: 'nuevo producto',
      badge: 'Stock Lechería',
      quantity: 10,
      price: 0,
      inStock: true,
      statusText: 'Disponible'
    });
    window.saveCatalogProducts();
    window.renderCatalogProducts();
    window.populateAdminEditor();
  };

  window.removeCatalogProduct = function(id) {
    window.catalogProducts = window.catalogProducts.filter(function(product) { return product.id !== id; });
    window.saveCatalogProducts();
    window.renderCatalogProducts();
    window.populateAdminEditor();
  };

  window.saveCatalogEditor = function() {
    window.saveCatalogProducts();
    window.renderCatalogProducts();
    window.populateAdminEditor();
    alert('Catálogo actualizado correctamente.');
  };

  window.saveAdminChanges = function() {
    var phoneVal = document.getElementById('admin-input-phone').value.trim();
    var addrVal = document.getElementById('admin-input-address').value.trim();
    var hoursVal = document.getElementById('admin-input-hours').value.trim();
    if (window.__SYNTRA_SUPPLY__ && window.__SYNTRA_SUPPLY__.brand) {
      window.__SYNTRA_SUPPLY__.brand.phoneWhatsApp = phoneVal;
      window.__SYNTRA_SUPPLY__.brand.address = addrVal;
      window.__SYNTRA_SUPPLY__.brand.hours = hoursVal;
    }
    var storeAddressText = document.getElementById('store-address-text');
    var storeHoursText = document.getElementById('store-hours-text');
    if (storeAddressText) storeAddressText.textContent = addrVal;
    if (storeHoursText) storeHoursText.textContent = hoursVal;
    var manifestContent = 'window.__SYNTRA_SUPPLY__ = ' + JSON.stringify(window.__SYNTRA_SUPPLY__, null, 2) + ';';
    var blob = new Blob([manifestContent], { type: 'text/javascript' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'manifest.js';
    a.click();
    alert('¡Cambios guardados! Se ha descargado tu nuevo archivo manifest.js para reemplazarlo en la carpeta lib/');
    window.toggleAdminPanel();
  };

  function initNow() {
    var splash = document.getElementById('splash-screen');
    if (splash) {
      setTimeout(function() {
        splash.style.opacity = '0';
        splash.style.pointerEvents = 'none';
        setTimeout(function() { splash.style.display = 'none'; }, 400);
      }, 600);
    }
    document.querySelectorAll('.btn-card-wa').forEach(function(btn) {
      btn.remove();
    });
    window.addEventListener('keydown', function(event) {
      if (event.ctrlKey && event.shiftKey && event.key && event.key.toLowerCase() === 'e') {
        event.preventDefault();
        window.toggleAdminPanel();
      }
    });
    window.loadCatalogProducts();
    window.renderCatalogProducts();
    window.loadRandomCuriosity();
    window.updateCartUI();
  }

  initNow();
})();
