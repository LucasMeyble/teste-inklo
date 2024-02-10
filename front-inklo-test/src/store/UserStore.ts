import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { GithubAdapter, ApiAdapter } from "../utils/axios";
import { toast } from "vue3-toastify";
export type UserProps = {
  id: number;
  avatar_url: string;
  login: string;
  created_at: string;
  public_repos: number;
  [key: string]: string | any;
};

export const useUserStore = defineStore("user", () => {
  const githubUsers = ["wallysonn", "diego3g", "filipedeschamps", "rmanguinho"];
  const users = ref<UserProps[]>([]);
  const search = ref("");
  const isLoading = ref(false);

  const getAllUsers = async () => {
    try {
      if (users.value.length) return;
      isLoading.value = !isLoading.value;
      for (const user of githubUsers) {
        const res = await GithubAdapter.get(`/users/${user}`);
        users.value.push(res.data);
      }
    } catch (error) {
      toast.error("Houve um erro ao buscar os usuários");
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const getUserByUsername = async (username: string) => {
    try {
      const res = await GithubAdapter.get(`/users/${username}`);
      return res.data;
    } catch (error) {
      toast.error(`Houve um erro ao buscar as informações de ${username}`);
      console.log(error);
    }
  };
  const saveUserInformation = async (user: UserProps) => {
    try {
      await ApiAdapter.post("/salvar-local", {
        login: user.login
      }, );
      toast.success("Informações salvas com sucesso !");
    } catch (error) {
      toast.error("Error ao salvar informações.");
    }
  };
  const computedUsers = computed(() => {
    if (!search.value) return users.value;

    return users.value.filter((user) => user.login.includes(search.value));
  });
  return {
    users,
    search,
    isLoading,
    computedUsers,
    getAllUsers,
    getUserByUsername,
    saveUserInformation,
  };
});
