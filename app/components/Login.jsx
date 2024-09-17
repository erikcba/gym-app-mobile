import {  signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { auth } from '../../firebaseConfig'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator  } from 'react-native'

export const Login = ({ navigation }) => {
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)


    const handleLogIn = async () => {
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setLoading(false)
            navigation.navigate("Dashboard")
        } catch (error) {
            console.error("Código de error:", error.code);
            console.error("Mensaje de error:", error.message);
            setError(error.message);
            setLoading(false)
        }
    }

    return (
        <View className="bg-zinc-900 flex flex-col justify-center items-center h-full w-full p-4">
            <View className="w-full text-center bg-zinc-800 p-4 rounded-md shadow-lg">
                <Text className="text-white text-2xl font-bold text-center mb-5 ">Inicia sesión</Text>
                <View className="flex flex-col gap-4">
                    <View className="flex flex-col gap-2 text-white">
                        <TextInput
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            keyboardType="email-address" 
                            autoCorrect={false}
                            placeholder="Correo electrónico"
                            placeholderTextColor="#A0AEC0"
                            autoCapitalize="none"
                            className="p-2 bg-zinc-800 rounded-sm border-b-2 border-yellow-500 text-center focus:outline-none focus:border-yellow-300 text-white"
                        />
                    </View>
                    <View className="flex flex-col gap-2 text-white">
                        <TextInput
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            placeholder="Contraseña"
                            placeholderTextColor="#A0AEC0"
                            secureTextEntry
                            autoCapitalize="none"
                            className="p-2 bg-zinc-800 rounded-sm border-b-2 border-yellow-500 text-center focus:outline-none focus:border-yellow-300 text-white"
                        />
                    </View>
                    {error && (
                        <Text className="text-red-500 font-semibold text-center">
                            Usuario o contraseña incorrectos
                        </Text>
                    )}
                    <TouchableOpacity
                        onPress={handleLogIn}
                        className="flex justify-center items-center gap-2 font-semibold font-lg pb-2 px-4 bg-yellow-400 rounded-md hover:bg-blue-700 "
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#242424" />
                        ) : (
                            <Text className="text-zinc-900">Iniciar sesión</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
