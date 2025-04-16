import { View, Text } from 'react-native'
import React from 'react'
import Test from '../components/Test'
import "../../global.css"

const index = () => {
  return (
    <View>
      <Text className='color-red-400'>Test</Text>
      <Test/> 
    </View>
  )
}

export default index