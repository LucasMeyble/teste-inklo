<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useUserStore } from '../store'
import type { UserProps } from "../store/UserStore"
import { useRoute } from "vue-router";
import SkeletonUserCard from "../components/SkeletonUserCard.vue"
const userStore = useUserStore()
const route = useRoute()
const { getUserByUsername, saveUserInformation } = userStore
const user = ref<UserProps | null>(null)
const loading = ref(false)

const onClickSaveInformation = async () => {
  loading.value = !loading.value
  if (user.value)
    await saveUserInformation(user.value)
  loading.value = !loading.value
}
onMounted(async () => {
  const username = route.params.username as string
  if (username) {
    user.value = await getUserByUsername(username)
  }
})
</script>
<template>
  <div class="card w-80 mx-auto bg-white shadow-xl hover:shadow" v-if="user">
    <div class="p-4">
      <RouterLink to="/"
        class="rounded text-xs bg-gray-100 px-2 py-1.5 border inline-flex items-center text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </RouterLink>
    </div>
    <img class="w-32 mx-auto rounded-full -mt-28 border-8 border-white object-cover" :src="user.avatar_url" alt="">
    <h2 class="text-center mt-2 text-3xl font-medium">{{ user.name }}</h2>
    <span class="text-center mt-2 font-light text-sm block">@{{ user.login }}</span>
    <div class="px-6 text-center mt-2 font-light text-sm">
      <p>
        {{ user.bio }}
      </p>
    </div>
    <div class="flex items-center justify-center mt-4">
      <button @click="onClickSaveInformation" :disabled="loading"
        class="px-4 py-2 text-center flex disabled:bg-indigo-300 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 transition-colors ease-out duration-100 text-indigo-50 rounded-md text-sm font-medium">Salvar
        informações</button>
    </div>
    <hr class="mt-8">
    <div class="flex p-4">
      <div class="w-1/2 text-center text-sm">
        <span class="font-bold text-base">{{ user.followers }}</span> Seguidores
      </div>
      <hr class="w-0 border border-gray-300" />
      <div class="w-1/2 text-center text-sm">
        <span class="font-bold text-base">{{ user.following }}</span> Seguindo
      </div>
    </div>
  </div>
  <SkeletonUserCard v-else />
</template>