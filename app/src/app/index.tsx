import { View, Text } from 'react-native'
import React from 'react'
import "../../global.css"
import { BarChart } from 'react-native-chart-kit'

const index = () => {
  return (
    <View className='flex-1 items-center bg-white'>
      <Text className='color-red-400 font-bold text-3xl'>Budget Buddy</Text>
    </View>
  )
}

export default index