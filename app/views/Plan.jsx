import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, Button, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "../../firebaseConfig"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { styled } from 'nativewind'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';

const Container = styled(View)
const SubHeading = styled(Text)

const VerPlan = ({ route }) => {
    const [userId, setUserId] = useState("")
    const [nombrePlan, setNombrePlan] = useState("")
    const [day, setDay] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const { dayId, dayName } = route.params
    const navigation = useNavigation()



    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const storedPlan = await AsyncStorage.getItem('userPlan')
                    if (storedPlan) {
                        const { daysData } = JSON.parse(storedPlan);
                        const selectedDay = daysData.find(day => day.id === dayId)

                        if (selectedDay) {
                            setDay(selectedDay);
                            setLoading(false);
                            return
                        }
                    }
                    const uid = user.uid
                    setUserId(uid)

                    const userDocRef = doc(db, "users", uid)
                    const userDocSnap = await getDoc(userDocRef)

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data()
                        const assignedPlanId = userData.assignedPlans

                        if (assignedPlanId) {
                            const planDocRef = doc(db, "planesActivos", assignedPlanId)
                            const planDocSnap = await getDoc(planDocRef)

                            if (planDocSnap.exists()) {
                                const planData = planDocSnap.data()
                                setNombrePlan(planData.name)

                                const daysRef = collection(planDocRef, "days")
                                const daysSnapshot = await getDocs(daysRef)
                                if (!daysSnapshot.empty && daysSnapshot.docs) {
                                    const daysData = daysSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                                    const selectedDay = daysData.find(day => day.id === dayId);
                                    if (selectedDay) {
                                        setDay(selectedDay)
                                        await AsyncStorage.setItem('userPlan', JSON.stringify({ nombrePlan: planData.name, daysData }))
                                    } else {
                                        setError("El día seleccionado no existe en el plan.");
                                    }
                                } else {
                                    console.log('No hay datos en la colección');
                                    setError("No hay días disponibles en el plan.");
                                }
                            } else {
                                setError("El documento del plan no existe.")
                            }
                        } else {
                            setError("El usuario no tiene un plan asignado.")
                        }
                    } else {
                        setError("El documento del usuario no existe.")
                    }
                } catch (error) {
                    console.error("Error al obtener los datos del usuario:", error)
                    setError("Error al obtener los datos del usuario.")
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
                setError("No hay usuario autenticado.")
            }
        })

        return () => unsubscribe()
    }, [dayId])

    const renderItem = ({ item }) => (
        <View className="bg-zinc-800 p-4 mb-3 rounded-md flex flex-col justify-center">
            <View className="flex-row justify-between items-center">
                <View className="mx-auto flex flex-col justify-center">
                    <Text className="text-2xl text-yellow-400 font-semibold">{item.name}</Text>
                    <Text className="text-white mx-auto text-lg font-semibold">{item.sets} X {item.reps}</Text>
                </View>

                <TouchableOpacity className="bg-zinc-700 p-2 rounded-md" onPress={() => navigation.navigate('DetalleEjercicio', { exercise: item }) }>
                    <Icon name="chevron-forward-outline" size={32} color="gray" />
                </TouchableOpacity>
            </View>
        </View>
    )

    return (

        <Container className="items-center justify-start bg-zinc-900 p-3  min-h-screen">
            <Container className="items-center justify-center gap-5 w-full">

                {loading ? (
                    <Container className="items-center justify-center gap-2">
                        <Text className="text-lg font-semibold text-center text-white">Cargando</Text>
                        <ActivityIndicator size="large" color="#ffffff" />
                    </Container>
                ) : day ? (

                    <Container className="w-full py-2 flex flex-col " key={dayId}>
                        <SubHeading className="text-lg font-semibold text-center text-zinc bg-yellow-400 rounded-md p-2 mb-5">
                            {day.name}
                        </SubHeading>
                        <FlatList
                            data={day.exercises}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.name.toString()}
                        />
                    </Container>

                ) : (
                    <Text className="text-lg font-semibold text-center text-white">No hay plan para mostrar</Text>
                )}
            </Container>
        </Container>
    )
}

export default VerPlan
