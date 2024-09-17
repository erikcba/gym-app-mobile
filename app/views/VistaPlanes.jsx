import React, { useEffect, useState } from 'react'
import { Text, ActivityIndicator, ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native'
import { getAuth } from "firebase/auth"
import { db } from "../../firebaseConfig"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { styled } from 'nativewind'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Container = styled(View)
const SubHeading = styled(View)

const VistaPlanes = ({ navigation }) => {

    const [userId, setUserId] = useState("")
    const [nombrePlan, setNombrePlan] = useState("")
    const [days, setDays] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchPlanData = async () => {
        try {
            const auth = getAuth()
            const user = auth.currentUser
            if (!user) {
                setError("No hay usuario autenticado.")
                return
            }

            const uid = user.uid
            setUserId(uid)

            const userDocRef = doc(db, "users", uid)
            const userDocSnap = await getDoc(userDocRef)

            if (!userDocSnap.exists()) {
                setError("El documento del usuario no existe.")
                return
            }

            const { assignedPlans } = userDocSnap.data()
            if (!assignedPlans) {
                setError("El usuario no tiene un plan asignado.")
                return
            }

            const planDocRef = doc(db, "planesActivos", assignedPlans)
            const planDocSnap = await getDoc(planDocRef)

            if (!planDocSnap.exists()) {
                setError("El documento del plan no existe.")
                return
            }

            const planData = planDocSnap.data()
            const daysRef = collection(planDocRef, "days")
            const daysSnapshot = await getDocs(daysRef)
            const daysData = daysSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))

            await AsyncStorage.setItem('userPlan', JSON.stringify({
                nombrePlan: planData.nombrePlan,
                daysData,
                fecha: planData.fecha
            }))
            setNombrePlan(planData.nombrePlan)
            setDays(daysData)

        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error)
            setError("Error al obtener los datos del usuario.")
        }
    }

    const loadStoredPlan = async () => {
        try {
            setLoading(true)
            const storedPlan = await AsyncStorage.getItem('userPlan')
            if (storedPlan) {
                const planPrevio = JSON.parse(storedPlan)
                setNombrePlan(planPrevio.nombrePlan)
                setDays(planPrevio.daysData)
            } else {
                await fetchPlanData()
            }
        } catch (error) {
            setError("Error al cargar los datos almacenados.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadStoredPlan()
    }, [])

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchPlanData()
        setRefreshing(false)
    }


    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}  
                    colors={['#FAC710']} 
                />
            }>
            <Container className="items-center bg-zinc-900 p-5 min-h-screen">
                <Container className="items-center gap-5 w-full h-full">
                    <SubHeading className="flex flex-col text-lg font-semibold text-center text-zinc bg-yellow-400 rounded-md p-2 w-full">
                        <Text className="text-lg font-semibold text-center text-zinc" >Plan</Text>
                        <Text className="text-lg font-semibold text-center text-zinc" >{nombrePlan}</Text>
                    </SubHeading>

                    <View className="flex flex-col items-center justify-center w-full h-1/2">
                        {loading ? (
                            <Container className="items-center  gap-2">
                                <Text className="text-lg font-semibold text-center text-white">Cargando</Text>
                                <ActivityIndicator size="large" color="#ffffff" />
                            </Container>
                        ) : days.length > 0 ? (
                            days.map((day, dayIndex) => (
                                <Container className="w-full my-2 " key={dayIndex}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Plan', { dayId: day.id, dayName: day.name })} className=" bg-zinc-800 rounded-md px-4 py-10 flex flex-row justify-center items-center">
                                        <Text className="text-2xl font-semibold text-center text-white">{day.name}</Text>
                                    </TouchableOpacity>
                                </Container>
                            ))
                        ) : (
                            <Text className="text-lg font-semibold text-center text-white">No hay plan para mostrar</Text>
                        )}
                    </View>
                </Container>
            </Container>
        </ScrollView>
    )
}

export default VistaPlanes