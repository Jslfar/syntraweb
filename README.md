# 🚀 Manual del Cliente & Guía de Administración — Syntra Supply

Bienvenido al paquete web oficial de **Syntra Supply** ("Tu taller 3D, sin interrupciones."). Esta web estática ha sido construida bajo estándares de diseño editorial premium, máxima velocidad de carga y cero dependencias complejas. **No requiere servidores Node.js, npm, ni instalaciones técnicas.**

---

## 📁 Estructura del Proyecto

```text
/
├── index.html          # Estructura principal de la e-shop y fallback crítico
├── styles.css          # Paleta de colores, gradientes aurora y estilos responsivos
├── main.js             # Lógica del carrito, filtrado de catálogo y curiosidades 3D
├── .htaccess           # Configuración de compresión, seguridad y caché para Hostinger
├── README.md           # Este manual de instrucciones para el cliente
├── lib/
│   ├── manifest.js     # ⚙️ ARCHIVO PRINCIPAL DE EDICIÓN (Abre con Bloc de Notas)
│   ├── gsap.min.js     # Librería local de animaciones GSAP
│   └── ScrollTrigger.min.js # Librería local de desplazamiento
└── assets/
    ├── img/            # Imágenes y logotipos vectoriales de productos
    └── credits.json    # Atribución y créditos de recursos
```

---

## 💻 1. Cómo Probar la Web en tu Computadora (Local)

1. Abre la carpeta del proyecto.
2. Haz **doble clic** sobre el archivo `index.html`.
3. La web se abrirá inmediatamente en tu navegador preferido (Google Chrome, Microsoft Edge, Firefox, Safari).
4. Verás la animación de entrada (Splash), la e-shop interactiva y el carrito desplegable. Funciona 100% desconectado de internet.

---

## 🌐 2. Cómo Subir la Web a Hostinger (Paso a Paso)

1. Inicia sesión en tu panel de control de **Hostinger**.
2. Ve a la sección **Sitios Web** -> **Administrador de Archivos** (File Manager).
3. Entra a la carpeta raíz pública: `public_html`.
4. Selecciona todos los archivos y carpetas de este proyecto (`index.html`, `styles.css`, `main.js`, `lib/`, `assets/`, `.htaccess`) y **arrástralos** dentro de `public_html`.
5. ¡Listo! Al entrar a tu dominio (`syntrasupply.com` o similar) tu tienda online estará en vivo inmediatamente con certificado HTTPS activo.

---

## 📝 3. Cómo Editar Textos, Precios y Productos (Bloc de Notas)

No necesitas contratar a un programador ni saber código HTML para actualizar tu tienda. Todo el contenido está centralizado en el archivo `lib/manifest.js`.

### Pasos para editar:
1. Haz **clic derecho** sobre `lib/manifest.js` y selecciona **Abrir con... -> Bloc de notas** (o TextEdit en Mac).
2. Verás bloques de texto claramente identificados:

#### A. Cambiar Teléfono y WhatsApp
Busca la sección `phoneWhatsApp` y cambia el número (usa formato internacional sin signos, ej: `584223446675`):
```javascript
"phoneWhatsApp": "584223446675",
"phoneFormatted": "+58 422-3446675",
```

#### B. Cambiar Dirección y Horario
```javascript
"address": "Calle Simón Rodríguez, Casa 435, Sector Morro II, Lechería, Anzoátegui",
"hours": "6:00 AM – 11:00 PM (Lunes a Domingo)",
```

#### C. Modificar Precios o Agregar Productos
Busca la lista `"products"` en `lib/manifest.js`. Cada producto tiene el siguiente formato:
```javascript
{
  "id": "pla_hs_kingroon",
  "category": "filaments",
  "name": "PLA High-Speed 1.75mm (1kg)",
  "brand": "Kingroon",
  "price": 18.00,  // <--- Cambia el precio aquí
  "badge": "Más Vendido",
  "image": "assets/img/kingroon_pla_hs.svg",
  "colors": ["Blanco Puro", "Negro Azabache", "Rojo"]
}
```

#### D. Editar o Agregar Curiosidades 3D (Refresco Dinámico)
Cada vez que un cliente recarga la página, la web muestra un tip técnico diferente de la lista `curiosities3D`. Puedes agregar todos los consejos que desees editando el texto en `lib/manifest.js`.

3. Guarda los cambios presionando `Ctrl + S` (o Archivo -> Guardar).

---

## 🖼️ 4. Cómo Cambiar o Sustituir Fotos de Productos

1. Coloca tu nueva foto dentro de la carpeta `assets/img/` (se recomienda formato `.jpg`, `.png` o `.svg`).
2. En `lib/manifest.js`, actualiza la propiedad `"image"` del producto correspondiente para que apunte a la nueva foto:
   `"image": "assets/img/mi_nueva_foto.jpg"`

---

## 🔄 5. ¿Qué Hacer si Cambiaste Algo y No se Ve en Internet?

Los navegadores suelen guardar copias antiguas en caché. Si haces un cambio en `manifest.js` o `styles.css` y no se refleja inmediatamente en el celular o computadora:

1. Presiona `Ctrl + F5` (o `Cmd + Shift + R` en Mac) para forzar la recarga limpia.
2. O abre `index.html` con el Bloc de Notas y modifica la versión en los enlaces del final del archivo de `?v=20260803` a `?v=20260804`. Esto obligará a todos los clientes a recibir la versión más reciente al instante.

---

### 🛡️ Soporte y Garantía
Desarrollado con arquitectura **Clean Tech** para **Syntra Group**.
*Tu taller 3D, sin interrupciones.*
