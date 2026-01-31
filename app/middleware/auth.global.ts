// ميدل وير حماية الصفحات التي تحتاج تسجيل دخول
import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  // نحمي فقط مسارات الداشبورد
  if (!to.path.startsWith('/dashboard')) return

  // نتأكد أننا في الكلاينت قبل استخدام الكوكي
  if (process.server) return

  // التحقق من وجود التوكن في الكوكي (نفس المستخدمة في auth store)
  const token = useCookie<string | null>('token')

  if (!token.value) {
    // إعادة التوجيه لصفحة تسجيل الدخول إذا لم يكن المستخدم مسجل الدخول
    return navigateTo('/auth/login')
  }
})
