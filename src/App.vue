<template>
  <div id="app">
    <header>
      <h1>Recipedia</h1>
    </header>
    <nav>
      <router-link to="/" :class="{ selectedNav: $route.path === '/' }">Home</router-link>
      <router-link to="/trendy" :class="{ selectedNav: $route.path === '/trendy' }">Trendy Recipes</router-link>
      <router-link to="/challenge" :class="{ selectedNav: $route.path === '/challenge' }">Challenges</router-link>
      <router-link to="/discussion" :class="{ selectedNav: $route.path === '/discussion' }">Discussion</router-link>
      <router-link to="/create" :class="{ selectedNav: $route.path === '/create' }">Create Recipe</router-link>
      <router-link to="/account" class="account-link" :class="{ selectedNav: $route.path === '/account' }">Account</router-link>
    </nav>
    
    <router-view></router-view>
    
    <footer class="footer">
      <p>&copy; 2024 Recipedia</p>
    </footer>
  </div>
</template>

<style>
@import './styles/main.css';

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

header {
  background-color: var(--main-color);
  color: var(--text-color);
  padding: 15px;
  text-align: center;
}

.footer {
  margin-top: auto;
  background-color: var(--main-color);
  color: var(--text-color);
  text-align: center;
  padding: 10px;
}
</style>