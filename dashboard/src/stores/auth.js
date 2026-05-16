import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)

  async function initialize() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      user.value = session.user
    }
    
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
      loading.value = false
    })
    
    loading.value = false
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    user.value = data.user
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
  }

  return {
    user,
    loading,
    isAuthenticated,
    initialize,
    signIn,
    signOut
  }
})