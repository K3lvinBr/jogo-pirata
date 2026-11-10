import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

const EQUIPMENT = [
  { icon: '🪖', name: 'Capacete' }, { icon: '🏴‍☠️', name: 'Chapéu' },
  { icon: '🧥', name: 'Casaco' }, { icon: '⚔️', name: 'Arma 1' },
  { icon: '⚙️', name: 'Leme' }, { icon: '🥾', name: 'Bota' },
  { icon: '🧤', name: 'Luva' }, { icon: '⚔️', name: 'Arma 2' },
  { icon: '🛶', name: 'Proa' }, { icon: '💍', name: 'Anel' },
  { icon: '📿', name: 'Colar' }, { icon: '🧿', name: 'Talismã' },
];
const NAV = [
  { icon: '🗺️', label: 'MAPA MUNDI' },
  { icon: '⚔️', label: 'COMBATE' },
  { icon: '⚓', label: 'MEU NAVIO' },
  { icon: '⚙️', label: 'MELHORIAS' },
];

function OceanScene() {
  return <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
    <Defs>
      <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#64d0e6"/><Stop offset="1" stopColor="#a5e7e8"/></LinearGradient>
      <LinearGradient id="water" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#20aebc"/><Stop offset=".42" stopColor="#078da6"/><Stop offset="1" stopColor="#006b8b"/></LinearGradient>
    </Defs>
    <Rect width="390" height="844" fill="url(#sky)"/>
    <Path d="M0 275 Q70 266 130 274 T260 270 T390 276 L390 844 L0 844Z" fill="url(#water)"/>
    <Path d="M0 277 Q55 273 110 277 T220 275 T330 277 T390 275" stroke="#d3f5e9" strokeWidth="2" fill="none" opacity=".65"/>
    <Path d="M0 165 Q34 149 69 163 Q89 145 115 160 Q141 151 160 167Z" fill="#e0f5e9" opacity=".38"/>
    <Path d="M270 224 Q294 208 319 220 Q342 205 367 220 Q381 216 390 224Z" fill="#e7f8ef" opacity=".42"/>
    <Path d="M0 430 Q56 408 103 428 Q143 447 184 426 Q223 409 268 430 L220 465 Q153 456 113 481 L0 475Z" fill="#087d9d" opacity=".42"/>
    <Path d="M80 568 Q145 532 199 554 Q255 573 310 552 L390 573 L390 630 Q315 606 250 625 Q170 643 100 614Z" fill="#006b91" opacity=".32"/>
    {Array.from({length: 36}, (_, i) => {
      const x = (i * 67 + 19) % 390, y = 290 + ((i * 83) % 535), w = 7 + (i % 5) * 3;
      return <Path key={i} d={'M' + x + ' ' + y + ' l' + w + ' -1'} stroke={i % 3 === 0 ? '#9ce7db' : '#55c9ca'} strokeWidth={i % 4 === 0 ? 2 : 1} opacity={.28 + (i % 4) * .08}/>;
    })}
    <g opacity=".75" transform="translate(325 300)"><Path d="M0 10 L29 10 L24 18 L4 18Z" fill="#76563d" stroke="#4c3b31" strokeWidth="2"/><Path d="M12 9 L12 -8 L20 8Z" fill="#e8d6a7" stroke="#795b3c"/><Path d="M12 -8 L12 8 L3 7Z" fill="#c7d8c7" stroke="#795b3c"/><Path d="M10 -11 L10 -17" stroke="#523d30" strokeWidth="2"/></g>
    <g opacity=".82" transform="translate(286 450)"><Path d="M0 17 L43 17 L35 28 L8 28Z" fill="#79533b" stroke="#4a352b" strokeWidth="2"/><Path d="M19 16 L19 -17 L36 15Z" fill="#ead8aa" stroke="#78583b" strokeWidth="2"/><Path d="M18 -13 L18 15 L4 14Z" fill="#e9e1c7" stroke="#78583b"/><Path d="M18 -20 L18 -29" stroke="#523b2c" strokeWidth="3"/></g>
  </Svg>;
}

