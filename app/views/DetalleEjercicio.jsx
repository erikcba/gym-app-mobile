import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const Container = styled(View)
const Heading = styled(Text)

const DetalleEjercicio = ({ route }) => {
    const { exercise } = route.params
    const [exerciseReps, setExerciseReps] = useState({})
    const [exercisePeso, setExercisePeso] = useState({})


    const handleRepsChange = (setIndex, value) => {
        setExerciseReps(prevState => ({
            ...prevState,
            [setIndex]: value,
        }))
    }
    const handlePesoChange = (setIndex, value) => {
        setExercisePeso(prevState => ({
            ...prevState,
            [setIndex]: value,
        }))
    }

    const guardarSeries = () => {
        console.log(exerciseReps)
        console.log(exercisePeso)
    }

    return (
        <Container className=" bg-zinc-900 min-h-screen w-full flex flex-col  justify-center mt-auto">
            <View className="w-full flex flex-col justify-center items-center mt-4 p-4">

                <View className="flex flex-col gap-4 bg-zinc-800  p-4 m-4 w-full rounded-md shadow-lg bg-">
                    <Heading className="text-yellow-400 text-3xl font-bold text-center">
                        {exercise.name}
                    </Heading>
                    <View className=" flex flex-col items-center justify-center">
                        <View className="flex flex-row justify-center items-center mb-4 gap-7 w-full">
                            <Text className="font-bold text-gray-400 text-center ">Repeticiones</Text>
                            <Text className="font-bold text-gray-400 text-center ">Peso</Text>
                        </View>

                        {Array.from({ length: exercise.sets }).map((_, index) => (
                            <View key={index} className="mb-4 flex flex-row justify-center items-center gap-4">
                                <TextInput
                                    onChangeText={handleRepsChange.bind(this, index)}
                                    placeholder={`Sugerido: ${exercise.reps}`}
                                    className="py-2 px-3 bg-zinc-700 rounded-lg text-yellow-400 text-center font-semibold"
                                    keyboardType="numeric"
                                    value={exerciseReps[index] || ""}
                                />
                                <TextInput
                                    onChangeText={handlePesoChange.bind(this, index)}
                                    placeholder={`Peso `}
                                    className="p-2 bg-zinc-700 rounded-lg text-center font-semibold text-yellow-400"
                                    keyboardType="numeric"
                                    value={exercisePeso[index] || ""}
                                />
                            </View>
                        ))}
                        <TouchableOpacity onPress={guardarSeries} className="bg-yellow-400 my-2 p-3 rounded-lg">
                            <Text className="font-semibold text-center text-zinc-900">
                                Guardar series
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


        </Container>
    )
}

export default DetalleEjercicio
