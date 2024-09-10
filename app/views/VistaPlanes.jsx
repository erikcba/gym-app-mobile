import React, { useEffect, useState } from 'react'
import { Text, ActivityIndicator, ScrollView, View, TouchableOpacity } from 'react-native'
import { getAuth, onAuthStateChanged } from "firebase/auth"
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

    useEffect(() => {
        const auth = getAuth()

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setLoading(false)
                setError("No hay usuario autenticado.")
                return
            }
    
            try {
                const storedPlan = await AsyncStorage.getItem('userPlan')
                const planPrevio = storedPlan ? JSON.parse(storedPlan) : null
    
                const uid = user.uid
                setUserId(uid)
    
                const userDocRef = doc(db, "users", uid)
                const userDocSnap = await getDoc(userDocRef)
    
                if (!userDocSnap.exists()) {
                    setError("El documento del usuario no existe.")
                    setLoading(false)
                    return
                }
    
                const { assignedPlans } = userDocSnap.data()
                if (!assignedPlans) {
                    setError("El usuario no tiene un plan asignado.")
                    setLoading(false)
                    return
                }
    
                const planDocRef = doc(db, "planesActivos", assignedPlans)
                const planDocSnap = await getDoc(planDocRef)
    
                if (!planDocSnap.exists()) {
                    setError("El documento del plan no existe.")
                    setLoading(false)
                    return
                }
    
                const planData = planDocSnap.data()
                const daysRef = collection(planDocRef, "days")
                const daysSnapshot = await getDocs(daysRef)
                const daysData = daysSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
    
                const fechaNuevo = new Date(planData.fecha)
                const fechaPrevio = planPrevio ? new Date(planPrevio.fecha) : null
    
                // Verificar si el plan almacenado es más viejo o no existe
                if (!fechaPrevio || fechaNuevo > fechaPrevio) {
                    await AsyncStorage.setItem('userPlan', JSON.stringify({
                        nombrePlan: planData.nombrePlan,
                        daysData,
                        fecha: planData.fecha
                    }))
                    setNombrePlan(planData.nombrePlan)
                    setDays(daysData)
                } else {
                    setNombrePlan(planPrevio.nombrePlan)
                    setDays(planPrevio.daysData)
                }
    
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error)
                setError("Error al obtener los datos del usuario.")
            } finally {
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [])

    return (
        <ScrollView>
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
                                    <TouchableOpacity onPress={() => navigation.navigate('Plan', { dayId: day.id, dayName: day.name })} className=" bg-zinc-800 rounded-md px-4 py-6 flex flex-row items-center">
                                        <Text className="text-lg font-semibold text-center text-white">{day.name}</Text>
                                        <Icon name="chevron-forward-outline" size={35} color="#808080" className="ml-auto" />
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