function ShipArt() {
  return <Svg width="100%" height="100%" viewBox="0 0 150 230">
    <Path d="M75 8 L75 190" stroke="#4b3328" strokeWidth="7"/>
    <Path d="M73 26 Q48 30 25 40 L29 126 Q51 118 73 128Z" fill="#e7d5a6" stroke="#8c6b42" strokeWidth="4"/>
    <Path d="M77 26 Q102 30 125 40 L121 126 Q99 118 77 128Z" fill="#dfc99a" stroke="#8c6b42" strokeWidth="4"/>
    <Path d="M75 39 L75 116" stroke="#8a6040" strokeWidth="3"/>
    <Path d="M46 68 Q58 54 72 67 Q89 53 103 69 L93 93 L75 106 L56 91Z" fill="#9b3c36" opacity=".9"/>
    <Path d="M75 108 L75 166" stroke="#563b2c" strokeWidth="5"/>
    <Path d="M37 126 L113 126 L108 187 Q98 211 75 225 Q52 211 42 187Z" fill="#795137" stroke="#3e2d25" strokeWidth="5"/>
    <Path d="M45 137 L105 137 M44 153 L106 153 M47 170 L103 170 M52 187 L98 187" stroke="#bd8a50" strokeWidth="4"/>
    <Path d="M53 137 L53 184 M97 137 L97 184" stroke="#3e2b24" strokeWidth="3"/>
    <Rect x="62" y="159" width="26" height="22" rx="3" fill="#263b3a" stroke="#d2a66b" strokeWidth="3"/>
    <Path d="M75 8 L65 27 L85 27Z" fill="#5a4030"/>
    <Path d="M43 196 Q20 174 8 154 M107 196 Q130 174 142 154" stroke="#d8f8e9" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".95"/>
    <Path d="M51 207 Q30 194 20 181 M99 207 Q120 194 130 181" stroke="#a4e7e5" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </Svg>;
}

function PanelButton({ children, onPress, style, active }: any) {
  return <Pressable onPress={onPress} style={[styles.panelButton, active && styles.activeButton, style]}>{children}</Pressable>;
}

