import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, Button, ScrollView } from 'react-native'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "../../firebaseConfig"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"
import { styled } from 'nativewind'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Container = styled(View)
const Heading = styled(Text)
const SubHeading = styled(Text)
const Table = styled(View)
const TableRow = styled(View)
const TableCell = styled(View)

const VerPlan = ({ route }) => {
    const [userId, setUserId] = useState("")
    const [nombrePlan, setNombrePlan] = useState("")
    const [day, setDay] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const { dayId, dayName } = route.params

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

    return (
        <ScrollView className=" bg-zinc-800" >
            <Container className="items-center justify-start rounded-md bg-zinc-800 p-5 my-5 min-h-screen">
                <Container className="items-center justify-center gap-5 w-full">

                    {loading ? (
                        <Container className="items-center justify-center gap-2">
                            <Text className="text-lg font-semibold text-center text-white">Cargando</Text>
                            <ActivityIndicator size="large" color="#ffffff" />
                        </Container>
                    ) : day ? (

                        <Container className="w-full" key={dayId}>
                            <SubHeading className="text-lg font-semibold text-center text-zinc bg-yellow-400 rounded-md p-2">
                                {day.name}
                            </SubHeading>
                            <Table className="mt-4">
                                <TableRow className="bg-zinc-900 text-white py-4 flex-row justify-between ">
                                    <TableCell className="px-4 py-2 text-center"><Text className="text-white">Ejercicio</Text></TableCell>
                                    <TableCell className="px-4 py-2 text-center"><Text className="text-white">Series</Text></TableCell>
                                    <TableCell className="px-4 py-2 text-center"><Text className="text-white">Repeticiones</Text></TableCell>
                                    <TableCell className="px-4 py-2 text-center"><Text className="text-white">Anotaciones</Text></TableCell>
                                </TableRow>
                                {day.exercises.map((exercise, exerciseIndex) => (
                                    <TableRow className={`${exerciseIndex % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-700'} flex-row items-center justify-around`} key={exerciseIndex}>
                                        <TableCell className="px-4 py-2 w-1/3"><Text className="text-center text-white">{exercise.name}</Text></TableCell>
                                        <TableCell className="px-4 py-2 w-1/4"><Text className="text-center text-white">{exercise.sets}</Text></TableCell>
                                        <TableCell className="px-4 py-2 w-1/4"><Text className="text-center text-white">{exercise.reps}</Text></TableCell>
                                        <TableCell className="px-4 py-2 w-1/4">
                                            <Button title="+" onPress={() => { }} color="#444" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </Container>

                    ) : (
                        <Text className="text-lg font-semibold text-center text-white">No hay plan para mostrar</Text>
                    )}
                </Container>
            </Container>
        </ScrollView>
    )
}

export default VerPlan
