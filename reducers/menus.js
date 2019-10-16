function menus(state = {}, action) {
    switch (action.type) {
    case 'SET_MENUS_LIST': {
      return {...state, ...action.payload}
    }
    case 'SET_CURRENT_ATTRIUBTES': {
      return {...state, ...action.payload}
    }
    case 'SET_CART_SIZE': {
      return {...state, ...action.payload}
    }
    default:
      return state
  }
}
export default menus;