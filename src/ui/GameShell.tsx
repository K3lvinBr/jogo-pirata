import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useGame } from '../state/GameContext';
import { PORTS, projectCoordinates } from '../domain/caribbean';
import { distanceKm } from '../domain/caribbean';
import { getVoyageProgress, getVoyageRemainingMs, formatDuration, isVoyageComplete } from '../domain/voyage';
import { rarityColor, SLOT_LABELS } from '../domain/loot';
import type { EquipmentSlot } from '../domain/types';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';

type Screen = 'navio' | 'mapa' | 'inventario' | 'melhorias';
const C = { bg: '#102c3b', panel: '#244653', panel2: '#315966', gold: '#f4c45e', text: '#f5ead4', muted: '#a9c6c9', sea: '#087d99', sea2: '#08617b', line: '#64848a' };

function PixelButton({ label, onPress, active = false }: { label: string; onPress: () => void; active?: boolean }) {
  return <TouchableOpacity onPress={onPress} style={[styles.button, active && styles.buttonActive]}><Text style={styles.buttonText}>{label}</Text></TouchableOpacity>;
}

function CaribbeanMap({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const width = 620, height = 370;
  const p = (lon: number, lat: number) => projectCoordinates(lon, lat, width, height);
  const islands = [
    'M 0 0 L 105 0 L 105 34 L 91 46 L 80 75 L 62 92 L 48 122 L 0 139 Z',
    'M 0 214 L 45 210 L 65 225 L 86 251 L 102 286 L 127 315 L 144 370 L 0 370 Z',
    'M 170 190 L 220 181 L 256 192 L 288 204 L 321 208 L 349 218 L 365 230 L 340 242 L 304 236 L 273 227 L 240 220 L 205 215 Z',
    'M 375 180 L 404 176 L 423 181 L 439 194 L 420 202 L 398 197 Z',
    'M 467 193 L 491 187 L 513 192 L 531 202 L 510 209 L 486 204 Z',
    'M 535 207 L 555 198 L 579 205 L 598 219 L 578 224 L 553 218 Z'
  ];
  return (
    <View style={styles.mapWrap}>
      <Svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        <Rect width={width} height={height} fill="#0b7891" />
        {Array.from({ length: 9 }, (_, i) => <Path key={i} d={`M 0 ${35 + i * 39} Q 180 ${22 + i * 39} 330 ${35 + i * 39} T 620 ${30 + i * 39}`} stroke="#58b7bd" strokeOpacity=".18" strokeWidth="2" fill="none" />)}
        {islands.map((d, i) => <Path key={i} d={d} fill="#356b56" stroke="#8ebc83" strokeWidth="2" />)}
        {PORTS.map(port => {
          const pt = p(port.lon, port.lat);
          const active = selectedId === port.id;
          return <React.Fragment key={port.id}>
            <Circle cx={pt.x} cy={pt.y} r={active ? 8 : 5} fill={active ? '#ffd36a' : '#f4eee0'} stroke="#553e32" strokeWidth="2" />
            <SvgText x={pt.x + 8} y={pt.y - 7} fill="#fff2cf" fontSize="12" stroke="#153644" strokeWidth=".5">{port.name}</SvgText>
          </React.Fragment>;
        })}
      </Svg>
    </View>
  );
}

export function GameShell() {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const { state, hydrated, selectPort, startVoyage, claimVoyage } = useGame();
  const [screen, setScreen] = useState<Screen>('navio');
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  if (!hydrated) return <View style={styles.loading}><ActivityIndicator color={C.gold} /><Text style={styles.text}>Preparando sua tripulação...</Text></View>;

  const selected = PORTS.find(p => p.id === state.selectedPortId) ?? PORTS[0];
  const voyage = state.voyage;
  const from = PORTS.find(p => p.id === voyage?.fromPortId);
  const to = PORTS.find(p => p.id === voyage?.toPortId);
  const progress = voyage ? getVoyageProgress(voyage, now) : 0;
  const complete = voyage ? isVoyageComplete(voyage, now) : false;
  const currentPort = to && voyage?.claimed ? to : from ?? PORTS[0];

  return <View style={styles.app}>
    <View style={styles.topbar}>
      <View style={styles.captain}><Text style={{fontSize:26}}>🏴‍☠️</Text><Text style={styles.small}>CAPITÃO</Text><Text style={styles.level}>NÍVEL {state.captain.level}</Text></View>
      <View style={styles.resource}><Text style={styles.resourceIcon}>🪙</Text><Text style={styles.resourceValue}>{state.resources.gold.toLocaleString('pt-BR')}</Text><Text style={styles.small}>OURO</Text></View>
      <View style={styles.resource}><Text style={styles.resourceIcon}>🪵</Text><Text style={styles.resourceValue}>{state.resources.wood}</Text><Text style={styles.small}>MADEIRA</Text></View>
      <View style={styles.resource}><Text style={styles.resourceIcon}>⛓️</Text><Text style={styles.resourceValue}>{state.resources.iron}</Text><Text style={styles.small}>FERRO</Text></View>
    </View>

    <View style={[styles.layout, compact && styles.layoutCompact]}>
      <View style={styles.sidebar}>
        {(['navio','mapa','inventario','melhorias'] as Screen[]).map((key, i) => <TouchableOpacity key={key} onPress={() => setScreen(key)} style={[styles.navItem, screen === key && styles.navItemActive]}>
          <Text style={styles.navIcon}>{['⛵','🗺️','🎒','⚙️'][i]}</Text><Text style={styles.navLabel}>{['MEU NAVIO','MAPA MUNDI','BAÚS & LOOT','MELHORIAS'][i]}</Text>
        </TouchableOpacity>)}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {screen === 'navio' && <>
          <Text style={styles.heading}>⚓ MEU NAVIO</Text>
          <View style={styles.seaScene}>
            <Text style={styles.sun}>☀️</Text><Text style={styles.ship}>⛵</Text><Text style={styles.shipWake}>〰️　〰️　〰️</Text>
            <Text style={styles.sceneCaption}>{voyage && !voyage.claimed ? (complete ? `CHEGAMOS A ${to?.name?.toUpperCase()}!` : `NAVEGANDO PARA ${to?.name?.toUpperCase()}`) : `ANCORADO EM ${currentPort.name.toUpperCase()}`}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>VIAGEM EM TEMPO REAL</Text>
            {voyage && !voyage.claimed ? <>
              <View style={styles.rowBetween}><Text style={styles.text}>{from?.name} → {to?.name}</Text><Text style={styles.gold}>{Math.round(progress * 100)}%</Text></View>
              <View style={styles.progress}><View style={[styles.progressFill, { width: `${progress * 100}%` }]} /></View>
              <Text style={styles.muted}>{Math.round(voyage.distanceKm).toLocaleString('pt-BR')} km · {complete ? 'Destino alcançado' : `Chegada em ${formatDuration(getVoyageRemainingMs(voyage, now))}`}</Text>
              {complete && <PixelButton label="⚓ ATRACAR E COLETAR LOOT" onPress={claimVoyage} active />}
            </> : <><Text style={styles.muted}>Escolha um destino no mapa para iniciar uma expedição.</Text><PixelButton label="🗺️ ESCOLHER DESTINO" onPress={() => setScreen('mapa')} /></>}
          </View>
          <View style={styles.card}><Text style={styles.cardTitle}>DESTINO SELECIONADO</Text><Text style={styles.text}>{selected.name} · {selected.region}</Text><Text style={styles.muted}>{selected.description}</Text><PixelButton label="PARTIR PARA ESTE PORTO" onPress={startVoyage} active /></View>
          <View style={styles.card}><Text style={styles.cardTitle}>TRIPULAÇÃO & ATRIBUTOS</Text><Text style={styles.text}>⚔️ Ataque {state.captain.attack}　🛡️ Defesa {state.captain.defense}　🍀 Sorte {state.captain.luck}</Text><Text style={styles.muted}>Experiência: {state.captain.xp} XP</Text></View>
        </>}

        {screen === 'mapa' && <>
          <Text style={styles.heading}>🗺️ MAPA DO CARIBE</Text>
          <Text style={styles.muted}>Coordenadas geográficas reais · selecione um porto para planejar sua rota.</Text>
          <CaribbeanMap selectedId={state.selectedPortId} onSelect={selectPort} />
          <View style={styles.card}><Text style={styles.cardTitle}>PORTOS & DESTINOS</Text>
            {PORTS.map(port => <TouchableOpacity key={port.id} onPress={() => selectPort(port.id)} style={[styles.portRow, state.selectedPortId === port.id && styles.portSelected]}>
              <View style={{flex:1}}><Text style={styles.text}>⚓ {port.name}</Text><Text style={styles.muted}>{port.region} · {port.lat.toFixed(2)}°, {port.lon.toFixed(2)}°</Text></View>
              <Text style={styles.gold}>{Math.round(distanceKm(PORTS.find(p => p.id === (voyage?.toPortId ?? 'havana')) ?? PORTS[0], port)).toLocaleString('pt-BR')} km</Text>
            </TouchableOpacity>)}
            <PixelButton label="🚢 INICIAR NAVEGAÇÃO" onPress={startVoyage} active />
          </View>
        </>}

        {screen === 'inventario' && <>
          <Text style={styles.heading}>🎒 BAÚS & EQUIPAMENTOS</Text>
          <View style={styles.card}><Text style={styles.cardTitle}>EQUIPAMENTOS RESGATADOS</Text>
            {state.inventory.length === 0 ? <Text style={styles.muted}>Seu baú está vazio. Complete viagens para encontrar equipamentos e tesouros.</Text> : state.inventory.map(item => <View key={item.id} style={styles.lootRow}>
              <Text style={{fontSize:28}}>{item.icon}</Text><View style={{flex:1}}><Text style={[styles.text,{color:rarityColor(item.rarity)}]}>{item.name}</Text><Text style={styles.muted}>{item.rarity} · ⚔️ {item.attack} · 🛡️ {item.defense} · 🍀 {item.luck}</Text></View>
              <PixelButton label="EQUIPAR" onPress={() => useGame().equipItem(item.id, item.slot)} />
            </View>)}
          </View>
          <View style={styles.card}><Text style={styles.cardTitle}>SLOTS DO PERSONAGEM</Text>{(['head','coat','weapon','boots','ring','amulet'] as EquipmentSlot[]).map(slot => <Text key={slot} style={styles.text}>{SLOT_LABELS[slot]}: {state.inventory.find(i => i.id === state.equipped[slot])?.name ?? 'Vazio'}</Text>)}</View>
        </>}

        {screen === 'melhorias' && <>
          <Text style={styles.heading}>⚙️ ESTALEIRO & MELHORIAS</Text>
          <View style={styles.card}><Text style={styles.cardTitle}>APRIMORAR EMBARCAÇÃO</Text><Text style={styles.text}>🪵 Madeira: {state.resources.wood}　⛓️ Ferro: {state.resources.iron}</Text><Text style={styles.muted}>As melhorias de velocidade, carga e canhões serão desbloqueadas nas próximas etapas do MVP.</Text></View>
        </>}
      </ScrollView>
    </View>
    <View style={styles.footer}><Text style={styles.footerText}>CORSÁRIOS DO CARIBE　·　O MAR NÃO ESPERA</Text></View>
  </View>;
}

const styles = StyleSheet.create({
  app: { flex: 1, minHeight: '100vh' as any, backgroundColor: C.bg, padding: 10, maxWidth: 1100, width: '100%', alignSelf: 'center' },
  loading: { flex: 1, minHeight: 400, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, gap: 12 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#49392f', borderWidth: 3, borderColor: '#a77b4b', borderRadius: 8, padding: 10, marginBottom: 10, flexWrap: 'wrap' },
  captain: { alignItems: 'center', minWidth: 70 },
  resource: { alignItems: 'center', minWidth: 68 },
  resourceIcon: { fontSize: 20 }, resourceValue: { color: C.text, fontSize: 20, fontWeight: '900' }, small: { color: '#e1c99d', fontSize: 10, fontWeight: '800', letterSpacing: 1 }, level: { color: C.gold, fontWeight: '900', fontSize: 11 },
  layout: { flex: 1, flexDirection: 'row', gap: 10, minHeight: 560 },
  layoutCompact: { flexDirection: 'column-reverse' },
  sidebar: { width: 104, backgroundColor: C.panel, borderWidth: 2, borderColor: C.line, borderRadius: 8, justifyContent: 'space-around', paddingVertical: 6 },
  navItem: { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#52717a' },
  navItemActive: { backgroundColor: '#3c6871' }, navIcon: { fontSize: 27 }, navLabel: { color: C.text, fontSize: 9, fontWeight: '900', textAlign: 'center', marginTop: 5 },
  content: { flex: 1, backgroundColor: '#0c718b', borderRadius: 8 }, contentInner: { padding: 12, gap: 10 },
  heading: { color: C.text, fontSize: 20, fontWeight: '900', letterSpacing: 1, textShadowColor: '#18313a', textShadowRadius: 3 },
  seaScene: { minHeight: 210, borderWidth: 3, borderColor: '#8ab6ad', borderRadius: 8, backgroundColor: '#22a7b5', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sun: { position: 'absolute', top: 12, right: 20, fontSize: 28 }, ship: { fontSize: 92, marginTop: 20 }, shipWake: { color: '#d3f6e8', fontSize: 22, marginTop: -12 }, sceneCaption: { color: '#fff2d4', fontWeight: '900', fontSize: 12, backgroundColor: '#174b57', padding: 7, marginTop: 8 },
  card: { backgroundColor: C.panel, borderWidth: 2, borderColor: C.line, borderRadius: 8, padding: 12, gap: 8 },
  cardTitle: { color: C.gold, fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  text: { color: C.text, fontSize: 14, fontWeight: '700' }, muted: { color: C.muted, fontSize: 12, lineHeight: 18 }, gold: { color: C.gold, fontWeight: '900', fontSize: 13 },
  button: { backgroundColor: '#72513a', borderWidth: 2, borderColor: '#c49a62', paddingVertical: 9, paddingHorizontal: 12, alignItems: 'center', borderRadius: 5, marginTop: 4 },
  buttonActive: { backgroundColor: '#986d37', borderColor: '#f4c45e' }, buttonText: { color: '#fff0cf', fontSize: 11, fontWeight: '900' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' }, progress: { height: 12, borderRadius: 8, backgroundColor: '#17333e', overflow: 'hidden' }, progressFill: { height: '100%', backgroundColor: C.gold },
  mapWrap: { height: 280, backgroundColor: C.sea, borderWidth: 2, borderColor: '#a5c9ae', borderRadius: 8, overflow: 'hidden' },
  portRow: { flexDirection: 'row', alignItems: 'center', padding: 8, borderBottomWidth: 1, borderBottomColor: '#496872', gap: 8 }, portSelected: { backgroundColor: '#3a6670', borderRadius: 5 },
  lootRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#496872' },
  footer: { alignItems: 'center', padding: 8 }, footerText: { color: '#85a7a9', fontSize: 9, letterSpacing: 2, fontWeight: '800' }
});