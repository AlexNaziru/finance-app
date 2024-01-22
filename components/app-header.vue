<script setup>
  const user = useSupabaseUser()
  watch(user, (user) => {
    if (user) {
      alert("Signed in")
    }
  }, {immediate: true})
</script>

<template>
  <header class="flex justify-between items-center mt-10">
    <NuxtLink to="/" class="text-xl font-bold"> Finance tracker </NuxtLink>
    <div>
      <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar"/>
    </div>
  </header>
</template>
