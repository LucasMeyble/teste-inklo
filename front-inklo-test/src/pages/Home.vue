<script setup lang="ts">
import { onMounted } from "vue"
import { useUserStore } from '../store'
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router";
import SkeletonUserList from "../components/SkeletonUserList.vue";
const userStore = useUserStore()
const router = useRouter()
const { getAllUsers } = userStore
const { search, computedUsers, isLoading } = storeToRefs(userStore)

const goToProfile = (username: string) => {
  router.push(`/user/profile/${username}`)
}
const convertDate = (createdAt: string) => {
  const date = new Date(createdAt)
  return Intl.DateTimeFormat('pt-BR').format(date)
}
onMounted(() => {
  getAllUsers()
})
</script>

<template>
  <div class="bg-white border border-gray-100 shadow-md shadow-gray-200 w-full max-w-xl rounded-lg m-6">
    <div class="p-6 ">
      <div class="flex items-center gap-4">
        <input type="text" placeholder="Tap here to search a user"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 placeholder:text-sm"
          v-model="search" />
      </div>
      <SkeletonUserList v-if="isLoading" />
      <ul class="overflow-y-auto max-h-96 space-y-4 mt-6" v-else>
        <li v-for="user in computedUsers" :key="user.id" @click="goToProfile(user.login)"
          class="flex items-center justify-between gap-4 hover:cursor-pointer hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors ease-out duration-150 rounded p-2 px-4">
          <div class="flex items-center gap-x-5">
            <div>
              <img :src="user.avatar_url" class="object-cover w-16 h-16 rounded-full" alt="">
            </div>
            <div>
              <h2 class="font-medium text-base">{{ user.login }}</h2>
              <p class="text-sm text-gray-500 mt-1">Usuário desde <span class="font-medium">{{
                convertDate(user.created_at)
              }}</span></p>
            </div>
          </div>
          <div>
            <span class="text-xs font-bold ">{{ user.public_repos }}</span>
          </div>
        </li>
      </ul>
      <p v-if="!computedUsers.length && !isLoading" class="text-sm text-gray-500">Nenhum usuário encontrado <span
          class="font-bold">@{{
            search }}</span></p>

    </div>
  </div>
</template>