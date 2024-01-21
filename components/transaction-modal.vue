<script setup>
import {categories, types} from "~/constants.js";

const props = defineProps({
  modelValue: Boolean
})

// This emits events on the DOM
const emit = defineEmits(["update:modelValue", "saved"])

// Saving data to supabase
const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const toast = useToast()
const save = async () => {
  if (form.value.errors.length) return
  // Storing
  isLoading.value = true
  try{
    const {error} = await supabase
        .from("transactions")
        .upsert({...state.value})
    if (!error) {
      toast.add({
        title: "Transaction saved!",
        icon: "i-heroicons-check-circle"
      })
      isOpen.value = false
      emit("saved")
    }
  } catch (e) {
    toast.add({
      title: "Transaction not saved!",
      description: e.message,
      icon: "i-heroicons-exclamation-circle"
    })
  } finally {
      isLoading.value = false
  }
}

// Form validation
const state = ref({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined
})

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
})
</script>

<template>
  <UModal v-model="isOpen">
    <UCard >
      <template #header>
        Add Transaction
      </template>

      <UForm :state="state" ref="form" @submit="save">
        <UFormGroup label="Transaction Type" :required="true" name="type" class="mb-4">
          <USelect placeholder="Select a type" :options="types" v-model="state.type" />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput type="number" placeholder="Amount" v-model.number="state.amount" />
        </UFormGroup>

        <UFormGroup label="Transaction date" :required="true" name="created_at" class="mb-4">
          <UInput type="date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at" />
        </UFormGroup>

        <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
          <UInput placeholder="Description" v-model="state.description" />
        </UFormGroup>

        <UFormGroup label="Category" :required="true" name="category" class="mb-4">
          <USelect placeholder="Category" :options="categories" v-model="state.category" />
        </UFormGroup>

        <UButton type="submit" color="green" variant="solid" label="Save" :loading="isLoading" />
                                                                              <!-- isLoading only shows a loading indicator -->
      </UForm>

    </UCard>
  </UModal>
</template>