export default function App() {
  const { width, height } = useWindowDimensions();
  const gameWidth = Math.min(width, height * 0.5625, 480);
  const gameHeight = gameWidth / 0.5625;
  const [gold, setGold] = useState(15200);
  const [wood, setWood] = useState(480);
  const [iron, setIron] = useState(210);
  const [level] = useState(3);
  const [selected, setSelected] = useState('MEU NAVIO');
  const [selectedGear, setSelectedGear] = useState(-1);
  const [chestOpen, setChestOpen] = useState(false);
  const [toast, setToast] = useState('30 OUT, 12:45');
  const [helmTurn, setHelmTurn] = useState(0);
  const [cannonFire, setCannonFire] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setToast(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })), 60000);
    return () => clearInterval(timer);
  }, []);

  const message = (value: string) => {
    setToast(value);
    setTimeout(() => setToast(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })), 2200);
  };
  const handleNav = (label: string) => {
    setSelected(label);
    if (label !== 'MEU NAVIO') message(label + ' selecionado');
  };
  const fireCannons = () => {
    setCannonFire(true);
    setIron(v => Math.max(0, v - 1));
    message('💥 CANHÕES DISPARADOS!');
    setTimeout(() => setCannonFire(false), 500);
  };

  return <View style={styles.root}>
    <StatusBar hidden/>
    <View style={{ width: gameWidth, height: gameHeight, overflow: 'hidden', backgroundColor: '#078da6' }}>
      <OceanScene/>
      <View style={styles.topBar}>
        <View style={styles.avatar}><Text style={styles.avatarText}>🏴‍☠️</Text></View>
        <View style={styles.resource}><Text style={styles.resourceValue}>🪙 {gold >= 1000 ? (gold/1000).toFixed(1).replace('.', ',') + 'k' : gold}</Text><Text style={styles.resourceName}>OURO</Text></View>
        <View style={styles.resource}><Text style={styles.resourceValue}>🪵 {wood}</Text><Text style={styles.resourceName}>MADEIRA</Text></View>
        <View style={styles.resource}><Text style={styles.resourceValue}>🪨 {iron}</Text><Text style={styles.resourceName}>FERRO</Text></View>
        <View style={styles.level}><Text style={{fontSize: 21}}>🧔🏻</Text><Text style={styles.levelText}>Lvl. {level}</Text></View>
      </View>
      <View style={styles.clock}><Text style={styles.clockText}>{toast}</Text></View>

      <View style={styles.gearPanel}>
        <View style={styles.panelTitle}><Text style={styles.chevron}>⌃</Text><Text style={styles.panelTitleText}>PERSONAGEM & BARCO</Text></View>
        <View style={styles.gearGrid}>
          {EQUIPMENT.map((item, index) => <Pressable key={item.name} onPress={() => {setSelectedGear(index); message(item.name + ' selecionado')}} style={[styles.gearSlot, selectedGear === index && styles.gearSelected]}>
            <Text style={styles.gearIcon}>{item.icon}</Text><Text style={styles.gearName}>{item.name}</Text>
          </Pressable>)}
        </View>
      </View>

      <PanelButton style={styles.chestButton} onPress={() => setChestOpen(v => !v)} active={chestOpen}>
        <Text style={styles.chestText}>BAÚS & CRAFTING</Text><Text style={styles.chestChevron}>{chestOpen ? '⌃' : '⌄'}</Text>
      </PanelButton>
      {chestOpen && <View style={styles.chestPopover}>
        <Text style={styles.panelTitleText}>BAÚS & CRAFTING</Text>
        <Text style={styles.chestItem}>📦 Baú de madeira</Text><Text style={styles.chestItem}>⚒️ Forjar equipamento</Text><Text style={styles.chestItem}>🧰 Materiais: {wood} madeira</Text>
        <Pressable onPress={() => setChestOpen(false)}><Text style={styles.closeText}>FECHAR ×</Text></Pressable>
      </View>}

      <View style={styles.shipShadow}><View style={styles.ship}><ShipArt/></View></View>
      {cannonFire && <Text style={styles.blast}>💥</Text>}

      <View style={styles.sideMenu}>
        {NAV.map(item => <Pressable key={item.label} onPress={() => handleNav(item.label)} style={[styles.navItem, selected === item.label && styles.navActive]}>
          <Text style={styles.navIcon}>{item.icon}</Text><Text style={[styles.navLabel, selected === item.label && styles.navLabelActive]}>{item.label}</Text>
        </Pressable>)}
      </View>

      <View style={styles.controls}>
        <View style={styles.controlGroup}>
          <PanelButton onPress={() => {setHelmTurn(v => v - 1); message('TIMÃO: bombordo')}}><Text style={styles.controlIcon}>☸️</Text></PanelButton>
          <Text style={styles.controlLabel}>TIMÃO</Text>
        </View>
        <View style={styles.controlGroup}>
          <View style={styles.controlRow}>
            <PanelButton onPress={() => {setHelmTurn(v => v + 1); message('TIMÃO: estibordo')}}><Text style={styles.controlIcon}>☸️</Text></PanelButton>
            <PanelButton onPress={fireCannons} style={styles.cannonButton}><Text style={styles.controlIcon}>💣</Text></PanelButton>
          </View>
          <View style={styles.controlRow}><Text style={styles.controlLabel}>TIMÃO</Text><Text style={styles.controlLabel}>CANHÕES</Text></View>
        </View>
      </View>
      {selectedGear >= 0 && <View style={styles.gearToast}><Text style={styles.gearToastText}>{EQUIPMENT[selectedGear].icon} {EQUIPMENT[selectedGear].name}</Text><Pressable onPress={() => setSelectedGear(-1)}><Text style={styles.closeText}>×</Text></Pressable></View>}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, width: '100%', height: '100%', backgroundColor: '#10151c', alignItems: 'center', justifyContent: 'center' },
  topBar: { position: 'absolute', top: '7.8%', left: '3%', width: '94%', height: '5.7%', backgroundColor: '#563e31', borderColor: '#b18a5d', borderWidth: 3, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', zIndex: 5, paddingHorizontal: 2 },
  avatar: { width: '11%', height: '88%', backgroundColor: '#342c2a', borderColor: '#8c6a4c', borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20 },
  resource: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  resourceValue: { color: '#fff1d1', fontSize: 16, fontWeight: '900', textShadowColor: '#382b24', textShadowRadius: 2 },
  resourceName: { color: '#f5dfb8', fontSize: 9, fontWeight: '900', textShadowColor: '#382b24', textShadowRadius: 2 },
  level: { width: '11%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b302a', height: '88%' },
  levelText: { color: '#ffd46b', fontSize: 10, fontWeight: '900' },
  clock: { position: 'absolute', top: '13.5%', left: '33%', width: '34%', height: '3.4%', backgroundColor: '#584032', borderColor: '#a67a50', borderWidth: 3, borderTopWidth: 1, alignItems: 'center', justifyContent: 'center', zIndex: 4 },
  clockText: { color: '#fff0d7', fontSize: 12, fontWeight: '900' },
  gearPanel: { position: 'absolute', top: '18.5%', left: '2%', width: '47%', height: '24%', backgroundColor: 'rgba(54,91,98,.91)', borderColor: '#71969a', borderWidth: 3, borderRadius: 8, padding: 4, zIndex: 4 },
  panelTitle: { height: '18%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  chevron: { color: '#c0d2c8', fontSize: 21, fontWeight: '900' },
  panelTitleText: { color: '#fff4dc', fontSize: 11, fontWeight: '900', textShadowColor: '#273d43', textShadowRadius: 2 },
  gearGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignContent: 'space-around' },
  gearSlot: { width: '24%', height: '31%', alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  gearSelected: { backgroundColor: 'rgba(241,192,92,.28)', borderWidth: 1, borderColor: '#e9c36e' },
  gearIcon: { fontSize: 23, textShadowColor: '#30241c', textShadowRadius: 2 },
  gearName: { color: '#fff5e1', fontSize: 9, fontWeight: '700', textShadowColor: '#283c42', textShadowRadius: 3 },
  chestButton: { position: 'absolute', top: '18.5%', right: '2%', width: '39%', height: '5.5%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 4 },
  panelButton: { backgroundColor: '#584131', borderWidth: 3, borderColor: '#a77b52', borderRadius: 5, alignItems: 'center', justifyContent: 'center', minWidth: 38, minHeight: 38, padding: 3 },
  activeButton: { borderColor: '#f2c66c', backgroundColor: '#725239' },
  chestText: { color: '#fff2d8', fontWeight: '900', fontSize: 11, textShadowColor: '#2d2925', textShadowRadius: 2 },
  chestChevron: { color: '#d4d9c9', fontSize: 18, marginLeft: 5, fontWeight: '900' },
  chestPopover: { position: 'absolute', right: '2%', top: '24.5%', width: '39%', padding: 9, backgroundColor: 'rgba(45,75,80,.97)', borderColor: '#9cb2a2', borderWidth: 2, borderRadius: 6, zIndex: 8, gap: 8 },
  chestItem: { color: '#fff0d5', fontSize: 10, fontWeight: '700' },
  closeText: { color: '#f4c66c', fontWeight: '900', fontSize: 11 },
  shipShadow: { position: 'absolute', width: '34%', height: '25%', left: '33%', top: '60%', alignItems: 'center', justifyContent: 'center' },
  ship: { width: '100%', height: '100%' },
  blast: { position: 'absolute', top: '63%', left: '49%', fontSize: 34, zIndex: 6 },
  sideMenu: { position: 'absolute', left: 0, bottom: 0, width: '23%', height: '38%', backgroundColor: 'rgba(41,75,83,.95)', borderColor: '#78979a', borderWidth: 2, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 7, zIndex: 5, justifyContent: 'space-around' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(183,207,193,.2)', paddingVertical: 2 },
  navActive: { backgroundColor: 'rgba(13,54,66,.38)' },
  navIcon: { fontSize: 29, textShadowColor: '#182e36', textShadowRadius: 3 },
  navLabel: { color: '#fff3df', fontSize: 9, fontWeight: '900', textShadowColor: '#172f39', textShadowRadius: 3, textAlign: 'center' },
  navLabelActive: { color: '#f3c45c' },
  controls: { position: 'absolute', right: '2%', bottom: '2.3%', width: '58%', height: '9.5%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', zIndex: 5 },
  controlGroup: { alignItems: 'center', justifyContent: 'flex-end' },
  controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  controlIcon: { fontSize: 27, textShadowColor: '#231d19', textShadowRadius: 3 },
  controlLabel: { color: '#fff3dc', fontSize: 10, fontWeight: '900', textShadowColor: '#20323a', textShadowRadius: 3, marginTop: 2 },
  cannonButton: { borderColor: '#e2ae51', backgroundColor: '#80512f' },
  gearToast: { position: 'absolute', top: '45%', left: '28%', backgroundColor: 'rgba(39,66,72,.95)', borderColor: '#e0bb6b', borderWidth: 1, borderRadius: 5, paddingHorizontal: 9, paddingVertical: 5, flexDirection: 'row', gap: 8, alignItems: 'center', zIndex: 10 },
  gearToastText: { color: '#fff0d6', fontSize: 11, fontWeight: '800' },
});
