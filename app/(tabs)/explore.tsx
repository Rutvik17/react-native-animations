import { Button, StyleSheet, TextProps } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MotiView } from 'moti';
import { useState } from 'react';

type TickerListProps = {
  number: number;
  fontSize: number;
  index: number;
};

const numbersToNice = [...Array(10).keys()]

function Tick({ children, fontSize, style, ...rest }: TextProps & {
  fontSize: number,
}) {
  return (
    <ThemedText {...rest} style={[style, {
      fontSize,
      lineHeight: fontSize * 1.1,
      fontVariant: ['tabular-nums'],
      fontWeight: '900',
    }]}>
      {children}
    </ThemedText>
  )
}

function TickerList({ number, fontSize, index }: TickerListProps) {
  const _stagger = 50;
  return (
    <ThemedView style={[styles.tickerListContainer, { height: fontSize }]}>
      <MotiView
        animate={{
          translateY: -fontSize * 1.1 * number
        }}
        transition={{
          delay: index * _stagger,
          damping: 80,
          stiffness: 200,
        }}
      >
        {numbersToNice.map((num, index) => {
          return (
            <Tick key={`number-${num}-index-${index}`}
              fontSize={fontSize}
            >
              {num}
            </Tick>
          )
        })}
      </MotiView>
    </ThemedView >
  )
}

function Ticker({ value, fontSize }: { value: number, fontSize: number }) {
  const intNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
  const splitValue = intNumber.toString().split('');
  const [newFontSize, setNewFontSize] = useState(fontSize);
  return (
    <ThemedView>
      <Tick
        fontSize={fontSize}
        numberOfLines={1}
        adjustsFontSizeToFit
        onTextLayout={(e) => {
          setNewFontSize(e.nativeEvent.lines[0].ascender)
        }}
        style={{
          position: 'absolute',
          left: 1000000,
          top: 1000000,
        }}
      >
        {intNumber}
      </Tick>
      <ThemedView style={styles.ticker}>
        {splitValue.map((number, index) => {
          if (!isNaN(parseInt(number))) {
            return (
              <TickerList
                number={parseInt(number)}
                fontSize={newFontSize}
                index={index}
                key={index}
              />
            )
          }
          return (
            <Tick
              key={index}
              fontSize={newFontSize}
              style={{ opacity: 0.2 }}
            >
              {number}
            </Tick>
          )
        })}
      </ThemedView>
    </ThemedView>
  )
}

export default function TabTwoScreen() {
  const fontSize = 100;
  const [value, setValue] = useState(100);
  return (
    <ThemedView style={styles.container}>
      <Ticker value={value} fontSize={fontSize} />
      <Button title='random value' onPress={() => setValue(Math.floor(Math.random() * 1000))} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tickerListContainer: {
    overflow: 'hidden',
  }
});
