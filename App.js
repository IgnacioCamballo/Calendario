import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Animated,
  PanResponder,
  TouchableOpacity
} from 'react-native';
import Constants from "expo-constants"
import SwiftArrows from './components/SwiftArrows';

let screenWidth = Dimensions.get("window").width
let screenHeight = Dimensions.get("window").height
let lenguage = "es"

export default function Calendar() {
  const [currentDay, setCurrentDay] = useState(new Date());
  const [monthdays, setMonthDays] = useState([])
  const [position, setPosition] = useState(new Animated.Value(0))

  let currentDate = new Date()
  let actualyear = new Date().getFullYear()
  
  //weekDays array with days from monday to friday, adjustable lenguage
  const weekdaysArray = [...Array(7).keys()]
  const intlWeekDay = new Intl.DateTimeFormat(lenguage, {weekday: "short"})
  const weekDays = weekdaysArray.map(weekDayIndex => {
    const weekDayName = intlWeekDay.format(new Date(2021, 10, weekDayIndex +1))
    return weekDayName
  })

  //months array with months names
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

  // Takes currentDay that shows actual month and creates array with the days and past or post
  // days to create the calendar grid
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
        key: `${i}`,
        day: i,
        isCurrentDay,
        shadowed: false
      });
    }

    for (let i = 1; i <= (42 - emptyCellsBefore - daysInMonth); i++) {
      days.push({ 
        key: `${daysInMonth + i}`, 
        day: new Date(currentDay.getFullYear(), currentDay.getMonth(), daysInMonth + i).getDate(), 
        isCurrentDay: false,
        shadowed: true
      });
    }
    setMonthDays(days);
  }, [currentDay])

  //change first later of the text passed to uppercase
  function firstLetterUpper (text) {
    const result = text.replace(text[0], text[0].toUpperCase())
    return result
  }

  //Item to render on each day of the calendar
  const renderItem = (item) => {
    const {day, key, isCurrentDay, shadowed} = item
    
    return (
      <TouchableOpacity key={key} style={shadowed ? styles.dayContainerEmpty : styles.dayContainer}>
        <Text style={shadowed ? styles.emptyDayText : [styles.dayText, isCurrentDay && styles.selectedDayText]}>{day.toLocaleString()}</Text>
      </TouchableOpacity>
    )
  }

  const prevMonth = () => {
    const newDate = new Date(currentDay.getFullYear(), currentDay.getMonth() - 1);

    Animated.timing(position, {
      toValue: screenWidth,
      duration: 100,
      useNativeDriver: false
    }).start(() => {
      setCurrentDay(newDate)
      Animated.timing(position, {
        toValue: -screenWidth,
        duration: 0,
        useNativeDriver: false
      }).start(() => {
        Animated.timing(position, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false
        }).start()
      })
    })
  };

  const nextMonth = () => {
    const newDate = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1);

    Animated.timing(position, {
      toValue: -screenWidth,
      duration: 100,
      useNativeDriver: false
    }).start(() => {
      setCurrentDay(newDate)
      Animated.timing(position, {
        toValue: screenWidth,
        duration: 0,
        useNativeDriver: false
      }).start(() => {
        Animated.timing(position, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false
        }).start()
      })
    })
  };

  const panResponder =
  PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      position.setValue(gestureState.dx)
    },
    onPanResponderRelease: (evt, gestureState) => {
      if(gestureState.dx > 80) {
        prevMonth();
      } else if(gestureState.dx < -80) {
        nextMonth();
      } else {
        position.setValue(0)
      }
    }
  })

  return (
    <View style={styles.container}>
      <SwiftArrows 
        leftAction={prevMonth} 
        text={`${firstLetterUpper(currentDay.toLocaleDateString('es-ES', { month: 'long' }))}`}
        rightAction={nextMonth} 
      />

      <View style={styles.weekDays}>
        {weekDays.map(day => 
          <View key={day} style={styles.textDayContainer}>
            <Text style={styles.textDayContainerText}>{day}</Text>
          </View>
        )}
      </View>

      <Animated.ScrollView 
        style={[
          {transform:[{translateX: position}]}]
        }
        {...panResponder.panHandlers}
      >
        <View style={styles.daysContainer}>
          {monthdays.map(monthDay => renderItem(monthDay))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 10,
    marginTop: 40
  },
  textDayContainer: {
    height: 20,
    width: (screenWidth - 20) / 7,
    alignItems: "center"
  },  
  textDayContainerText: {
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold"
  },
  weekDays: {
    flexDirection: "row",
    marginTop: 10,
    height: 20
  },
  daysContainer: {
    flex: 1,
    marginTop: 5,
    width: screenWidth - 20,
    flexDirection: "row", 
    flexWrap: "wrap"
  },
  dayContainer: {
    height: (screenHeight - Constants.statusBarHeight - 130)/6,
    width: (screenWidth - 20)/7,
    borderColor: "#000",
    borderWidth: 0.5
  },
  dayContainerEmpty: {
    width: (screenWidth - 20)/7,
    height: (screenHeight - Constants.statusBarHeight - 130)/6,
    backgroundColor: "#e1e1e1",
    borderColor: "grey",
    borderWidth: 0.5    
  },
  dayText: {
    position: "absolute",
    top: 1,
    right: 3,
    fontSize: 12
  },
  emptyDayText: {
    position: "absolute",
    top: 1,
    right: 3,
    fontSize: 12,
    color: "grey"
  },
  selectedDayText: {
    color: "red",
  },
  coloredShiftBox: {
    flex:1,
    alignItems: "center",
    justifyContent: "center"
  },
  coloredShiftText: {
    color: "black",
    fontSize: 18,
    fontWeight: "400"
  }
});