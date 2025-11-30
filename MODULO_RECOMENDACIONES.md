# 🤖 Módulo de Recomendaciones - Documentación Técnica

Este documento explica en detalle el módulo de recomendaciones implementado en XuleriaLCorte, incluyendo su funcionamiento, algoritmos y preparación para Machine Learning avanzado.

---

## 📋 Resumen Ejecutivo

El módulo de recomendaciones es un sistema funcional que sugiere productos a los usuarios basándose en:
- **Categorías** de productos en su carrito
- **Colores** de productos en su carrito
- **Productos similares** de la misma categoría

**Estado Actual:** Sistema básico/simulado funcional (cumple requisito de evaluación)
**Preparación Futura:** Arquitectura lista para ML avanzado con TensorFlow.js

---

## 🏗️ Arquitectura del Módulo

### Componentes Principales

```
┌─────────────────────────────────────┐
│  pages/recommendations.tsx          │
│  (Interfaz de Usuario)              │
└──────────────┬──────────────────────┘
               │
               ↓ (POST Request)
┌─────────────────────────────────────┐
│  pages/api/recommendations.ts       │
│  (Lógica de Recomendación)          │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       ↓               ↓
┌─────────────┐  ┌─────────────┐
│  Supabase   │  │  Fallback   │
│  (Producción)│  │  (Mock Data)│
└─────────────┘  └─────────────┘
```

### Flujo de Datos

1. **Usuario navega a `/recommendations`**
2. **Frontend extrae datos del carrito:**
   - Categorías únicas
   - Colores únicos
   - Lista de productos
3. **Request POST a `/api/recommendations`** con:
   - Tipo de recomendación (category, color, similar)
   - Categorías del carrito
   - Colores del carrito
   - Items del carrito
4. **Backend procesa la solicitud:**
   - Consulta productos desde Supabase (o usa mock data)
   - Aplica algoritmo de filtrado según tipo
   - Retorna productos recomendados
5. **Frontend renderiza recomendaciones**

---

## 🔍 Algoritmos de Recomendación

### 1. Recomendación por Categoría

**Objetivo:** Recomendar productos de las mismas categorías que el usuario tiene en su carrito.

**Algoritmo:**
```typescript
// Extraer categorías únicas del carrito
const cartCategories = [...new Set(cart.map(item => item.category))]

// Filtrar productos que coincidan con esas categorías
recommendations = allProducts.filter(
  product => cartCategories.includes(product.category)
)
```

**Ejemplo:**
- Carrito contiene: "Polera" (categoría: POLERAS), "Jeans" (categoría: PANTALONES)
- Sistema recomienda: Todas las poleras y pantalones disponibles

**Código:**
```169:172:pages/api/recommendations.ts
if (type === 'category' && cartCategories && cartCategories.length > 0) {
  recommendations = allProducts.filter(
    (p) => p.category && cartCategories.includes(p.category)
  )
}
```

---

### 2. Recomendación por Color

**Objetivo:** Recomendar productos con los mismos colores que el usuario tiene en su carrito.

**Algoritmo:**
```typescript
// Extraer colores únicos del carrito
const cartColors = [...new Set(cart.map(item => item.color))]

// Filtrar productos que coincidan con esos colores
recommendations = allProducts.filter(
  product => cartColors.includes(product.color)
)
```

**Ejemplo:**
- Carrito contiene: Productos negros y azules
- Sistema recomienda: Todos los productos negros y azules disponibles

**Código:**
```173:176:pages/api/recommendations.ts
} else if (type === 'color' && cartColors && cartColors.length > 0) {
  recommendations = allProducts.filter(
    (p) => p.color && cartColors.includes(p.color)
  )
}
```

---

### 3. Recomendación de Productos Similares

**Objetivo:** Recomendar productos de la misma categoría pero diferentes a los que ya están en el carrito.

**Algoritmo:**
```typescript
// Extraer IDs y categorías del carrito
const cartProductIds = cartItems.map(item => item.id)
const cartCategories = cartItems.map(item => item.category)

// Filtrar productos de misma categoría pero diferentes
recommendations = allProducts.filter(
  product => 
    cartCategories.includes(product.category) &&
    !cartProductIds.includes(product.id)
)
```

**Ejemplo:**
- Carrito contiene: "Polera Básica Negra" (POLERAS)
- Sistema recomienda: Otras poleras (diferentes a la que ya tiene)

**Código:**
```177:185:pages/api/recommendations.ts
} else if (type === 'similar' && cartItems && cartItems.length > 0) {
  const cartProductIds = cartItems.map((item) => item.id)
  const cartCats = cartItems.map((item) => item.category).filter(Boolean)
  recommendations = allProducts.filter(
    (p) =>
      p.category &&
      cartCats.includes(p.category) &&
      !cartProductIds.includes(p.id)
  )
}
```

---

### 4. Recomendación por Defecto (Featured)

**Objetivo:** Si el carrito está vacío o no hay coincidencias, mostrar productos destacados.

**Algoritmo:**
```typescript
// Mostrar primeros 4 productos (o productos con featured=true)
recommendations = allProducts.slice(0, 4)
```

**Código:**
```186:188:pages/api/recommendations.ts
} else {
  recommendations = allProducts.slice(0, 4)
}
```

---

## 💻 Implementación Técnica

### Frontend (`pages/recommendations.tsx`)

**Funcionalidades:**
- Selector de tipo de recomendación (3 botones)
- Carga de datos del carrito desde Context
- Request a API de recomendaciones
- Renderizado de productos recomendados
- Manejo de estados (loading, empty, error)

