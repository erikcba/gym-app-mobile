import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'
import Plan from './views/Plan';
import VistaPlanes from './views/VistaPlanes';
import EnConstruccion from './views/EnConstruccion';
import { TouchableOpacity } from 'react-native';


const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const DashboardStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Dashboard"
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
                    title: "Mis entrenamientos"
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
                name="EnConstruccion"
                component={EnConstruccion}
                options={{
                    headerStyle: { backgroundColor: '#FAC710' },
                    headerTintColor: 'black',
                    statusBarColor: "#FAC710",
                    title: "En Construccion"
                }}
            />
        </Stack.Navigator>
    );
};

const PlanStack = () => {
    const navigation = useNavigation()
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Planes"
                component={VistaPlanes}
                options={{
                    headerStyle: { backgroundColor: '#FAC710' },
                    headerTintColor: 'black',
                    title: "Mis entrenamientos",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("DashboardTab")}>
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
                    title: "Plan de entrenamiento"
                }}
            />
            <Stack.Screen
                name="EnConstruccion"
                component={EnConstruccion}
                options={{
                    headerStyle: { backgroundColor: '#FAC710' },
                    headerTintColor: 'black',
                    title: "Calcular RM"
                }}
            />
        </Stack.Navigator>
    );
};

// Define el Tab Navigator
const AppTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="DashboardTab"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'DashboardTab') {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (route.name === 'EnConstruccion') {
                        iconName = focused ? 'calculator' : 'calculator-outline'
                    }

                    // Retorna el icono adecuado
                    return <Icon name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'black',
                tabBarStyle: { backgroundColor: '#FAC710' },
            })}
        >
            <Tab.Screen
                name="DashboardTab"
                component={DashboardStack}
                options={{ title: "Home", headerShown: false }}
            />
          
        </Tab.Navigator>
    );
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
                    name="MainApp"
                    component={AppTabs}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>

    )
}

export default AppNavigator