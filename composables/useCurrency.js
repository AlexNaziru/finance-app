export const useCurrency = (amount) => {
    const currency = computed(() => {
        return new Intl.NumberFormat('ro-RO', {
            style: 'currency',
            currency: 'RON'
        }).format(isRef(amount) ? amount.value : amount)
    })

    return {
        currency
    }
}