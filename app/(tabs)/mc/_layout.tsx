import { Stack } from "expo-router";

export default function MasterClassLayout(){
    return <Stack screenOptions={{headerShown:false}} >
        <Stack.Screen name="index" options={{headerShown:false}} />
    </Stack>
}