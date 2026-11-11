import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

type Props = { region?: 'bahamas' | 'open-caribbean' | 'gulf' | 'coast' | 'storm' };

const PALETTES = {
  bahamas: { base:'#19aeb7', deep:'#087e9b', light:'#75d9c8', foam:'#d1f5df', current:'#36c1bd' },
  'open-caribbean': { base:'#087f9e', deep:'#075675', light:'#27a6b2', foam:'#a9e5dc', current:'#168da5' },
  gulf: { base:'#238f91', deep:'#126c79', light:'#64c9b6', foam:'#c4eadb', current:'#43aaa0' },
  coast: { base:'#42c2b6', deep:'#168b98', light:'#9be0c5', foam:'#e0f6d9', current:'#65cbb9' },
  storm: { base:'#174d70', deep:'#102f53', light:'#367c91', foam:'#b5d7d2', current:'#285d7b' },
};

const AnimatedView = Animated.View;

function WaveTile({ light, foam }: { light: string; foam: string }) {
  return <Svg width={320} height={180} viewBox="0 0 320 180">
    <Path d="M0 26h24v4h20v4h-16v4H8v-4H0z M92 72h28v4h16v4h-20v4H96v-4h-8z M214 34h20v4h24v4h-28v4h-16z M270 118h28v4h14v4h-18v4h-24z" fill={light} opacity=".8"/>
    <Path d="M20 48h32v4H32v4H16z M146 108h40v4h-24v4h-20z M230 82h28v4h-20v4h-16z M62 148h20v4H66v4H54z" fill={foam} opacity=".72"/>
    <Path d="M8 94h18v3H8z M112 18h14v3h-14z M188 154h20v3h-20z M286 58h16v3h-16z" fill={light} opacity=".55"/>
    <Path d="M42 120h26v3H42z M164 50h22v3h-22z M250 162h24v3h-24z" fill={foam} opacity=".42"/>
  </Svg>;
}

function CurrentTile({ color }: { color: string }) {
  return <Svg width={420} height={230} viewBox="0 0 420 230">
    <Path d="M-20 65 C55 20 100 115 180 72 S300 30 450 85 M-30 150 C55 105 120 190 210 145 S340 115 450 160" fill="none" stroke={color} strokeWidth="5" strokeDasharray="34 22" opacity=".28"/>
    <Path d="M-20 84 C50 42 108 132 184 91 S310 52 450 105 M-30 169 C52 126 125 206 215 164 S345 135 450 181" fill="none" stroke={color} strokeWidth="2" strokeDasharray="18 26" opacity=".35"/>
  </Svg>;
}

export default function OceanRenderer({ region = 'open-caribbean' }: Props) {
  const palette = PALETTES[region];
  const slow = useRef(new Animated.Value(0)).current;
  const medium = useRef(new Animated.Value(0)).current;
  const current = useRef(new Animated.Value(0)).current;
  const wake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loops = [
      Animated.loop(Animated.timing(slow, { toValue: 1, duration: 26000, easing: Easing.linear, useNativeDriver: true })),
      Animated.loop(Animated.timing(medium, { toValue: 1, duration: 17000, easing: Easing.linear, useNativeDriver: true })),
      Animated.loop(Animated.timing(current, { toValue: 1, duration: 42000, easing: Easing.linear, useNativeDriver: true })),
      Animated.loop(Animated.sequence([
        Animated.timing(wake, { toValue: 1, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wake, { toValue: 0, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])),
    ];
    loops.forEach(a => a.start());
    return () => loops.forEach(a => a.stop());
  }, [slow, medium, current, wake]);

  const slowX = slow.interpolate({ inputRange:[0,1], outputRange:[0,-320] });
  const mediumX = medium.interpolate({ inputRange:[0,1], outputRange:[-320,0] });
  const currentX = current.interpolate({ inputRange:[0,1], outputRange:[0,-420] });
  const wakeOpacity = wake.interpolate({ inputRange:[0,1], outputRange:[.42,.9] });
  const wakeScale = wake.interpolate({ inputRange:[0,1], outputRange:[.88,1.08] });

  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.base, overflow:'hidden' }]}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.base }]} />
    <View style={[styles.depth, { backgroundColor: palette.deep, opacity:.35 }]} />
    <AnimatedView style={[styles.currentLayer, { transform:[{ translateX: currentX }] }]}>
      <CurrentTile color={palette.current}/>
      <CurrentTile color={palette.current}/>
    </AnimatedView>
    <AnimatedView style={[styles.waveLayer, { top:'32%', transform:[{ translateX: slowX }] }]}>
      <WaveTile light={palette.light} foam={palette.foam}/><WaveTile light={palette.light} foam={palette.foam}/>
      <WaveTile light={palette.light} foam={palette.foam}/>
    </AnimatedView>
    <AnimatedView style={[styles.waveLayer, { top:'55%', transform:[{ translateX: mediumX }] }]}>
      <WaveTile light={palette.light} foam={palette.foam}/><WaveTile light={palette.light} foam={palette.foam}/>
      <WaveTile light={palette.light} foam={palette.foam}/>
    </AnimatedView>
    <AnimatedView style={[styles.waveLayer, { top:'77%', transform:[{ translateX: slowX }] }]}>
      <WaveTile light={palette.light} foam={palette.foam}/><WaveTile light={palette.light} foam={palette.foam}/>
      <WaveTile light={palette.light} foam={palette.foam}/>
    </AnimatedView>
    <AnimatedView style={[styles.wake, { opacity:wakeOpacity, transform:[{ scaleX:wakeScale }] }]}>
      <Svg width="100%" height="100%" viewBox="0 0 180 250">
        <Path d="M90 4 C84 42 58 68 25 105 C8 124 14 149 42 168 C58 181 70 204 90 244 C110 204 122 181 138 168 C166 149 172 124 155 105 C122 68 96 42 90 4Z" fill={palette.foam} opacity=".2"/>
        <Path d="M88 20 C82 65 54 94 38 120 C25 141 46 154 61 171 M92 20 C98 65 126 94 142 120 C155 141 134 154 119 171" fill="none" stroke={palette.foam} strokeWidth="5" strokeDasharray="13 9" opacity=".8"/>
        <Path d="M86 58l-8 10 7 5 M94 58l8 10-7 5 M56 150l-8 8 11 4 M124 150l8 8-11 4" fill="none" stroke={palette.foam} strokeWidth="4"/>
      </Svg>
    </AnimatedView>
    <View style={[styles.pixelGlints, { backgroundColor:'transparent' }]}>
      {Array.from({length:18},(_,i)=><View key={i} style={{position:'absolute',left:(i*53)%100+'%',top:(i*71)%100+'%',width:i%3===0?5:3,height:3,backgroundColor:i%2?palette.light:palette.foam,opacity:.38}}/>)}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  depth:{...StyleSheet.absoluteFillObject, top:'25%'},
  currentLayer:{position:'absolute',left:0,top:'27%',width:840,height:230,flexDirection:'row'},
  waveLayer:{position:'absolute',left:0,width:960,height:180,flexDirection:'row'},
  wake:{position:'absolute',width:'48%',height:'35%',left:'26%',top:'61%',alignItems:'center'},
  pixelGlints:{...StyleSheet.absoluteFillObject},
});
