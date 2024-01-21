<script setup>
import {categories, types} from "~/constants.js";

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(["update:modelValue"])

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

      <UForm :state="state">
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

        <UButton type="submit" color="green" variant="solid" label="Save" />
      </UForm>

    </UCard>
  </UModal>
</template>
