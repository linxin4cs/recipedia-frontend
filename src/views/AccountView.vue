<template>
  <div class="container">
    <loading-spinner v-if="isLoading" />
    <template v-else-if="user.userId !== 0">
      <div class="profile-section-wrapper">
        <section class="profile-section">
          <h2>{{ user.username }}</h2>
          <p class="user-email">{{ user.email }}</p>
          <p>{{ user.bio }}</p>

          <div class="profile-actions">
            <div class="profile-actions-edit">
              <base-button @click="showEditModal = true">Edit Profile</base-button>
            </div>
            <div class="profile-actions-changePassword">
              <base-button @click="showChangePasswordModal = true">
                Change Password
              </base-button>
            </div>
          </div>
        </section>

        <base-button type="danger" @click="handleDelete">Delete Account</base-button>
        <base-button type="secondary" @click="handleLogout">Logout</base-button>
      </div>

      <section>
        <h3>My Recipes</h3>
        <div class="item-grid">
          <recipe-card v-for="recipe in recipes" :key="recipe.recipeId" :recipe="recipe" />
        </div>

        <div v-if="recipes.length === 0" class="no-items">
          <p>You haven't created any recipes yet.</p>
          <base-button @click="router.push('/recipes/create')"
            >Create Your First Recipe</base-button
          >
        </div>
      </section>

      <section>
        <h3>My Challenges</h3>
        <div class="item-grid">
          <challenge-card
            v-for="challenge in challenges"
            :key="challenge.challengeId"
            :challenge="challenge"
          />
        </div>

        <div v-if="challenges.length === 0" class="no-items">
          <p>You haven't joined any challenges yet.</p>
          <base-button @click="router.push('/challenges')"
            >Join your first challenge</base-button
          >
        </div>
      </section>

      <section>
        <h3>My Discussions</h3>
        <div class="item-grid">
          <discussion-card
            v-for="discussion in discussions"
            :key="discussion.discussionId"
            :discussion="discussion"
          />
        </div>

        <div v-if="discussions.length === 0" class="no-items">
          <p>You haven't created any discussions yet.</p>
          <base-button @click="router.push('/discussions')"
            >Create Your First discussion</base-button
          >
        </div>
      </section>
    </template>

    <div class="error-message" v-else>Failed to load user profile</div>

    <modal-dialog v-if="showChangePasswordModal" @close="showChangePasswordModal = false">
      <template #header>Change Password</template>
      <change-password-form
        @submit="handleChangePassword"
        @cancel="showChangePasswordModal = false"
      />
    </modal-dialog>

    <modal-dialog v-if="showEditModal" @close="showEditModal = false">
      <template #header>Edit Profile</template>
      <edit-profile-form
        :initial-data="user"
        @submit="handleSaveProfile"
        @cancel="showEditModal = false"
      />
    </modal-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { jsonApi } from '@/services/api.js'
import BaseButton from '@/components/BaseButton.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import ChallengeCard from '@/components/challenge/ChallengeCard.vue'
import DiscussionCard from '@/components/DiscussionCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import ChangePasswordForm from '@/components/account/ChangePasswordForm.vue'
import EditProfileForm from '@/components/account/EditProfileForm.vue'

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
const isLoading = ref(true)
const showChangePasswordModal = ref(false)
const showEditModal = ref(false)

onMounted(async () => {
  try {
    await authStore.fetchUserProfile()
    user.value = authStore.user
    await Promise.all([fetchRecipes(), fetchChallenges(), fetchDiscussions()])
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})

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

const handleSaveProfile = async (updatedData) => {
  try {
    await authStore.updateUserProfile(updatedData)
    user.value = authStore.user
    showEditModal.value = false
  } catch (err) {
    console.error(err)
  }
}

const handleChangePassword = async (passwordData) => {
  try {
    await authStore.changePassword(passwordData)
    showChangePasswordModal.value = false
  } catch (err) {
    console.error(err)
  }
}

const handleLogout = () => {
  const confirmLogout = confirm('Are you sure you want to logout?')
  if (!confirmLogout) return

  authStore.logout()
  router.push('/')
}

const handleDelete = () => {
  if (!confirm('Are you sure you want to delete your account?')) return

  authStore.deleteAccount()
  router.push('/')
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

.error-message {
  color: red;
  padding: 10px;
}
</style>
