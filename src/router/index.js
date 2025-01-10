import { createRouter, createWebHistory } from 'vue-router'
import { setupRouteGuards } from './guards'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import AccountView from '../views/AccountView.vue'
import CreateRecipeView from '../views/CreateRecipeView.vue'
import TrendyView from '../views/TrendyView.vue'
import DiscussionView from '../views/DiscussionView.vue'
import RecipeView from '../views/RecipeView.vue'
import SearchView from '../views/SearchView.vue'
import ChallengeView from '../views/ChallengeView.vue'
import ChallengeDetailsView from '../views/ChallengeDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: { requiresAuth: true }
    },
    {
      path: '/recipes/create',
      name: 'create',
      component: CreateRecipeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/trendy',
      name: 'trendy',
      component: TrendyView
    },
    {
      path: '/challenge',
      name: 'challenge',
      component: ChallengeView
    },
    {
      path: '/discussion',
      name: 'discussion',
      component: DiscussionView
    },
    {
      path: '/recipe/:id',
      name: 'recipe',
      component: RecipeView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/challenge/:id',
      name: 'challenge-details',
      component: ChallengeDetailsView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

setupRouteGuards(router)

export default router
