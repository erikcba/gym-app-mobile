import React from 'react'
import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'


export const Dashboard = () => {

  const navigation = useNavigation()

  return (
    <View className="bg-zinc-900 flex flex-col items-center justify-center w-full h-screen">
      <View className="flex items-center justify-center h-full w-full py-20 px-4">
        <Text className="bg-yellow-400 my-10 p-5 rounded-md font-bold text-2xl text-center w-full">Registra y monitorea tu entrenamiento de hoy!</Text>
        <View className="flex flex-col gap-4 h-full w-full">
          <TouchableOpacity onPress={()=> navigation.navigate("Planes")} className="bg-zinc-800 px-3 py-4 rounded flex flex-row items-center ">
            <Icon name="book-outline" size={25} color="#FAC710" />
            <Text className="text-left ml-2 font-semibold text-white">Plan de entrenamiento</Text>
            <Icon name="chevron-forward-outline" size={35} color="#808080" className="ml-auto"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> navigation.navigate("EnConstruccion")} className="bg-zinc-800 px-3 py-4 rounded flex flex-row items-center ">
            <Icon name="calculator-outline" size={25} color="#FAC710" />
            <Text className="text-left ml-2 font-semibold text-white">Calcular RM</Text>
            <Icon name="chevron-forward-outline" size={35} color="#808080"className="ml-auto" />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> navigation.navigate("EnConstruccion")} className="bg-zinc-800 px-3 py-4 rounded flex flex-row items-center ">
            <Icon name="bar-chart-outline" size={25} color="#FAC710" />
            <Text className="text-left ml-2 font-semibold text-white">Ver progreso</Text>
            <Icon name="chevron-forward-outline" size={35} color="#808080" className="ml-auto"/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}