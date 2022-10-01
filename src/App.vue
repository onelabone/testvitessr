<template>
  <div>
    <router-link to="/">Home</router-link>|
    <router-link to="/about">About</router-link>
    <router-view v-slot="{ Component }">
      <Suspense>
        <div>
          <component :is="Component" />
        </div>
      </Suspense>
    </router-view>
  </div>
</template>


<style lang="scss">
@import '@/styles/app.scss';

.quick-view {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  backdrop-filter: blur(1px);
}
</style>