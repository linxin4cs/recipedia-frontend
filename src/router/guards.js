import { useAuthStore } from '@/stores/auth'

export function setupRouteGuards(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    // If page requires auth and user is not logged in
    if (requiresAuth && !authStore.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  })
} 