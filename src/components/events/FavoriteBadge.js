import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, Animated} from 'react-native';
import styles, {yellow} from 'app/styles';

const FavoriteBadge = ({isFavorite}) => {
  const [fade] = React.useState(new Animated.Value(0));
  const isFirstRender = React.useRef({value: true});

  React.useLayoutEffect(() => {
    let duration = 200;
    if (isFirstRender.current.value) {
      duration = 0;
      isFirstRender.current.value = false;
    }

    Animated.timing(fade, {
      toValue: Number(isFavorite),
      duration,
      delay: duration,
      useNativeDriver: true,
    }).start();
  }, [isFavorite]);
  return (
    <Animated.View style={{marginLeft: 'auto', opacity: fade}}>
      <View style={styles.eventDetails.badge}>
        <Ionicons name="ios-bookmark" size={30} color={yellow} />
      </View>
    </Animated.View>
  );
};

export default FavoriteBadge;