**Código Clave:**
```16:124:pages/recommendations.tsx
useEffect(() => {
  const fetchRecommendations = async () => {
    // Extraer categorías y colores del carrito
    const cartCategories = Array.from(
      new Set(cart.map((item) => item.category).filter(Boolean))
    )
    const cartColors = Array.from(
      new Set(cart.map((item) => item.color).filter(Boolean))
    )

    // Request a API
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: recommendationType,
        cartCategories,
        cartColors,
        cartItems: cart,
      }),
    })
    // ... procesar respuesta
  }
  fetchRecommendations()
}, [cart, recommendationType])
```

---

### Backend (`pages/api/recommendations.ts`)

**Funcionalidades:**
- Validación de método HTTP (solo POST)
- Soporte para Supabase y fallback a mock data
- Implementación de 3 algoritmos de recomendación
- Manejo de errores

**Estructura:**
```12:195:pages/api/recommendations.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validación
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Lógica de recomendación
  // - Verificar si Supabase está configurado
  // - Cargar productos (desde Supabase o mock)
  // - Aplicar algoritmo según tipo
  // - Retornar recomendaciones
}
```

---

## 🎯 Casos de Uso

### Caso 1: Usuario con Carrito Vacío
- **Comportamiento:** Muestra productos destacados (featured)
- **Resultado:** 4 productos aleatorios o destacados

### Caso 2: Usuario con Productos en Carrito - Recomendación por Categoría
- **Input:** Carrito con "Polera" y "Jeans"
- **Algoritmo:** Filtra por categorías (POLERAS, PANTALONES)
- **Resultado:** Todas las poleras y pantalones disponibles

### Caso 3: Usuario con Productos en Carrito - Recomendación por Color
- **Input:** Carrito con productos negros y azules
- **Algoritmo:** Filtra por colores (Negro, Azul)
- **Resultado:** Todos los productos negros y azules

### Caso 4: Usuario con Productos en Carrito - Productos Similares
- **Input:** Carrito con "Polera Básica Negra"
- **Algoritmo:** Filtra por categoría (POLERAS) excluyendo el producto actual
- **Resultado:** Otras poleras diferentes

---

## 🚀 Preparación para ML Avanzado

### TensorFlow.js Incluido

**Estado:** Dependencia instalada en `package.json`
```json
"@tensorflow/tfjs": "^4.15.0"
```

**Preparación Arquitectónica:**
- Estructura de datos compatible con modelos ML
- Separación de lógica de recomendación en módulo dedicado
- API endpoint preparado para recibir datos de modelos ML

### Posibles Mejoras con ML

1. **Collaborative Filtering:**
   - Recomendar basado en comportamiento de usuarios similares
   - Requiere: Historial de compras, ratings

2. **Content-Based Filtering Avanzado:**
   - Análisis de descripciones con NLP
   - Requiere: Descripciones detalladas, embeddings

3. **Deep Learning:**
   - Modelos de redes neuronales
   - Requiere: Dataset grande, entrenamiento

4. **Hybrid Approach:**
   - Combinar múltiples algoritmos
   - Requiere: Integración de varios modelos

### Arquitectura Futura con ML

```
┌─────────────────────────────────────┐
│  Frontend (React)                   │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  API Route (Next.js)                │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       ↓               ↓
┌─────────────┐  ┌─────────────┐
│ TensorFlow.js│  │  Supabase   │
│ (Modelo ML) │  │  (Datos)    │
└─────────────┘  └─────────────┘
```

---

## 📊 Métricas y Evaluación

### Métricas Actuales (Básicas)
- **Cobertura:** Todos los productos disponibles
- **Precisión:** Basada en coincidencias exactas (categoría/color)
- **Diversidad:** Limitada (solo categorías/colores)

### Métricas Futuras (con ML)
- **Click-Through Rate (CTR):** % de recomendaciones clickeadas
- **Conversion Rate:** % de recomendaciones que resultan en compra
- **Diversidad:** Variedad de productos recomendados
- **Novelty:** Productos nuevos descubiertos por el usuario

---

## 🔧 Configuración y Uso

### Para Desarrolladores

**Agregar Nuevo Tipo de Recomendación:**
1. Agregar botón en `pages/recommendations.tsx`
2. Implementar lógica en `pages/api/recommendations.ts`
3. Actualizar interfaz `RecommendationRequest`

**Modificar Algoritmo:**
- Editar función de filtrado en `pages/api/recommendations.ts`
- Mantener compatibilidad con tipos existentes

### Para Usuarios

**Cómo Usar:**
1. Agregar productos al carrito
2. Navegar a `/recommendations`
3. Seleccionar tipo de recomendación:
   - **Por Categoría:** Productos similares por tipo
   - **Por Color:** Productos con colores similares
   - **Similares:** Productos de misma categoría pero diferentes

---

## 📝 Conclusión

El módulo de recomendaciones implementado:
- ✅ **Cumple con el requisito:** Sistema básico/simulado funcional
- ✅ **Es navegable:** Interfaz completa y usable
- ✅ **Está preparado para ML:** Arquitectura lista para escalar
- ✅ **Es mantenible:** Código limpio y documentado
- ✅ **Es extensible:** Fácil agregar nuevos algoritmos

**Próximos Pasos:**
1. Recopilar datos de interacción (clicks, compras)
2. Entrenar modelo ML con TensorFlow.js
3. Implementar A/B testing para comparar algoritmos
4. Agregar personalización basada en historial

---

## 📚 Referencias

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Recommendation Systems Overview](https://en.wikipedia.org/wiki/Recommender_system)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

