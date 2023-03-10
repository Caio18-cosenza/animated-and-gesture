import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import {
  GestureHandlerRootView,
  TextInput,
  PanGestureHandler,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  Easing,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ContextGestureProps = {
  startY: number;
};

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

export default function App() {
  // 0 => -80
  const buttonTranslateY = useSharedValue(0);
  // 1 => 2
  const buttonScale = useSharedValue(1);

  const gesture = useAnimatedGestureHandler({
    onStart(event, context: ContextGestureProps) {
      if (event.translationY <= 0 && event.translationY >= -80) {
        context.startY = buttonTranslateY.value;
      }
    },
    onActive(event, context) {
      if (event.translationY <= 0 && event.translationY >= -80) {
        buttonTranslateY.value = event.translationY + context.startY;
        buttonScale.value =
          buttonScale.value !== 1 ? buttonScale.value - 0.5 : 1;
      }
      buttonScale.value = buttonScale.value !== 1 ? buttonScale.value - 0.5 : 1;
    },
    onEnd(event, context) {
      buttonTranslateY.value = withSpring(0);
    },
  });

  const onPressIn = () => {
    buttonScale.value = withTiming(2, { easing: Easing.ease });
  };

  const onPressOut = () => {
    buttonScale.value = withTiming(1, { easing: Easing.ease });
  };

  const animatedStyleGesture = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: buttonTranslateY.value,
        },
      ],
    };
  });

  const animatedScale = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: buttonScale.value,
        },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style='light' backgroundColor='#333' translucent />
      <View style={{ width: '100%', height: 62, backgroundColor: '#222' }} />
      <View style={{ flex: 1 }} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <TextInput
          placeholder='Mensagem'
          placeholderTextColor={'#ddd'}
          style={{
            backgroundColor: '#222',
            height: 50,
            paddingLeft: 10,
            borderRadius: 50,
            width: '80%',
            marginBottom: 5,
          }}
          editable={false}
          enabled={false}
        />
        <PanGestureHandler onGestureEvent={gesture}>
          <PressableAnimated
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[
              {
                width: '15%',
                height: 55,
                borderRadius: 40,
                backgroundColor: '#36802e',
                marginLeft: 10,
                marginBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              },
              animatedStyleGesture,
              animatedScale,
            ]}
          >
            <MaterialCommunityIcons name='microphone' size={26} color='white' />
          </PressableAnimated>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 22,
  },
});
