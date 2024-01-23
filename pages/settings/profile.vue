<script setup>
  import {z} from 'zod'
  import {fa} from "@faker-js/faker";
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const {toastSuccess, toastError} = appToast()
  const pending = ref(false)

  const state = ref({
    // medata gives us access that we are saving using the data property in the try block
    name: user.value.user_metadata?.full_name,
    email: user.value.email
  })

//   Validation schema
  const schema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email()
  })
//   Saving the profile changes
  const saveProfile = async () => {
    pending.value = true
    try {
      const data = {
        data: {
          full_name: state.value.name
        }
      }

      // Modify the email if it actually changed
      if (state.value.email !== user.value.email) {
        data.email = state.value.email
      }
      console.log(data)
      
      const {error} = await supabase.auth.updateUser(data)
      if (error) throw error
      toastSuccess({
        title: "Update successful",
        description: "Profile has been updated"
      })
    } catch (e) {
      toastError({
        title: "Error updating profile",
        description: e.message
      })
    } finally {
       pending.value = false
    }
  }
</script>

<template>
  <UForm :state="state" :schema="schema" @submit="saveProfile">
    <UFormGroup class="mb-4" label="Full Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup class="mb-4" label="E-mail" name="email" help="You will receive a confirmation email on both addresses">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton type="submit" color="green" variant="solid" label="Save" :loading="pending" :disabled="pending"/>
  </UForm>
</template>

