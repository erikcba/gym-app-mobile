import AsyncStorage from '@react-native-async-storage/async-storage'

export const savePlanToCache = async (plan) => {
    try {
        await AsyncStorage.setItem('@user_plan', JSON.stringify(plan))
    } catch (error) {
        console.error('Error saving plan to cache:', error)
    }
}

export const getPlanFromCache = async () => {
    try {
        const cachedPlan = await AsyncStorage.getItem('@user_plan')
        return cachedPlan ? JSON.parse(cachedPlan) : null
    } catch (error) {
        console.error('Error getting plan from cache:', error)
        return null
    }
}
