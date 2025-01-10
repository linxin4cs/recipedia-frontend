import { createRouter, createWebHistory } from 'vue-router'
import { setupRouteGuards } from './guards'
import HomeView from '../views/home/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import SignupView from '../views/auth/SignupView.vue'
import AccountView from '../views/auth/AccountView.vue'
import CreateRecipeView from '../views/recipe/CreateRecipeView.vue'
import TrendyView from '../views/TrendyView.vue'
import DiscussionView from '../views/discussion/DiscussionsView.vue'
import RecipeView from '../views/recipe/RecipeDetailsView.vue'
import SearchView from '../views/home/SearchView.vue'
import ChallengeView from '../views/challenge/ChallengesView.vue'
import ChallengeDetailsView from '../views/challenge/ChallengeDetailsView.vue'
import DiscussionDetailView from '@/views/discussion/DiscussionDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: { requiresAuth: true },
    },
    {
      path: '/create',
      name: 'create',
      component: CreateRecipeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/trendy',
      name: 'trendy',
      component: TrendyView,
    },
    {
      path: '/challenges',
      name: 'challenges',
      component: ChallengeView,
    },
    {
      path: '/challenges/:id',
      name: 'challenge-details',
      component: ChallengeDetailsView,
    },
    {
      path: '/discussions',
      name: 'discussions',
      component: DiscussionView,
    },
    {
      path: '/discussions/:id',
      name: 'discussion-details',
      component: DiscussionDetailView,
    },
    {
      path: '/recipes/:id',
      name: 'recipe',
      component: RecipeView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
  ],
})

setupRouteGuards(router)

export default router
