const GUEST_CART_KEY = 'guestCart'

const getCart = () => {
  try { return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]') }
  catch { return [] }
}

const save = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

export const addToGuestCart = (productId) => {
  const items = getCart()
  const existing = items.find(i => i.productId === productId)
  if (existing) existing.quantity += 1
  else items.push({ productId, quantity: 1 })
  save(items)
  return items
}

export const updateGuestCartQty = (productId, qty) => {
  const items = getCart()
  const existing = items.find(i => i.productId === productId)
  if (existing) {
    if (qty <= 0) return removeFromGuestCart(productId)
    existing.quantity = qty
  }
  save(items)
  return items
}

export const removeFromGuestCart = (productId) => {
  const items = getCart().filter(i => i.productId !== productId)
  save(items)
  return items
}

export const getGuestCart = () => getCart()

export const getGuestCartCount = () => {
  return getCart().reduce((sum, i) => sum + i.quantity, 0)
}

export const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY)
}

export const isInGuestCart = (productId) => {
  return getCart().some(i => i.productId === productId)
}

export const getGuestCartQty = (productId) => {
  const item = getCart().find(i => i.productId === productId)
  return item?.quantity || 0
}
