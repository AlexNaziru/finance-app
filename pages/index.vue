
<template>
  <div  v-if="isClient">
    <section class="flex items-center justify-between mb-10">
      <h1 class="text-4xl font-extrabold">
        Sumar
      </h1>
      <div>
        <USelectMenu :options="transactionViewOptions" v-model="selectedView"/>
      </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
      <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="4100" :loading="isLoading" />
      <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="3800" :loading="isLoading" />
      <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="isLoading" />
      <Trend color="red" title="Saving" :amount="4000" :last-amount="4100" :loading="isLoading" />
    </section>

    <section class="flex justify-between mb-10">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <div class="text-gray-500 dark:text-gray-400">
          You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
        </div>
      </div>
      <div>
        <UButton icon="i-heroicons-plus-circle" color="green" variant="solid" label="Add" @click="isOpen = true" />
        <TransactionModal v-model="isOpen"/>
      </div>
    </section>

    <section  v-if="!isLoading">
      <div v-for="(transactionsOnDay, date) in transactionsGroupedByDate" :key="date" class="mb-10">
        <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
        <Transaction v-for="transaction in transactionsOnDay" :key="transaction.id" :transaction="transaction"
                     @deleted="refreshTransactions" />
      </div>
    </section>

    <section v-else>
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
  </div>
</template>

<script setup>

import {transactionViewOptions} from "~/constants.js";

const selectedView = ref(transactionViewOptions[1])

// The annoying hydration
import {ref, onMounted} from "vue";
const isClient = ref(false);

// The modal
const isOpen = ref(false)

onMounted(() => {
  isClient.value = true;
});

// Connecting to the supabase db
const supabase = useSupabaseClient()

// Quering the supabase db
const {data: transactions} = await useAsyncData("transactions", async () => {
  const {data} = await supabase
      .from("transactions")
      .select("id, created_at, amount, type, description, category")
  console.log(data)
  return data
})

const isLoading = ref(false)
// Calculating transactions
const income = computed(
    () => transactions.value.filter(t => t.type === 'Income')
)
const expense = computed(
    () => transactions.value.filter(t => t.type === 'Expense')
)
const incomeCount = computed(() => income.value.length)
const expenseCount = computed(() => expense.value.length)
const incomeTotal = computed(
    () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)
const expenseTotal = computed(
    () => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

// Deleting the transaction from the UI
const fetchTransactions = async () => {
  isLoading.value = true
  try {
    const {data} = await useAsyncData("transactions", async () => {
      const {data, error} = await supabase
          .from("transactions")
          .select()
      if (error) return []
      return data
    })

    return data.value
  } finally {
    isLoading.value = false
  }
}
const refreshTransactions = async () => transactions.value = await fetchTransactions()
await refreshTransactions()

// Grouping transactions by date
const transactionsGroupedByDate = computed(() => {
  let grouped = {}
  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString().split('T')[0]
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(transaction)
  }
  return grouped
})
console.log(transactionsGroupedByDate.value)

</script>


