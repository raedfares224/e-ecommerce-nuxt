export default defineNuxtPlugin((nuxtApp) => {
  // التأكد من أن الانتقال السلس يعمل عند تغيير الصفحة
  nuxtApp.hook('page:finish', () => {
    // الانتقال السلس إلى أعلى الصفحة
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  })

  // يمكنك أيضاً استخدام page:start إذا أردت الانتقال الفوري
  // nuxtApp.hook('page:start', () => {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: 'smooth'
  //   })
  // })
})
