import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'
import Plan from './views/Plan'
import VistaPlanes from './views/VistaPlanes'
import EnConstruccion from './views/EnConstruccion'
import { TouchableOpacity } from 'react-native'
import DetalleEjercicio from './views/DetalleEjercicio'


const Stack = createNativeStackNavigator()

const DashboardStack = () => {
    const navigation = useNavigation()

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Dashboardpage"
                component={Dashboard}
                options={{
                    headerStyle: { backgroundColor: '#FAC710' },
                    headerTintColor: 'black',
                    statusBarColor: "#FAC710",
                    title: "Menu principal"
                }}
            />
            <Stack.Screen
                name="Planes"
                component={VistaPlanes}
                options={{
                    headerStyle: { backgroundColor: '#FAC710' },
                    headerTintColor: 'black',
                    statusBarColor: "#FAC710",
                    title: "Mis entrenamientos",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                            <Icon name="arrow-back" size={24} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen
                name="Plan"
                component={Plan}
                options={{
                    headerStyle: { backgroundColor: '#FAC710' },
                    headerTintColor: 'black',
                    statusBarColor: "#FAC710",
                    title: "Plan de entrenamiento"
                }}
            />
            <Stack.Screen
                name="DetalleEjercicio"
                component={DetalleEjercicio}
                options={{
                    headerStyle: { backgroundColor: '#FAC710' },
                    headerTintColor: 'black',
                    statusBarColor: "#FAC710",
                    title: "Detalle de ejercicio"
                }}
            />
            <Stack.Screen
                name="EnConstruccion"
                component={EnConstruccion}
                options={{
                    headerStyle: { backgroundColor: '#FAC710' },
                    headerTintColor: 'black',
                    statusBarColor: "#FAC710",
                    title: "En Construcción"
                }}
            />
        </Stack.Navigator>
    )
}

export const AppNavigator = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false, statusBarColor: "#1A1A1A" }}
                />
                <Stack.Screen
                    name="Dashboard"
                    component={DashboardStack}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator