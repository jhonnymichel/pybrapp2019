import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Animated, Easing, Text, TouchableOpacity} from 'react-native';
import styles, {yellow, white, tropical} from 'app/styles';

const FavoriteButton = React.memo(({active, onPress, isChanging, style}) => {
  const [scaleAnimation] = React.useState(new Animated.Value(1));
  const texts = {
    active: 'Remover de sua lista',
    notActive: 'Adicionar a sua lista',
  };

  const [text, setText] = React.useState(
    active ? texts.active : texts.notActive,
  );

  React.useEffect(() => {
    Animated.timing(scaleAnimation, {
      toValue: active ? 1.5 : 1,
      duration: 200,
      easing: Easing.bezier(0.16, 0.53, 0.06, 1.36),
      useNativeDriver: true,
    }).start();
    if (!isChanging) {
      setText(active ? texts.active : texts.notActive);
    }
  }, [active]);

  React.useEffect(() => {
    if (!isChanging) {
      setText(active ? texts.active : texts.notActive);
    }
  }, [isChanging]);

  return (
    <TouchableOpacity
      disabled={isChanging}
      onPress={onPress}
      style={[
        style || styles.swipe.rightSwipeItem,
        {
          backgroundColor: active ? yellow : tropical,
        },
      ]}
    >
      <Text style={{...styles.swipe.text}}>{text}</Text>
      <Animated.View style={{transform: [{scale: scaleAnimation}]}}>
        <Ionicons name="ios-bookmark" color={white} size={30} />
      </Animated.View>
    </TouchableOpacity>
  );
});

export default FavoriteButton;
