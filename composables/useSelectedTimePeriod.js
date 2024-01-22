import {endOfDay, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear, sub} from "date-fns";

export const useSelectedTimePeriod = (period) => {
    const current = computed(() => {
        switch (period.value) {
            case "Anual":
                return {
                    from: startOfYear(new Date()),
                    to: endOfYear(new Date())
                }
            case "Lunar":
                return {
                    from: startOfMonth(new Date()),
                    to: endOfMonth(new Date())
                }
            case "Zilnic":
                return {
                    from: startOfDay(new Date()),
                    to: endOfDay(new Date())
                }
        }
    })

    const previous = computed(() => {
        switch (period.value) {
            case "Anual":
                return {
                    from: startOfYear(sub(new Date(), {years: 1})),
                    to: endOfYear(sub(new Date(), {years: 1}))
                }
            case "Lunar":
                return {
                    from: startOfMonth(sub(new Date(), {months: 1})),
                    to: endOfMonth(sub(new Date(), {months: 1}))
                }
            case "Zilnic":
                return {
                    from: startOfDay(sub(new Date(), {days: 1})),
                    to: endOfDay(sub(new Date(), {days: 1}))
                }
        }
    })
    return {current, previous}
}