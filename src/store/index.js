import Vue from 'vue'
import Vuex from 'vuex'
import user from "@/store/module/user";
import getters from "@/store/getters";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user
  },
  getters
})
