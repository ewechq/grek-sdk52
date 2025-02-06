import { Stack } from "expo-router";

export default function ProfileLayout(){
    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen 
                name="index"
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="cards/index"
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="edit/index"
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="mykids"
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="tickets/index"
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="tickets/[id]/index"
                options={{ headerShown: false }}
            />
        </Stack>
    )
}