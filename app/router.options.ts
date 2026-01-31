import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // إذا كان هناك موضع محفوظ (عند الرجوع للخلف)
    if (savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ...savedPosition,
            behavior: 'smooth',
          })
        }, 100)
      })
    }
    
    // إذا كان هناك hash في الرابط (#section)
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
            top: 80, // offset للـ navbar
          })
        }, 100)
      })
    }
    
    // الانتقال السلس إلى أعلى الصفحة
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          top: 0,
          left: 0,
          behavior: 'smooth',
        })
      }, 100)
    })
  },
}
