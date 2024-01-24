<script setup>
import {categories, types} from "~/constants.js";

const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false
  }
})
// This lets us change out Add window to an edit window
const isEditing = computed(() => !!props.transaction)

// This emits events on the DOM
const emit = defineEmits(["update:modelValue", "saved"])

// Saving data to supabase
const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const {toastSuccess ,toastError} = appToast()
const save = async () => {
  if (form.value.errors.length) return
  // Storing
  isLoading.value = true
  try{
    const {error} = await supabase
        .from("transactions")
        .upsert({...state.value, id: props.transaction?.id})
    if (!error) {
      toastSuccess({
        title: "Transaction saved!"
      })
      isOpen.value = false
      emit("saved")
    }
  } catch (e) {
    toastError({
      title: "Transaction not saved!",
      description: e.message,
    })
  } finally {
      isLoading.value = false
  }
}


// Form validation
const initialState = isEditing.value ? {
      type: props.transaction.type,
      amount: props.transaction.amount,
      created_at: props.transaction.created_at.split("T")[0],
      description: props.transaction.description,
      category: props.transaction.category
} : {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined
}
const state = ref({ ...initialState })

const resetForm = () => {
  Object.assign(state.value, initialState)
  form.value.clear()
}

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm()
    emit("update:modelValue", value)
  }
})
</script>

<template>
  <UModal v-model="isOpen">
    <UCard >
      <template #header>
        {{isEditing ? "Edit" : "Add"}} Transaction
      </template>

      <UForm :state="state" ref="form" @submit="save">
        <UFormGroup label="Transaction Type" :required="true" name="type" class="mb-4">
          <USelect :disabled="isEditing" placeholder="Select a type" :options="types" v-model="state.type" />
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

