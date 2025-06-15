import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, { clamp, FadeIn, FadeOut, interpolate, interpolateColor, runOnJS, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const images = [
  'https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=1200x1200',
  'https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=1200x1200'
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('screen');
  const _itemSize = width * .24;
  const _spacing = 12;
  const _itemTotalSize = _itemSize + _spacing;

  const scrollX = useSharedValue(0);

  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = clamp(e.contentOffset.x / _itemTotalSize, 0, images.length - 1);
    const newActiveIndex = Math.round(scrollX.value);
    if (newActiveIndex !== activeIndex) {
      runOnJS(setActiveIndex)(newActiveIndex);
    }
  })

  function CarouselItem({ imageUri, index, scrollX }: { imageUri: string, index: number, scrollX: SharedValue<number> }) {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        borderWidth: 1,
        borderColor: interpolateColor(
          scrollX.value,
          [index - 1, index, index + 1],
          [
            '#bbacc1',
            Colors[colorScheme ?? 'light'].border,
            '#bbacc1'
          ]
        ),
        transform: [
          {
            translateY: interpolate(
              scrollX.value,
              [index - 1, index, index + 1],
              [_itemSize / 3, 0, _itemSize / 3]
            ),
          }
        ]
      };
    })
    return (
      <Animated.View style={[animatedStyle,
        {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          width: _itemSize,
          height: _itemSize,
          borderRadius: _itemSize / 2,
        }]}>
        <Image
          source={{ uri: imageUri }}
          style={{ flex: 1, borderRadius: _itemSize / 2 }}
        />
      </Animated.View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[StyleSheet.absoluteFillObject]}>
        <Animated.Image
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          key={`image-${activeIndex}`}
          source={{ uri: images[activeIndex] }}
          style={[styles.image]}
        />
      </ThemedView>
      <Animated.FlatList
        data={images}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item, index }) => {
          return (
            <CarouselItem
              imageUri={item}
              index={index}
              scrollX={scrollX}
            />
          )
        }}
        style={styles.flatList}
        contentContainerStyle={{
          paddingHorizontal: (width - _itemSize) / 2,
          height: _itemSize * 2,
          gap: _spacing
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={_itemTotalSize}
        decelerationRate={'fast'}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  flatList: {
    flexGrow: 0,
  },
  image: {
    flex: 1,
  }
});
