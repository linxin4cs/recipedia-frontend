<template>
  <div class="container">
    <div v-if="authStore.loading || recipeStore.loading" class="loading">
      Loading...
    </div>
    
    <template v-else-if="authStore.user">
      <div class="profile-section">
        <h2>{{ authStore.user.username }}'s Profile</h2>
        <p>{{ userBio }}</p>
        
        <div class="profile-actions">
          <base-button @click="isEditing = true" v-if="!isEditing">
            Edit Profile
          </base-button>
          <template v-else>
            <base-button @click="saveProfile">
              Save Changes
            </base-button>
            <base-button type="secondary" @click="isEditing = false">
              Cancel
            </base-button>
          </template>
        </div>
      </div>

      <div class="recipes-section">
        <h3>My Recipes</h3>
        <div class="recipe-grid">
          <recipe-card
            v-for="recipe in recipeStore.userRecipes"
            :key="recipe.id"
            :recipe="recipe"
          />
        </div>
        
        <div v-if="recipeStore.userRecipes.length === 0" class="no-recipes">
          <p>You haven't created any recipes yet.</p>
          <base-button @click="$router.push('/create')">
            Create Your First Recipe
          </base-button>
        </div>
      </div>
    </template>

    <div v-else class="not-logged-in">
      <p>Please log in to view your profile.</p>
      <base-button @click="$router.push('/login')">
        Log In
      </base-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRecipeStore } from '@/stores/recipes'
import BaseButton from '@/components/BaseButton.vue'
import RecipeCard from '@/components/RecipeCard.vue'

const authStore = useAuthStore()
const recipeStore = useRecipeStore()

const isEditing = ref(false)
const userBio = ref('Hello! I\'m a food enthusiast who loves trying out new recipes and sharing them with the world.')

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await Promise.all([
      authStore.fetchUserProfile(),
      recipeStore.fetchUserRecipes()
    ])
  }
})

const saveProfile = async () => {
  // Here you would typically save the profile changes
  isEditing.value = false
}
</script>

<style scoped>
.profile-section {
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.profile-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.no-recipes {
  text-align: center;
  padding: 40px;
  background-color: var(--background-color);
  border-radius: 8px;
}

.not-logged-in {
  text-align: center;
  padding: 40px;
}

.loading {
  text-align: center;
  padding: 40px;
}
</style>