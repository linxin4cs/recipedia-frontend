<template>
    <header>
      <h1>Recipedia</h1>
    </header>
    <nav>
      <router-link to="/" :class="{ selectedNav: currentRoute.path === '/' }">Home</router-link>
      <router-link to="/trendy" :class="{ selectedNav: currentRoute.path === '/trendy' }">Trendy Recipes</router-link>
      <router-link to="/challenge" :class="{ selectedNav: currentRoute.path === '/challenge' }">Challenges</router-link>
      <router-link to="/discussion" :class="{ selectedNav: currentRoute.path === '/discussion' }">Discussion</router-link>
      <router-link to="/create" :class="{ selectedNav: currentRoute.path === '/create' }">Create Recipe</router-link>
      <router-link to="/account" class="account-link" :class="{ selectedNav: currentRoute.path === '/account' }">Account</router-link>
    </nav>

    <router-view></router-view>

    <footer class="footer">
      <p>&copy; 2024 Recipedia</p>
    </footer>
</template>

<script setup>

import {useRouter} from "vue-router";

const router = useRouter()
const currentRoute = router.currentRoute

</script>

<style>

header {
  background-color: var(--main-color);
  color: var(--text-color);
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: calc(100vw - 100%);
  text-align: center;
}

nav {
  background-color: var(--main-color);
  overflow: hidden;
}

nav a {
  float: left;
  color: var(--text-color);
  padding: 14px 16px;
  text-decoration: none;
}

nav a:hover {
  background-color: var(--hover-color);
}

.selectedNav {
  background-color: var(--hover-color);
}

.account-link {
  float: right;
}

.footer {
  margin-top: auto;
  background-color: var(--main-color);
  color: var(--text-color);
  text-align: center;
  padding: 10px;
}
</style>
