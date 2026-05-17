import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const isAdmin = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function initialize() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      user.value = session.user
      await checkAdminStatus()
    }
    
    supabase.auth.onAuthStateChange(async (event, session) => {
      user.value = session?.user || null
      if (session?.user) {
        await checkAdminStatus()
      } else {
        isAdmin.value = false
      }
      loading.value = false
    })
    
    loading.value = false
  }

  async function checkAdminStatus() {
    if (!user.value) {
      isAdmin.value = false
      return
    }

    const { data: admins, error: countError } = await supabase
      .from('admins')
      .select('id')
      .limit(1)

    const isFirstAdmin = !countError && (!admins || admins.length === 0)

    const { data, error } = await supabase
      .from('admins')
      .select('id, role, is_active')
      .eq('user_id', user.value.id)
      .eq('is_active', true)
      .single()

    isAdmin.value = isFirstAdmin || (!!data && !error)
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    user.value = data.user
    
    const { data: admins, error: countError } = await supabase
      .from('admins')
      .select('id')
      .limit(1)

    const isFirstAdmin = !countError && (!admins || admins.length === 0)

    if (isFirstAdmin) {
      await supabase.from('admins').insert({
        user_id: data.user.id,
        email: data.user.email,
        name: 'Admin Principal',
        role: 'superadmin',
        is_active: true
      })
      isAdmin.value = true
    } else {
      await checkAdminStatus()
      if (!isAdmin.value) {
        await supabase.auth.signOut()
        user.value = null
        throw new Error('No tienes acceso al dashboard')
      }
    }
    
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    isAdmin.value = false
  }

  async function getAdmins() {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async function addAdmin(email, name, role = 'admin') {
    const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      auto_confirm: true
    })

    if (createError) throw createError

    const { data, error } = await supabase
      .from('admins')
      .insert({
        user_id: newUser.id,
        email,
        name,
        role,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async function updateAdminStatus(adminId, isActive) {
    const { data, error } = await supabase
      .from('admins')
      .update({ is_active: isActive })
      .eq('id', adminId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async function removeAdmin(adminId) {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', adminId)

    if (error) throw error
  }

  return {
    user,
    loading,
    isAdmin,
    isAuthenticated,
    initialize,
    signIn,
    signOut,
    checkAdminStatus,
    getAdmins,
    addAdmin,
    updateAdminStatus,
    removeAdmin
  }
})