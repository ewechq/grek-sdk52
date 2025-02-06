import { Stack } from "expo-router";

export default function MyKidsLayout(){
    return <Stack screenOptions={{headerShown:false}} >
        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen name="(add)/index" options={{headerShown:false}} />
    </Stack>
}