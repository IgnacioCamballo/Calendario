import React from 'react'
import { View, StyleSheet, Text, ColorValue, TouchableOpacity } from 'react-native'
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

interface ButtonProps {
  text: string;
  color: ColorValue;
  icon: string
}

export default function BotonChico({ text, color, icon }: ButtonProps) {
  let customeStyle = {
    boton: {
      ...styles.boton,
      backgroundColor: color,
    }
  }

  return (
    <View style={customeStyle.boton}>
      <Icon 
        name={icon} 
        color="#000" 
        size={18}
      />
      <Text style={styles.texto}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  boton: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    width: "auto",
    borderRadius: 15,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 10,
    borderColor: "#BABABA",
    borderWidth: Platform.OS === "android" ? 1 : 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  texto: {
    fontSize: 20,
    fontWeight: "500",
    lineHeight: 20
  }
})