<template>
  <div class="container">
    <div class="profile-section-wrapper">
      <section class="profile-section">
        <template v-if="!isEditing">
          <h2>
            {{ user.username }}
          </h2>
          <p class="user-email">
            {{ user.email }}
          </p>
          <p>
            {{ user.bio }}
          </p>
        </template>

        <div v-else class="profile-edit-section">
          <input v-model="updatedUser.username" placeholder="Username" />
          <input v-model="updatedUser.email" placeholder="Email" />
          <textarea v-model="updatedUser.bio" placeholder="Bio"></textarea>
        </div>

        <div class="profile-actions">
          <div class="profile-actions-edit">
            <base-button @click="handleStartEdit" v-if="!isEditing">Edit Profile</base-button>
            <template v-else>
              <base-button @click="handleSaveProfile" :disabled="!isUpdatedUserValid"
                >Save Changes</base-button
              >
              <base-button type="secondary" @click="handleCancelEdit">Cancel</base-button>
            </template>
          </div>
          <div class="profile-actions-changePassword">
            <BaseButton @click="isChangingPassword = true" v-if="!isChangingPassword"
              >Change Password
            </BaseButton>
            <template v-else>
              <div class="profile-actions-changePassword-inputs">
                <input placeholder="Current Password" v-model="passwordData.currentPassword" />
                <input placeholder="New Password" v-model="passwordData.newPassword" />
                <input placeholder="Confirm Password" v-model="passwordData.confirmPassword" />
              </div>
              <BaseButton @click="handleChangePassword" :disabled="!isPasswordDataValid"
                >Save Password
              </BaseButton>
              <BaseButton type="secondary" @click="handleCancelPasswordChange">Cancel</BaseButton>
            </template>
          </div>
        </div>
      </section>

      <BaseButton type="danger" @click="handleDelete">Delete Account</BaseButton>
      <BaseButton type="secondary" @click="handleLogout">Logout</BaseButton>
    </div>

    <section>
      <h3>My Recipes</h3>
      <div class="item-grid">
        <recipe-card v-for="recipe in recipes" :key="recipe.recipeId" :recipe="recipe" />
      </div>

      <div v-if="recipes.length === 0" class="no-items">
        <p>You haven't created any recipes yet.</p>
        <base-button @click="router.push('/recipes/create')">Create Your First Recipe</base-button>
      </div>
    </section>

    <section>
      <h3>My Challenges</h3>
      <div class="item-grid">
        <recipe-card v-for="challenge in challenges" :key="challenge.challengeId" :recipe="challenge" />
      </div>

      <div v-if="challenges.length === 0" class="no-items">
        <p>You haven't joined any challenges yet.</p>
        <base-button @click="router.push('/challenges/create')"
          >Join your first challenge</base-button
        >
      </div>
    </section>

    <section>
      <h3>My Discussions</h3>
      <div class="item-grid">
        <recipe-card v-for="discussion in discussions" :key="discussion.discussionId" :recipe="discussion" />
      </div>

      <div v-if="discussions.length === 0" class="no-items">
        <p>You haven't created any discussions yet.</p>
        <base-button @click="router.push('/discussions/create')"
          >Create Your First discussion</base-button
        >
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRecipeStore } from '@/stores/recipes'
import BaseButton from '@/components/BaseButton.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import { useRouter } from 'vue-router'
import {jsonApi} from "@/services/api.js";

onMounted(async () => {
  try {
    await authStore.fetchUserProfile()

    user.value = authStore.user
    await Promise.all([fetchRecipes(), fetchChallenges(), fetchDiscussions()])

  } catch (err) {
    console.error(err)
  }
})

const router = useRouter()

const authStore = useAuthStore()

const user = ref({
  userId: 0,
  username: '',
  email: '',
  bio: '',
})

const recipes = ref([])
const challenges = ref([])
const discussions = ref([])

const updatedUser = ref({
  username: '',
  email: '',
  bio: '',
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isEditing = ref(false)
const isChangingPassword = ref(false)

const fetchRecipes = async () => {
 try {
    const response = await jsonApi.get(`/api/users/${user.value.userId}/recipes`)
    recipes.value = response.data
  } catch (err) {
    console.error(err)
  }
}

const fetchChallenges = async () => {
  try {
    const response = await jsonApi.get(`/api/users/${user.value.userId}/challenges`)
    challenges.value = response.data
  } catch (err) {
    console.error(err)
  }
}

const fetchDiscussions = async () => {
  try {
    const response = await jsonApi.get(`/api/users/${user.value.userId}/discussions`)
    discussions.value = response.data
  } catch (err) {
    console.error(err)
  }
}

const isPasswordDataValid = computed(() => {
  return (
    passwordData.value.currentPassword.trim() &&
    passwordData.value.newPassword.trim() &&
    passwordData.value.confirmPassword.trim() &&
    passwordData.value.newPassword === passwordData.value.confirmPassword
  )
})

const isUpdatedUserValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return updatedUser.value.username.trim() && emailRegex.test(updatedUser.value.email)
})

const handleStartEdit = () => {
  isEditing.value = true

  updatedUser.value.username = user.value.username
  updatedUser.value.email = user.value.email
  updatedUser.value.bio = user.value.bio
}

const handleSaveProfile = async () => {
  isEditing.value = false

  if (
    updatedUser.value.username === user.value.username &&
    updatedUser.value.email === user.value.email &&
    updatedUser.value.bio === user.value.bio
  ) {
    return
  }

  try {
    await authStore.updateUserProfile(updatedUser.value)
    user.value = authStore.user
  } catch (err) {
    console.error(err)
  }
}

const handleCancelEdit = () => {
  isEditing.value = false

  updatedUser.value.username = user.value.username
  updatedUser.value.email = user.value.email
  updatedUser.value.bio = user.value.bio
}

const handleLogout = () => {
  const confirmLogout = confirm('Are you sure you want to logout?')

  if (!confirmLogout) {
    return
  }

  authStore.logout()
  router.push('/')
}

const handleDelete = () => {
  if (!confirm('Are you sure you want to delete your account?')) {
    return
  }

  authStore.deleteAccount()
  router.push('/')
}

const handleChangePassword = async () => {
  isChangingPassword.value = false

  try {
    await authStore.changePassword({
      oldPassword: passwordData.value.currentPassword,
      newPassword: passwordData.value.newPassword,
    })
    passwordData.value.currentPassword = ''
    passwordData.value.newPassword = ''
    passwordData.value.confirmPassword = ''
  } catch (err) {
    console.error(err)
  }
}

const handleCancelPasswordChange = () => {
  isChangingPassword.value = false

  passwordData.value.currentPassword = ''
  passwordData.value.newPassword = ''
  passwordData.value.confirmPassword = ''
}
</script>

<style scoped>
h2 {
  margin-top: 0;
}

.profile-section-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: start;
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  gap: 20px;
}

.profile-section {
  flex: 1;
  margin-right: 100px;
}

.user-email {
  color: #666;
  font-size: 0.9em;
}

.profile-edit-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-actions {
  display: flex;
  align-items: start;
  flex-direction: column;
  margin-top: 20px;
  gap: 10px;
}

.profile-actions-edit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.no-items {
  text-align: center;
  padding: 40px;
  background-color: var(--background-color);
  border-radius: 8px;
}

.profile-actions-changePassword {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
}

.profile-actions-changePassword-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-actions-changePassword input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
