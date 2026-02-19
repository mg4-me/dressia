import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  Animated, PanResponder, Image, StatusBar, Platform, FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOLD = '#C9A84C';
const BG = '#0D0D0D';
const CARD_BG = '#161616';
const SURFACE = '#1A1A1A';
const TEXT_PRIMARY = '#F0EDE8';
const TEXT_MUTED = '#6B6560';

// Remplace l'ancien tableau TENUES dans App.js par celui-ci

// Remplace l'ancien tableau TENUES dans App.js par celui-ci

const TENUES = [
  { id: '01', nom: 'Le Gentleman Gris', description: 'Gilet gris chiné · Chemise blanche · Pantalon flanelle · Derby noire', formalisme: 'Business Casual', saison: 'Automne / Hiver', image: require('./tenue01.png') },
  { id: '02', nom: "L'Élégance Marine", description: 'Blazer marine · Chemise Oxford blanche · Chino beige · Mocassins cognac', formalisme: 'Business Casual', saison: 'Mi-saison', image: require('./tenue02.png') },
  { id: '03', nom: 'Le Casual Raffiné', description: 'Col roulé crème · Jean brut selvedge · Chelsea boots tabac', formalisme: 'Casual', saison: 'Automne / Hiver', image: require('./tenue03.png') },
  { id: '04', nom: 'Prince de Galles', description: 'Veste Prince de Galles · Jean indigo · Chemise blanche · Cravate knit bordeaux', formalisme: 'Business Casual', saison: 'Mi-saison', image: require('./tenue04.png') },
  { id: '05', nom: 'Le Formel Classique', description: 'Costume anthracite · Chemise bleue pâle · Cravate soie bordeaux · Richelieu noir', formalisme: 'Formel', saison: 'Toutes saisons', image: require('./tenue05.png') },
  { id: '06', nom: 'Camel & Marine', description: 'Manteau camel · Pull marine · Jean gris · Boots cuir brun', formalisme: 'Casual', saison: 'Automne / Hiver', image: require('./tenue06.png') },
  { id: '07', nom: 'Le Velours Bordeaux', description: 'Blazer velours bordeaux · Chemise blanche · Pantalon flanelle gris · Derby', formalisme: 'Business Casual', saison: 'Automne / Hiver', image: require('./tenue07.png') },
  { id: '08', nom: 'Lin Estival', description: 'Chemise lin beige · Chino blanc · Espadrilles marine · Montre cuir', formalisme: 'Casual', saison: 'Été', image: require('./tenue08.png') },
  { id: '09', nom: 'Le Chevron Automnal', description: 'Gilet chevron gris/brun · Chemise Oxford bleu · Chino tabac · Derby brune', formalisme: 'Business Casual', saison: 'Automne / Hiver', image: require('./tenue09.png') },
  { id: '10', nom: 'Monochrome Anthracite', description: 'Col roulé anthracite · Pantalon gris foncé · Chelsea boots noires', formalisme: 'Casual', saison: 'Hiver', image: require('./tenue10.png') },
  { id: '11', nom: 'Le Costume Bleu Nuit', description: 'Costume bleu nuit · Chemise blanche · Pochette soie · Oxford noir', formalisme: 'Formel', saison: 'Toutes saisons', image: require('./tenue11.png') },
  { id: '12', nom: 'Tweed & Denim', description: 'Veste tweed brun · Jean brut · Chemise flanelle · Boots cuir', formalisme: 'Casual', saison: 'Automne / Hiver', image: require('./tenue12.png') },
  { id: '13', nom: 'La Cravate Knit', description: 'Blazer gris chiné · Chemise blanche · Cravate knit verte · Chino beige', formalisme: 'Business Casual', saison: 'Mi-saison', image: require('./tenue13.png') },
  { id: '14', nom: 'Été Méditerranéen', description: 'Chemise rayée bleu/blanc · Short chino beige · Mocassins sans chaussettes', formalisme: 'Casual', saison: 'Été', image: require('./tenue14.png') },
  { id: '15', nom: 'Le Demi-Saison Parfait', description: 'Blouson Harrington kaki · Col roulé crème · Jean selvedge · White trainers', formalisme: 'Casual', saison: 'Mi-saison', image: require('./tenue15.png') },
  { id: '16', nom: 'Vichy & Sobriété', description: 'Chemise vichy bleu clair · Chino marine · Derby bleu nuit · Ceinture cuir', formalisme: 'Business Casual', saison: 'Été', image: require('./tenue16.png') },
  { id: '17', nom: 'Le Classique British', description: 'Gilet laine gris · Chemise vichy · Pantalon flanelle marine · Brogue brun', formalisme: 'Business Casual', saison: 'Automne / Hiver', image: require('./tenue17.png') },
  { id: '18', nom: 'Le Formel Estival', description: 'Costume lin bleu clair · Chemise blanche · Cravate soie beige · Oxford blanc', formalisme: 'Formel', saison: 'Été', image: require('./tenue18.png') },
  { id: '19', nom: 'Smart Casual Automne', description: 'Gilet sans manches kaki · Col roulé crème · Jean brut · Boots brun', formalisme: 'Casual', saison: 'Automne / Hiver', image: require('./tenue19.png') },
  { id: '20', nom: 'La Pochette Florale', description: 'Costume gris · Chemise blanche · Pochette fleurie · Cravate marine fine', formalisme: 'Formel', saison: 'Printemps', image: require('./tenue20.png') },
  { id: '21', nom: 'Carreaux Fenêtre', description: 'Veste carreaux fenêtre · Jean noir · Chemise blanche · Chelsea noire', formalisme: 'Business Casual', saison: 'Mi-saison', image: require('./tenue21.png') },
  { id: '22', nom: 'Décontracté Côtier', description: 'Chemise oxford bleu délavé · Chino blanc · Topsiders marine', formalisme: 'Casual', saison: 'Été', image: require('./tenue22.png') },
  { id: '23', nom: "L'Hiver Élégant", description: 'Pardessus gris · Costume charbon · Chemise bleu pâle · Cravate argent', formalisme: 'Formel', saison: 'Hiver', image: require('./tenue23.png') },
  { id: '24', nom: 'Pull Over Chemise', description: 'Pull col V marine · Chemise Oxford blanche · Chino beige · Derby', formalisme: 'Business Casual', saison: 'Mi-saison', image: require('./tenue24.png') },
  { id: '25', nom: 'Le Workwear Chic', description: 'Salopette denim · Col roulé blanc · Boots cuir naturel', formalisme: 'Casual', saison: 'Mi-saison', image: require('./tenue25.png') },
  { id: '26', nom: 'Rayures & Caractère', description: 'Chemise rayures fines bleu/blanc · Pantalon flanelle gris · Derby', formalisme: 'Business Casual', saison: 'Mi-saison', image: require('./tenue26.png') },
  { id: '27', nom: 'Le Tuxedo Moderne', description: 'Smoking noir · Chemise blanche · Noeud papillon soie · Oxford verni', formalisme: 'Formel', saison: 'Toutes saisons', image: require('./tenue27.png') },
  { id: '28', nom: 'Automne Rouille', description: 'Pull rouille · Jean stone washed · Boots cuir brun · Montre cuir', formalisme: 'Casual', saison: 'Automne', image: require('./tenue28.png') },
  { id: '29', nom: 'Le Costume Crème', description: 'Costume crème · Chemise bleu ciel · Cravate marine · Richelieu brun', formalisme: 'Formel', saison: 'Été / Printemps', image: require('./tenue29.png') },
  { id: '30', nom: 'Urbain & Fonctionnel', description: 'Trench beige · Col roulé gris · Jean noir · Sneakers blanches', formalisme: 'Casual', saison: 'Mi-saison', image: require('./tenue30.png') },
  { id: '31', nom: 'La Grande Élégance', description: 'Costume Prince de Galles · Gilet assorti · Chemise blanche · Cravate soie', formalisme: 'Formel', saison: 'Automne / Hiver', image: require('./tenue31.png') },
  { id: '32', nom: 'Le Blazer Crème', description: 'Blazer crème · Jean brut · Chemise blanche · Loafers cognac', formalisme: 'Business Casual', saison: 'Printemps / Été', image: require('./tenue32.png') },
  { id: '33', nom: 'Contraste Hivernal', description: 'Manteau noir · Pull crème · Pantalon gris · Chelsea boots noires', formalisme: 'Casual', saison: 'Hiver', image: require('./tenue33.png') },
  { id: '34', nom: 'Le Bureau Décontracté', description: 'Veste sport grise · Chemise bleue · Chino marine · Derby brun', formalisme: 'Business Casual', saison: 'Toutes saisons', image: require('./tenue34.png') },
  { id: '35', nom: 'La Touche Kaki', description: 'Veste field kaki · Jean noir · Col roulé noir · Boots cuir', formalisme: 'Casual', saison: 'Mi-saison', image: require('./tenue35.png') },
  { id: '36', nom: 'Élégance Bordeaux', description: 'Costume bordeaux · Chemise blanche · Pochette blanche · Oxford noir', formalisme: 'Formel', saison: 'Automne / Hiver', image: require('./tenue36.png') },
  { id: '37', nom: 'Le Look Yacht', description: 'Blazer marine · Polo blanc · Chino blanc · Mocassins bateau', formalisme: 'Business Casual', saison: 'Été', image: require('./tenue37.png') },
  { id: '38', nom: 'Denim sur Denim', description: 'Veste denim · Jean brut · T-shirt blanc · Boots cuir naturel', formalisme: 'Casual', saison: 'Mi-saison', image: require('./tenue38.png') },
  { id: '39', nom: 'Le Smoking Clair', description: 'Smoking blanc ivoire · Chemise blanche · Noeud papillon noir · Oxford verni', formalisme: 'Formel', saison: 'Été', image: require('./tenue39.png') },
  { id: '40', nom: 'Gris Millésime', description: 'Costume gris perle · Chemise bleu ciel · Cravate gris foncé · Derby grise', formalisme: 'Formel', saison: 'Toutes saisons', image: require('./tenue40.png') },
  { id: '41', nom: 'Le Randonneur Chic', description: 'Blouson bombardier · Jean selvedge · Boots hiking cuir · Sac à dos cuir', formalisme: 'Casual', saison: 'Automne', image: require('./tenue41.png') },
  { id: '42', nom: 'Tartan & Sobriété', description: 'Écharpe tartan · Manteau camel · Jean noir · Oxford noire', formalisme: 'Casual', saison: 'Hiver', image: require('./tenue42.png') },
  { id: '43', nom: 'Le Réunion Important', description: 'Costume bleu électrique · Chemise blanche · Cravate marine · Richelieu noir', formalisme: 'Formel', saison: 'Toutes saisons', image: require('./tenue43.png') },
  { id: '44', nom: 'Printemps Pastel', description: 'Chemise rose pâle · Chino beige · Loafers cuir · Montre fine', formalisme: 'Business Casual', saison: 'Printemps', image: require('./tenue44.png') },
  { id: '45', nom: 'Le Streetwear Élégant', description: 'Bomber satin · Jean noir slim · Sneakers blanches cuir', formalisme: 'Casual', saison: 'Mi-saison', image: require('./tenue45.png') },
  { id: '46', nom: 'Flanelle & Cognac', description: 'Costume flanelle gris · Chemise écossaise · Boots cognac · Pas de cravate', formalisme: 'Business Casual', saison: 'Automne / Hiver', image: require('./tenue46.png') },
  { id: '47', nom: 'Le Marin Moderne', description: 'Rayures marinières · Jean blanc · Espadrilles · Montre nautique', formalisme: 'Casual', saison: 'Été', image: require('./tenue47.png') },
  { id: '48', nom: 'Velours Nuit', description: 'Pantalon velours bordeaux · Chemise blanche · Blazer noir · Oxford verni', formalisme: 'Formel', saison: 'Hiver', image: require('./tenue48.png') },
  { id: '49', nom: 'Le Transitoire', description: 'Gilet matelassé marine · Chemise flanelle · Jean gris · Boots caoutchouc', formalisme: 'Casual', saison: 'Mi-saison', image: require('./tenue49.png') },
  { id: '50', nom: 'La Signature', description: 'Costume sur mesure bleu nuit · Chemise blanche · Pochette soie · Oxford patinée', formalisme: 'Formel', saison: 'Toutes saisons', image: require('./tenue50.png') },
];

