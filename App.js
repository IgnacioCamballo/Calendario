import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  FlatList, 
  Animated, 
  PanResponder
} from 'react-native';

let screenWidth = Dimensions.get("window").width
let screenHeight = Dimensions.get("window").height
let lenguage = "es"

export default function Calendar() {
  const [currentDay, setCurrentDay] = useState(new Date());
  const [monthdays, setMonthDays] = useState([])
  const position = useRef(new Animated.Value(0)).current

  let currentDate = new Date()
  let actualyear = new Date().getFullYear()
  
  //arreglo weekDays con los dias de la semana de lunes a domingo, idioma ajustable
  const weekdaysArray = [...Array(7).keys()]
  const intlWeekDay = new Intl.DateTimeFormat(lenguage, {weekday: "short"})
  const weekDays = weekdaysArray.map(weekDayIndex => {
    const weekDayName = intlWeekDay.format(new Date(2021, 10, weekDayIndex +1))
    return weekDayName
  })

  //arreglo months con los meses, idioma ajustable
  const monthsArray = [...Array(12).keys()]
  const intlMonth = new Intl.DateTimeFormat(lenguage, {month: "short"})
  const months = monthsArray.map(monthIndex => {
    const month = intlMonth.format(new Date(actualyear, monthIndex))
    return month
  })

  useEffect(() => {
    const today = new Date();
    setCurrentDay(today);
  }, []);

  useEffect(() => {
    const daysInMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1).getDay();
    const emptyCellsBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const isCurrentMonth = (currentDay.getFullYear(), currentDay.getMonth()) === (currentDate.getFullYear(), currentDate.getMonth());
    
    const days = [];

    for (let i = 1; i <= emptyCellsBefore; i++) {
      days.push({ 
        key: `-${i}`, 
        day: new Date(currentDay.getFullYear(), currentDay.getMonth(), 0 - (emptyCellsBefore - i)).getDate(), 
        isCurrentDay: false,
        shadowed: true
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isCurrentDay = i === currentDate.getDate() && isCurrentMonth;
      days.push({
        key: i.toString(),
        day: i,
        isCurrentDay
      });
    }

    for (let i = 1; i <= (42 - emptyCellsBefore - daysInMonth); i++) {
      days.push({ 
        key: (daysInMonth + i).toString(), 
        day: new Date(currentDay.getFullYear(), currentDay.getMonth(), daysInMonth + i).getDate(), 
        isCurrentDay: false,
        shadowed: true
      });
    }
    console.log(currentDay)
    setMonthDays(days);
  }, [currentDay])

  const renderItem = ({item}) => {
    const {day, key, isCurrentDay, shadowed} = item

    return (
      <TouchableOpacity
        key={key}
        style={shadowed ? styles.dayContainerEmpty : styles.dayContainer}
        onPress={() => handleDayPress(day)}
      >
        <Text style={shadowed ? styles.emptyDayText : [styles.dayText, isCurrentDay && styles.selectedDayText]}>{day}</Text>
      </TouchableOpacity>
    )
  }

  const handleDayPress = (day) => {
    
  };

  const prevMonth = () => {
    const newDatePrev = new Date(currentDay.getFullYear(), currentDay.getMonth() - 1);
    setCurrentDay(newDatePrev)

    Animated.timing(position, {
      toValue: screenWidth,
      duration: 100,
      useNativeDriver: false
    }).start(() => {
      position.setValue(-screenWidth)
      Animated.timing(position, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start()
    })
  };

  const nextMonth = () => {
    const newDateNext = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1);
    setCurrentDay(newDateNext)

    Animated.timing(position, {
      toValue: -screenWidth,
      duration: 100,
      useNativeDriver: false
    }).start(() => {
      position.setValue(screenWidth),
      Animated.timing(position, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start()
    })
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue(gestureState.dx)
      },
      onPanResponderRelease: (evt, gestureState) => {
        if(gestureState.dx > 150) {
          prevMonth();
        } else if(gestureState.dx < -150) {
          nextMonth();
        } else {
          position.setValue(0)
        }
      }
    })
  ).current

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.arrows}>
          <TouchableOpacity onPress={prevMonth}>
            <Text style={styles.arrow}>{'<-'}</Text>
          </TouchableOpacity>

          <Text style={styles.monthText}>{currentDay.toLocaleDateString('es-ES', { month: 'long' })}</Text>
          
          <TouchableOpacity onPress={nextMonth}>
            <Text style={styles.arrow}>{'->'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekDays}>
        {weekDays.map(day => 
          <View key={day} style={styles.textDayContainer}>
            <Text style={styles.textDayContainerText}>{day}</Text>
          </View>
        )}
      </View>

      <Animated.View 
        horizontal={true}
        scrollEnabled={true}
        style={[
          styles.daysContainer,
          {transform:[{translateX: position}]},
        ]}
        {...panResponder.panHandlers}
      >
        <FlatList
          scrollEnabled={false}
          data={monthdays}
          renderItem={renderItem}
          numColumns={7}
          keyExtractor={(item) => item.key}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 20,
    marginTop: 30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  arrows: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
    paddingHorizontal: 30
  },
  arrow: {
    fontSize: 20,
    paddingHorizontal: 10,
    justifyContent: "center"
  },
  textDayContainer: {
    width: (screenWidth - 40) / 7,
    alignItems: "center"
  },  
  textDayContainerText: {
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold"
  },
  weekDays: {
    flexDirection: "row",
    marginTop: 10
  },
  daysContainer: {
    flex: 1,
    marginTop: 5
  },
  dayContainer: {
    height: 100,
    width: (screenWidth - 40)/7,
    borderColor: "black",
    borderWidth: 0.5,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingTop: 1,
    paddingRight: 3
  },
  dayContainerEmpty: {
    width: (screenWidth - 40)/7,
    height: 100,
    backgroundColor: "#e1e1e1",
    borderColor: "grey",
    borderWidth: 0.5,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingTop: 1,
    paddingRight: 3
  },
  dayText: {
    fontSize: 10
  },
  emptyDayText: {
    fontSize: 10,
    color: "grey"
  },
  selectedDayText: {
    color: 'red',
  },
});