async function getScores() {
  try {
    const raw = await AsyncStorage.getItem('tenues_scores');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

async function validerTenue(id) {
  const scores = await getScores();
  scores[id] = (scores[id] || 0) + 1;
  await AsyncStorage.setItem('tenues_scores', JSON.stringify(scores));
}

const { width: W, height: H } = Dimensions.get('window');
const CARD_W = W * 0.88;
const CARD_H = H * 0.62;
const SWIPE_THRESHOLD = W * 0.28;

function SwipeScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [validatedCount, setValidatedCount] = useState(0);
  const [done, setDone] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const nextScale = useRef(new Animated.Value(0.94)).current;

  const rotate = pan.x.interpolate({ inputRange: [-W / 2, 0, W / 2], outputRange: ['-12deg', '0deg', '12deg'], extrapolate: 'clamp' });
  const likeOpacity = pan.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const passOpacity = pan.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  const animateOut = useCallback((direction, onDone) => {
    const toX = direction === 'right' ? W * 1.4 : -W * 1.4;
    Animated.parallel([
      Animated.timing(pan, { toValue: { x: toX, y: 0 }, duration: 320, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(nextScale, { toValue: 1, duration: 320, useNativeDriver: true }),
    ]).start(() => {
      pan.setValue({ x: 0, y: 0 });
      cardOpacity.setValue(1);
      nextScale.setValue(0.94);
      onDone();
    });
  }, [pan, cardOpacity, nextScale]);

  const handleSwipe = useCallback(async (direction) => {
    if (direction === 'right') {
      await validerTenue(TENUES[index].id);
      setValidatedCount(c => c + 1);
    }
    animateOut(direction, () => {
      const next = index + 1;
      if (next >= TENUES.length) setDone(true);
      else setIndex(next);
    });
  }, [index, animateOut]);

  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dx > SWIPE_THRESHOLD) handleSwipe('right');
      else if (g.dx < -SWIPE_THRESHOLD) handleSwipe('left');
      else Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true, tension: 60, friction: 8 }).start();
    },
  })).current;

  if (done) {
    return (
      <View style={s.doneContainer}>
        <Text style={s.doneEmoji}>✦</Text>
        <Text style={s.doneTitle}>C'est tout pour aujourd'hui</Text>
        <Text style={s.doneSub}>{validatedCount} tenue{validatedCount > 1 ? 's' : ''} retenue{validatedCount > 1 ? 's' : ''}</Text>
        <TouchableOpacity style={s.doneButton} onPress={() => navigation.navigate('Favoris')}>
          <Text style={s.doneButtonText}>Voir mes favoris</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.doneButtonOutline} onPress={() => { setIndex(0); setDone(false); setValidatedCount(0); }}>
          <Text style={s.doneButtonOutlineText}>Recommencer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const current = TENUES[index];
  const nextT = TENUES[index + 1];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <Text style={s.logo}>DRESSING</Text>
        <Text style={s.counter}>{index + 1} / {TENUES.length}</Text>
      </View>
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(index / TENUES.length) * 100}%` }]} />
      </View>
      <View style={s.cardsContainer}>
        {nextT && (
          <Animated.View style={[s.card, { transform: [{ scale: nextScale }] }]}>
            <Image source={nextT.image} style={s.cardImage} resizeMode="cover" />
          </Animated.View>
        )}
        <Animated.View
          style={[s.card, { opacity: cardOpacity, transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }] }]}
          {...panResponder.panHandlers}
        >
          <Animated.View style={[s.badge, s.badgeLike, { opacity: likeOpacity }]}><Text style={s.badgeText}>OUI</Text></Animated.View>
          <Animated.View style={[s.badge, s.badgePass, { opacity: passOpacity }]}><Text style={s.badgeText}>PASS</Text></Animated.View>
          <Image source={current.image} style={s.cardImage} resizeMode="cover" />
          <View style={s.cardOverlay}>
            <View style={s.cardTag}><Text style={s.cardTagText}>{current.formalisme}</Text></View>
            <Text style={s.cardTitle}>{current.nom}</Text>
            <Text style={s.cardDesc}>{current.description}</Text>
            <Text style={s.cardSaison}>{current.saison}</Text>
          </View>
        </Animated.View>
      </View>
      <View style={s.actions}>
        <TouchableOpacity style={s.btnPass} onPress={() => handleSwipe('left')}><Text style={s.btnPassIcon}>✕</Text></TouchableOpacity>
        <TouchableOpacity style={s.btnValidate} onPress={() => handleSwipe('right')}><Text style={s.btnValidateText}>Je porte ca</Text></TouchableOpacity>
        <TouchableOpacity style={s.btnLike} onPress={() => handleSwipe('right')}><Text style={s.btnLikeIcon}>✓</Text></TouchableOpacity>
      </View>
      <Text style={s.hint}>Glisse a gauche ou a droite</Text>
    </View>
  );
}

const CARD_W2 = (W - 56) / 2;

function FavoritesScreen() {
  const [tenues, setTenues] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      const scores = await getScores();
      const enriched = TENUES
        .filter(t => scores[t.id] > 0)
        .map(t => ({ ...t, score: scores[t.id] || 0 }))
        .sort((a, b) => b.score - a.score);
      setTenues(enriched);
    })();
  }, []));

  if (tenues.length === 0) {
    return (
      <View style={s.emptyContainer}>
        <Text style={s.emptyIcon}>✦</Text>
        <Text style={s.emptyTitle}>Aucun favori pour l'instant</Text>
        <Text style={s.emptySub}>Valide des tenues dans l'explorateur pour les retrouver ici.</Text>
      </View>
    );
  }

  return (
    <View style={s.favContainer}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <Text style={s.logo}>MES FAVORIS</Text>
        <Text style={s.counter}>{tenues.length} tenue{tenues.length > 1 ? 's' : ''}</Text>
      </View>
      <View style={s.separator} />
      <FlatList
        data={tenues}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={s.sectionLabel}>Classees par frequence d'utilisation</Text>}
        renderItem={({ item, index }) => (
          <View style={[s.favCard, index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }]}>
            <Image source={item.image} style={s.favCardImage} resizeMode="cover" />
            <View style={s.scoreBadge}><Text style={s.scoreText}>{item.score}x</Text></View>
            <View style={s.favCardInfo}>
              <View style={s.cardTag}><Text style={s.cardTagText}>{item.formalisme}</Text></View>
              <Text style={s.favCardTitle} numberOfLines={1}>{item.nom}</Text>
              <Text style={s.cardSaison}>{item.saison}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }) {
  const icons = { Explorateur: '◈', Favoris: '◇' };
  return (
    <View style={{ alignItems: 'center', paddingTop: 8 }}>
      <Text style={{ fontSize: 18, color: focused ? GOLD : '#4A4A4A', marginBottom: 3 }}>{icons[label]}</Text>
      <Text style={{ fontSize: 8, color: focused ? GOLD : '#4A4A4A', letterSpacing: 2 }}>{label.toUpperCase()}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#111', borderTopWidth: 0, height: Platform.OS === 'ios' ? 80 : 60 }, tabBarShowLabel: false }}>
        <Tab.Screen name="Explorateur" component={SwipeScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Explorateur" focused={focused} /> }} />
        <Tab.Screen name="Favoris" component={FavoritesScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Favoris" focused={focused} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 54 : 36 },
  favContainer: { flex: 1, backgroundColor: BG, paddingTop: Platform.OS === 'ios' ? 54 : 36 },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 28, marginBottom: 16 },
  logo: { color: TEXT_PRIMARY, fontSize: 13, fontWeight: '700', letterSpacing: 6 },
  counter: { color: TEXT_MUTED, fontSize: 12, letterSpacing: 2 },
  progressBar: { width: W - 56, height: 1, backgroundColor: '#222', marginBottom: 28 },
  progressFill: { height: 1, backgroundColor: GOLD },
  separator: { height: 1, backgroundColor: '#1E1E1E', marginHorizontal: 28, marginBottom: 20 },
  cardsContainer: { width: CARD_W, height: CARD_H, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  card: { position: 'absolute', width: CARD_W, height: CARD_H, borderRadius: 20, overflow: 'hidden', backgroundColor: CARD_BG, elevation: 12 },
  cardImage: { width: '100%', height: '100%', position: 'absolute' },
  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 24, backgroundColor: 'rgba(0,0,0,0.65)', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  cardTag: { borderWidth: 1, borderColor: GOLD, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 8 },
  cardTagText: { color: GOLD, fontSize: 9, letterSpacing: 3, fontWeight: '600', textTransform: 'uppercase' },
  cardTitle: { color: TEXT_PRIMARY, fontSize: 20, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  cardDesc: { color: 'rgba(240,237,232,0.7)', fontSize: 12, lineHeight: 18 },
  cardSaison: { color: TEXT_MUTED, fontSize: 11, marginTop: 6, letterSpacing: 1 },
  badge: { position: 'absolute', top: 28, zIndex: 10, borderWidth: 2, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5 },
  badgeLike: { left: 20, borderColor: GOLD, transform: [{ rotate: '-12deg' }] },
  badgePass: { right: 20, borderColor: '#888', transform: [{ rotate: '12deg' }] },
  badgeText: { fontSize: 14, fontWeight: '800', letterSpacing: 3, color: TEXT_PRIMARY },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 16 },
  btnPass: { width: 52, height: 52, borderRadius: 26, backgroundColor: SURFACE, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A2A2A' },
  btnPassIcon: { color: '#666', fontSize: 18 },
  btnValidate: { paddingHorizontal: 32, paddingVertical: 16, backgroundColor: GOLD, borderRadius: 50 },
  btnValidateText: { color: '#0D0D0D', fontSize: 14, fontWeight: '800', letterSpacing: 1.5 },
  btnLike: { width: 52, height: 52, borderRadius: 26, backgroundColor: SURFACE, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A2A2A' },
  btnLikeIcon: { color: GOLD, fontSize: 20 },
  hint: { color: TEXT_MUTED, fontSize: 10, letterSpacing: 2 },
  doneContainer: { flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center', padding: 40 },
  doneEmoji: { fontSize: 32, color: GOLD, marginBottom: 24 },
  doneTitle: { color: TEXT_PRIMARY, fontSize: 22, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  doneSub: { color: TEXT_MUTED, fontSize: 14, letterSpacing: 1, marginBottom: 40 },
  doneButton: { paddingHorizontal: 36, paddingVertical: 16, backgroundColor: GOLD, borderRadius: 50, marginBottom: 16 },
  doneButtonText: { color: BG, fontSize: 14, fontWeight: '800', letterSpacing: 1.5 },
  doneButtonOutline: { paddingHorizontal: 36, paddingVertical: 14, borderWidth: 1, borderColor: '#2A2A2A', borderRadius: 50 },
  doneButtonOutlineText: { color: TEXT_MUTED, fontSize: 13, letterSpacing: 1.5 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionLabel: { color: TEXT_MUTED, fontSize: 10, letterSpacing: 2, marginBottom: 16, textAlign: 'center' },
  favCard: { width: CARD_W2, backgroundColor: SURFACE, borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
  favCardImage: { width: '100%', height: CARD_W2 * 1.3 },
  favCardInfo: { padding: 12 },
  favCardTitle: { color: TEXT_PRIMARY, fontSize: 13, fontWeight: '700', marginBottom: 3 },
  scoreBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(13,13,13,0.85)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: GOLD },
  scoreText: { color: GOLD, fontSize: 11, fontWeight: '700' },
  emptyContainer: { flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 28, color: TEXT_MUTED, marginBottom: 20 },
  emptyTitle: { color: TEXT_PRIMARY, fontSize: 18, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  emptySub: { color: TEXT_MUTED, fontSize: 13, lineHeight: 20, textAlign: 'center' },
});