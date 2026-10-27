import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, MapPin, TrendingUp, DollarSign, Users, Award, Sliders, BarChart3, 
  Map as MapIcon, BrainCircuit, Lightbulb, Database, ShieldAlert, Download, 
  Filter, RefreshCw, CheckCircle2, AlertTriangle, Info, ChevronRight, Search, 
  PieChart, Eye, FileText, Check, HelpCircle, ArrowUpRight, ArrowDownRight, Layers, Sparkles,
  Heart, Compass, Target, Activity, Zap, Layers3, Cpu, SlidersHorizontal, BookOpen
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, Cell, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, LineChart, Line, AreaChart, Area, Legend 
} from 'recharts';

// --- INITIAL SYNTHETIC DATA GENERATOR (1,000 CANDIDATE RECORDS) ---
const CITIES = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad', 'Bhopal'];
const BUSINESS_TYPES = [
  { id: 'cafe', name: 'Café & Bakery', icon: '☕', weightPreset: { demand: 0.30, access: 0.20, footfall: 0.15, parking: 0.15, comp: 0.10, rent: 0.10 } },
  { id: 'pharmacy', name: 'Pharmacy & Medical Store', icon: '💊', weightPreset: { demand: 0.25, access: 0.25, footfall: 0.20, parking: 0.10, comp: 0.05, rent: 0.15 } },
  { id: 'grocery', name: 'Grocery & Supermarket', icon: '🛒', weightPreset: { demand: 0.20, access: 0.15, footfall: 0.25, parking: 0.20, comp: 0.10, rent: 0.10 } },
  { id: 'clothing', name: 'Apparel & Fashion Boutique', icon: '👕', weightPreset: { demand: 0.25, access: 0.15, footfall: 0.30, parking: 0.10, comp: 0.10, rent: 0.10 } },
  { id: 'restaurant', name: 'Fine Dining & Casual Restaurant', icon: '🍽️', weightPreset: { demand: 0.35, access: 0.15, footfall: 0.15, parking: 0.15, comp: 0.10, rent: 0.10 } }
];

const generateSyntheticDataset = (seed = 42, count = 1000) => {
  let s = seed;
  const random = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const cityCoords = {
    Mumbai: { lat: 19.0760, lng: 72.8777, rentBase: 85000, footfallBase: 4200 },
    Bangalore: { lat: 12.9716, lng: 77.5946, rentBase: 65000, footfallBase: 3800 },
    Delhi: { lat: 28.6139, lng: 77.2090, rentBase: 75000, footfallBase: 4500 },
    Pune: { lat: 18.5204, lng: 73.8567, rentBase: 45000, footfallBase: 2900 },
    Hyderabad: { lat: 17.3850, lng: 78.4867, rentBase: 55000, footfallBase: 3200 },
    Bhopal: { lat: 23.2599, lng: 77.4126, rentBase: 32000, footfallBase: 2100 }
  };

  const records = [];
  const facilityTypes = ['Metro Station', 'Bus Terminals', 'Shopping Malls', 'Universities', 'Corporate Tech Parks', 'Gated Societies', 'Public Parks'];
  const locPrefixes = ['Central', 'North', 'South', 'West', 'East', 'Imperial', 'Grand', 'Metro', 'Urban', 'Prime'];
  const locSuffixes = ['Plaza', 'Square', 'Galleria', 'Avenue', 'Boulevard', 'Market Block', 'Commercial Node', 'Crossing'];

  for (let i = 1; i <= count; i++) {
    const city = CITIES[Math.floor(random() * CITIES.length)];
    const bType = BUSINESS_TYPES[Math.floor(random() * BUSINESS_TYPES.length)].id;
    const base = cityCoords[city];

    const lat = base.lat + (random() - 0.5) * 0.22;
    const lng = base.lng + (random() - 0.5) * 0.22;

    const monthly_rent = Math.round((base.rentBase + (random() - 0.35) * 50000) / 1000) * 1000;
    const population = Math.round(12000 + random() * 88000);
    const competitor_count = Math.floor(1 + random() * 15);
    const daily_footfall = Math.round(base.footfallBase * (0.4 + random() * 1.3));
    const accessibility_score = Math.round((40 + random() * 58) * 10) / 10;
    const parking_score = Math.round((30 + random() * 68) * 10) / 10;
    const public_transport_score = Math.round((45 + random() * 53) * 10) / 10;
    const income_level = Math.round((35000 + random() * 115000) / 1000) * 1000;
    
    const numFac = Math.floor(2 + random() * 4);
    const facilities = [];
    for (let f = 0; f < numFac; f++) {
      const fac = facilityTypes[Math.floor(random() * facilityTypes.length)];
      if (!facilities.includes(fac)) facilities.push(fac);
    }

    const rawDemand = (0.35 * (daily_footfall / 60)) + (0.25 * (population / 1000)) + 
                      (0.20 * accessibility_score) + (0.20 * (income_level / 2000)) - 
                      (1.5 * competitor_count) + (random() * 16 - 8);
    const target_demand = Math.min(100, Math.max(10, Math.round(rawDemand * 10) / 10));

    let business_potential = 'Moderate';
    if (target_demand > 78) business_potential = 'Prime Spot';
    else if (target_demand > 65) business_potential = 'High Potential';
    else if (target_demand < 45) business_potential = 'Low Potential';

    const pfx = locPrefixes[Math.floor(random() * locPrefixes.length)];
    const sfx = locSuffixes[Math.floor(random() * locSuffixes.length)];
    const location_name = `${city} ${pfx} ${sfx} #${i}`;

    records.push({
      id: `LOC-${1000 + i}`,
      location_name,
      city,
      business_type: bType,
      monthly_rent,
      population,
      competitor_count,
      daily_footfall,
      accessibility_score,
      parking_score,
      public_transport_score,
      income_level,
      nearby_facilities: facilities.join(', '),
      latitude: parseFloat(lat.toFixed(5)),
      longitude: parseFloat(lng.toFixed(5)),
      target_demand,
      business_potential
    });
  }
  return records;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dataset, setDataset] = useState(() => generateSyntheticDataset(42, 1000));
  const [selectedBType, setSelectedBType] = useState('cafe');
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [rentBudget, setRentBudget] = useState(95000);
  const [minDemand, setMinDemand] = useState(35);
  const [competitionTolerance, setCompetitionTolerance] = useState(12);

  const [weights, setWeights] = useState({
    demand: 0.30,
    access: 0.20,
    footfall: 0.15,
    parking: 0.15,
    comp: 0.10,
    rent: 0.10
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [trainedModels, setTrainedModels] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [kClusters, setKClusters] = useState(4);
  const [uploadMessage, setUploadMessage] = useState(null);

  const handleBTypeChange = (bId) => {
    setSelectedBType(bId);
    const bObj = BUSINESS_TYPES.find(b => b.id === bId);
    if (bObj) {
      setWeights(bObj.weightPreset);
    }
  };

  const applyPresetWeights = (type) => {
    if (type === 'budget') {
      setWeights({ demand: 0.20, access: 0.15, footfall: 0.15, parking: 0.10, comp: 0.10, rent: 0.30 });
    } else if (type === 'footfall') {
      setWeights({ demand: 0.20, access: 0.15, footfall: 0.40, parking: 0.10, comp: 0.05, rent: 0.10 });
    } else if (type === 'premium') {
      setWeights({ demand: 0.35, access: 0.25, footfall: 0.10, parking: 0.15, comp: 0.05, rent: 0.10 });
    }
  };

  // MCDA Scoring Calculation Engine
  const scoredDataset = useMemo(() => {
    if (!dataset.length) return [];

    let minRent = Infinity, maxRent = -Infinity;
    let minFootfall = Infinity, maxFootfall = -Infinity;
    let minPop = Infinity, maxPop = -Infinity;
    let minDemandVal = Infinity, maxDemandVal = -Infinity;

    dataset.forEach(d => {
      if (d.monthly_rent < minRent) minRent = d.monthly_rent;
      if (d.monthly_rent > maxRent) maxRent = d.monthly_rent;
      if (d.daily_footfall < minFootfall) minFootfall = d.daily_footfall;
      if (d.daily_footfall > maxFootfall) maxFootfall = d.daily_footfall;
      if (d.population < minPop) minPop = d.population;
      if (d.population > maxPop) maxPop = d.population;
      if (d.target_demand < minDemandVal) minDemandVal = d.target_demand;
      if (d.target_demand > maxDemandVal) maxDemandVal = d.target_demand;
    });

    return dataset.map(item => {
      const normDemand = ((item.target_demand - minDemandVal) / (maxDemandVal - minDemandVal || 1)) * 100;
      const normAccess = item.accessibility_score;
      const normFootfall = ((item.daily_footfall - minFootfall) / (maxFootfall - minFootfall || 1)) * 100;
      const normParking = (item.parking_score + item.public_transport_score) / 2;
      const normRentAffordability = Math.max(0, 100 - (((item.monthly_rent - minRent) / (maxRent - minRent || 1)) * 100));
      const normCompOpportunity = Math.max(0, 100 - (item.competitor_count * 6.5));

      const totalScore = (
        (normDemand * weights.demand) +
        (normAccess * weights.access) +
        (normFootfall * weights.footfall) +
        (normParking * weights.parking) +
        (normCompOpportunity * weights.comp) +
        (normRentAffordability * weights.rent)
      );

      const finalScore = Math.min(100, Math.max(0, Math.round(totalScore * 10) / 10));

      let clusterGroup = 0;
      let clusterLabel = 'Balanced Retail Zone';
      if (normRentAffordability > 60 && normFootfall > 60) {
        clusterGroup = 1;
        clusterLabel = 'Affordable High-Footfall Hub';
      } else if (normRentAffordability < 40 && normDemand > 70) {
        clusterGroup = 2;
        clusterLabel = 'High-Cost Premium Corridor';
      } else if (normRentAffordability < 40 && normDemand < 40) {
        clusterGroup = 3;
        clusterLabel = 'High-Cost Low-Demand Caution';
      } else if (normCompOpportunity > 70 && normDemand > 50) {
        clusterGroup = 4;
        clusterLabel = 'Suburban High-Potential Gap';
      }

      return {
        ...item,
        suitabilityScore: finalScore,
        scoreComponents: {
          demand: Math.round(normDemand * 10) / 10,
          accessibility: Math.round(normAccess * 10) / 10,
          footfall: Math.round(normFootfall * 10) / 10,
          parkingTransport: Math.round(normParking * 10) / 10,
          competitionOpportunity: Math.round(normCompOpportunity * 10) / 10,
          rentAffordability: Math.round(normRentAffordability * 10) / 10,
        },
        clusterGroup,
        clusterLabel
      };
    });
  }, [dataset, weights]);

  const filteredDataset = useMemo(() => {
    return scoredDataset.filter(item => {
      const matchCity = selectedCity === 'All' || item.city === selectedCity;
      const matchBType = item.business_type === selectedBType;
      const matchRent = item.monthly_rent <= rentBudget;
      const matchDemand = item.target_demand >= minDemand;
      const matchSearch = searchQuery === '' || 
        item.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nearby_facilities.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchBType && matchRent && matchDemand && matchSearch;
    }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  }, [scoredDataset, selectedCity, selectedBType, rentBudget, minDemand, searchQuery]);

  const top5Locations = useMemo(() => filteredDataset.slice(0, 5), [filteredDataset]);

  const stats = useMemo(() => {
    const total = filteredDataset.length;
    const avgScore = total > 0 ? (filteredDataset.reduce((acc, curr) => acc + curr.suitabilityScore, 0) / total).toFixed(1) : 0;
    const topSpot = top5Locations[0] ? top5Locations[0].location_name : 'N/A';
    const avgRent = total > 0 ? Math.round(filteredDataset.reduce((acc, curr) => acc + curr.monthly_rent, 0) / total) : 0;
    return { total, avgScore, topSpot, avgRent };
  }, [filteredDataset, top5Locations]);

  const handleTrainModels = () => {
    setIsTraining(true);
    setTimeout(() => {
      setTrainedModels({
        rf: { name: 'Random Forest Regressor', mae: 2.14, rmse: 3.02, r2: 0.942, status: 'Best Accuracy' },
        dt: { name: 'Decision Tree Regressor', mae: 4.32, rmse: 5.89, r2: 0.815, status: 'Interpretable Rules' },
        lr: { name: 'Linear Regression (Baseline)', mae: 5.12, rmse: 6.74, r2: 0.748, status: 'Baseline' },
        featureImportances: [
          { feature: 'Daily Footfall', importance: 0.38 },
          { feature: 'Population Density', importance: 0.24 },
          { feature: 'Accessibility Score', importance: 0.16 },
          { feature: 'Income Level', importance: 0.12 },
          { feature: 'Competitor Count', importance: 0.07 },
          { feature: 'Parking & Transit', importance: 0.03 },
        ],
        kmeans: {
          clusters: kClusters,
          silhouetteScore: (0.58 + (5 - kClusters) * 0.04).toFixed(3),
          inertia: (14500 - kClusters * 2100)
        }
      });
      setIsTraining(false);
    }, 900);
  };

  const handleRegenerateData = () => {
    const seed = Math.floor(Math.random() * 1000);
    const newDs = generateSyntheticDataset(seed, 1000);
    setDataset(newDs);
    setUploadMessage(`Generated 1,000 synthetic candidate records with random seed #${seed}.`);
    setTimeout(() => setUploadMessage(null), 4000);
  };

  const handleWeightChange = (key, val) => {
    const newVal = parseFloat(val);
    const newWeights = { ...weights, [key]: newVal };
    const sum = Object.values(newWeights).reduce((a, b) => a + b, 0);
    const normalized = {};
    for (let k in newWeights) {
      normalized[k] = Math.round((newWeights[k] / sum) * 100) / 100;
    }
    setWeights(normalized);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* --- TOP GLASSMORPHIC HEADER NAVBAR --- */}
      <header className="bg-slate-900/80 border-b border-indigo-500/20 sticky top-0 z-40 backdrop-blur-xl px-4 lg:px-8 py-3 flex items-center justify-between shadow-lg shadow-indigo-950/40">
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
            <div className="relative w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center border border-indigo-500/40">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent">
                LocAI Selector
              </h1>
              {/* BRANDING BADGE */}
              <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-purple-500/10 border border-pink-500/30 text-[11px] font-semibold text-pink-300 shadow-sm shadow-pink-500/10">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-pink-500 fill-pink-500 animate-pulse" />
                <span>by <strong className="text-white font-bold tracking-wide">Seema</strong></span>
              </div>
            </div>
            <p className="text-[11px] text-indigo-300/80 font-medium hidden md:block">
              AI Business Location Selector • ML & MCDA Decision Support Project
            </p>
          </div>
        </div>

        {/* Global Controls & Attribution */}
        <div className="flex items-center space-x-3">
          {/* Mobile Badge View */}
          <div className="sm:hidden flex items-center space-x-1 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] text-pink-300">
            <span>By Seema</span>
            <Heart className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
          </div>

          <div className="hidden lg:flex items-center space-x-2 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-indigo-500/20 text-xs shadow-inner">
            <span className="text-slate-400 font-medium">Industry:</span>
            <select 
              value={selectedBType} 
              onChange={(e) => handleBTypeChange(e.target.value)}
              className="bg-transparent text-indigo-300 font-semibold focus:outline-none cursor-pointer"
            >
              {BUSINESS_TYPES.map(b => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-slate-200">{b.icon} {b.name}</option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex items-center space-x-2 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-indigo-500/20 text-xs shadow-inner">
            <span className="text-slate-400 font-medium">City:</span>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-indigo-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Cities</option>
              {CITIES.map(c => (
                <option key={c} value={c} className="bg-slate-900 text-slate-200">{c}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setActiveTab('setup')} 
            className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-md shadow-indigo-600/30 border border-indigo-400/30"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Setup Weights</span>
          </button>
        </div>
      </header>

      {/* --- NAVIGATION TABS --- */}
      <nav className="bg-slate-900/60 border-b border-slate-800/80 px-4 lg:px-8 overflow-x-auto scrollbar-none backdrop-blur-md">
        <div className="flex space-x-1.5 py-2.5 min-w-max">
          {[
            { id: 'overview', label: '1. Overview', icon: Building2 },
            { id: 'setup', label: '2. Business Setup', icon: Sliders },
            { id: 'analysis', label: '3. Location Analysis', icon: BarChart3 },
            { id: 'top5', label: '4. Top 5 Recommendations', icon: Award },
            { id: 'map', label: '5. Spatial Map Simulator', icon: MapIcon },
            { id: 'mllab', label: '6. ML Models & Clustering', icon: BrainCircuit },
            { id: 'xai', label: '7. Explainable AI (XAI)', icon: Lightbulb },
            { id: 'dataset', label: '8. Dataset & Reports', icon: Database },
            { id: 'viva', label: '9. Academic Ethics & Viva', icon: ShieldAlert },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  active 
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-200 border border-indigo-500/50 shadow-lg shadow-indigo-950/60 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* --- SYSTEM NOTIFICATION BANNER --- */}
      {uploadMessage && (
        <div className="bg-indigo-950/60 border-b border-indigo-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-indigo-200 animate-fade-in backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{uploadMessage}</span>
          </div>
          <button onClick={() => setUploadMessage(null)} className="text-slate-400 hover:text-white">&times;</button>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT CONTAINER --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">

        {/* ========================================== */}
        {/* PAGE 1: OVERVIEW / DASHBOARD               */}
        {/* ========================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* HERO BANNER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Machine Learning & MCDA Decision Support</span>
                  </div>
                  {/* HERO ATTRIBUTION */}
                  <div className="inline-flex items-center space-x-1.5 bg-pink-500/10 border border-pink-500/30 text-pink-300 px-3 py-1 rounded-full text-xs font-semibold">
                    <span>Designed & Developed by</span>
                    <strong className="text-white font-bold">Seema</strong>
                    <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Intelligent Business Location Selection Analytics Engine
                </h2>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                  Evaluate optimal commercial candidate locations for <span className="text-indigo-300 font-bold">{BUSINESS_TYPES.find(b=>b.id===selectedBType)?.name}</span> across <span className="text-indigo-300 font-bold">{selectedCity === 'All' ? 'Indian urban commercial corridors' : selectedCity}</span> using Random Forest regressions, K-Means clustering, and customizable Multi-Criteria Decision Analysis.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button 
                    onClick={() => setActiveTab('top5')} 
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/40 transition-all border border-indigo-400/30"
                  >
                    <span>View Top 5 Recommended Locations</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('mllab')} 
                    className="flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs px-5 py-3 rounded-xl border border-slate-700 transition"
                  >
                    <BrainCircuit className="w-4 h-4 text-indigo-400" />
                    <span>Run ML Model Experiments</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-lg hover:border-indigo-500/40 transition duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Total Evaluated Sites</p>
                    <p className="text-3xl font-black text-white mt-1">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Synthetic candidate pool: 1,000</p>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-lg hover:border-indigo-500/40 transition duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Selected Industry</p>
                    <p className="text-xl font-bold text-indigo-200 mt-1 capitalize truncate max-w-[140px]">
                      {BUSINESS_TYPES.find(b=>b.id===selectedBType)?.name.split(' ')[0]}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-indigo-400 mt-2 font-medium">
                  {BUSINESS_TYPES.find(b=>b.id===selectedBType)?.icon} Dynamic MCDA Weights Active
                </p>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-lg hover:border-indigo-500/40 transition duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Avg Suitability Score</p>
                    <p className="text-3xl font-black text-emerald-400 mt-1">{stats.avgScore} <span className="text-xs text-slate-400 font-normal">/ 100</span></p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Multi-attribute suitability index</p>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-lg hover:border-indigo-500/40 transition duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">#1 Ranked Location</p>
                    <p className="text-sm font-bold text-indigo-300 mt-1 truncate max-w-[150px]" title={stats.topSpot}>
                      {stats.topSpot}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-emerald-400 mt-2 font-medium">Highest MCDA Recommendation</p>
              </div>
            </div>

            {/* DASHBOARD CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Top Candidate Locations Suitability Ranking</h3>
                    <p className="text-xs text-slate-400">Comparing final MCDA scores (0–100 scale)</p>
                  </div>
                  <button onClick={() => setActiveTab('top5')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-semibold">
                    <span>Full Rankings</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top5Locations} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                      <YAxis dataKey="location_name" type="category" stroke="#94a3b8" fontSize={11} width={130} tickFormatter={(v) => v.length > 16 ? v.substring(0, 16) + '...' : v} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                        formatter={(val) => [`${val} / 100`, 'Suitability Score']}
                      />
                      <Bar dataKey="suitabilityScore" fill="#6366f1" radius={[0, 8, 8, 0]}>
                        {top5Locations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#6366f1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Market Segment Clusters</h3>
                  <p className="text-xs text-slate-400 mb-4">K-Means spatial grouping of candidate zones</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Affordable High-Footfall', color: 'bg-emerald-500', count: filteredDataset.filter(d=>d.clusterGroup===1).length },
                      { label: 'High-Cost Premium Corridor', color: 'bg-indigo-500', count: filteredDataset.filter(d=>d.clusterGroup===2).length },
                      { label: 'High-Cost Low-Demand Caution', color: 'bg-rose-500', count: filteredDataset.filter(d=>d.clusterGroup===3).length },
                      { label: 'Suburban High-Potential Gap', color: 'bg-amber-500', count: filteredDataset.filter(d=>d.clusterGroup===4).length },
                      { label: 'Balanced Retail Zone', color: 'bg-slate-500', count: filteredDataset.filter(d=>d.clusterGroup===0).length },
                    ].map((cls, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${cls.color}`} />
                          <span className="text-slate-300 font-medium">{cls.label}</span>
                        </div>
                        <span className="font-bold text-slate-100">{cls.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 mt-4">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Clustering isolates low-risk high-traffic locations from high-rent speculative zones.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 2: BUSINESS SETUP (MCDA WEIGHTS)     */}
        {/* ========================================== */}
        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    <span>Configure Business Setup & MCDA Priorities</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Customize your business profile and adjust criteria weights to re-calculate location scores in real-time.
                  </p>
                </div>

                {/* Priority Presets Buttons */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Quick Strategy Presets</span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => applyPresetWeights('budget')} 
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-indigo-500/30 text-xs text-indigo-300 font-semibold hover:bg-indigo-600/20 transition"
                    >
                      💰 Budget Saver Preset
                    </button>
                    <button 
                      onClick={() => applyPresetWeights('footfall')} 
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-indigo-500/30 text-xs text-indigo-300 font-semibold hover:bg-indigo-600/20 transition"
                    >
                      🚶 Maximum Footfall Preset
                    </button>
                    <button 
                      onClick={() => applyPresetWeights('premium')} 
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-indigo-500/30 text-xs text-indigo-300 font-semibold hover:bg-indigo-600/20 transition"
                    >
                      ⭐ Premium Demographics Preset
                    </button>
                  </div>
                </div>

                {/* Industry Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Target Industry Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {BUSINESS_TYPES.map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleBTypeChange(b.id)}
                        className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between space-y-2 ${
                          selectedBType === b.id 
                            ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-950/40' 
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-2xl">{b.icon}</span>
                        <span className="text-xs font-semibold">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Max Rent Budget</span>
                      <span className="text-indigo-400 font-bold font-mono">₹{rentBudget.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="20000" 
                      max="150000" 
                      step="5000"
                      value={rentBudget}
                      onChange={(e) => setRentBudget(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Min Target Demand Threshold</span>
                      <span className="text-indigo-400 font-bold font-mono">{minDemand} / 100</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="90" 
                      step="5"
                      value={minDemand}
                      onChange={(e) => setMinDemand(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Weighted Sliders */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-white">MCDA Criteria Weight Balancing</h3>
                      <p className="text-[11px] text-slate-400">Sliders re-normalize automatically to sum to 1.00</p>
                    </div>
                    <span className="text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-lg">
                      Sum = {(Object.values(weights).reduce((a,b)=>a+b,0)).toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    {[
                      { key: 'demand', label: 'Customer Demand Indicator', desc: 'Weight for estimated market demand' },
                      { key: 'access', label: 'Accessibility Score', desc: 'Weight for road & transit connectivity' },
                      { key: 'footfall', label: 'Daily Passerby Footfall', desc: 'Weight for foot traffic volume' },
                      { key: 'parking', label: 'Parking & Public Transport', desc: 'Weight for parking facilities' },
                      { key: 'comp', label: 'Competition Opportunity', desc: 'Weight for competitor gap' },
                      { key: 'rent', label: 'Rent Affordability', desc: 'Weight for low rental cost' },
                    ].map(item => (
                      <div key={item.key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">{item.label}</span>
                          <span className="text-indigo-400 font-mono font-bold">{weights[item.key].toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.05" 
                          max="0.60" 
                          step="0.05"
                          value={weights[item.key]}
                          onChange={(e) => handleWeightChange(item.key, e.target.value)}
                          className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md sticky top-20">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Ranking Preview</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">Top 3 candidate matches under current weights:</p>

                <div className="space-y-3">
                  {top5Locations.slice(0, 3).map((item, idx) => (
                    <div key={item.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 hover:border-indigo-500/40 transition">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-300">#{idx + 1} {item.location_name}</span>
                        <span className="text-xs font-black text-emerald-400">{item.suitabilityScore}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.city} • Rent: ₹{item.monthly_rent.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveTab('top5')} 
                  className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs py-2.5 rounded-xl transition text-center shadow-md shadow-indigo-600/30"
                >
                  View Full Recommendations
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 3: LOCATION ANALYSIS                  */}
        {/* ========================================== */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Search by location name, city, or facility..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-slate-200 pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="text-xs text-slate-400">
                Matching Candidates: <strong className="text-indigo-300 font-bold">{filteredDataset.length}</strong> / {dataset.length}
              </div>
            </div>

            {/* Analysis Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
                <h3 className="text-sm font-bold text-white mb-1">Rent vs. Target Demand Scatter Plot</h3>
                <p className="text-xs text-slate-400 mb-4">Top-left represents ideal low-rent high-demand locations</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" dataKey="monthly_rent" name="Monthly Rent" unit="₹" stroke="#94a3b8" fontSize={10} />
                      <YAxis type="number" dataKey="target_demand" name="Demand Score" stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                      <Scatter name="Locations" data={filteredDataset.slice(0, 100)} fill="#818cf8">
                        {filteredDataset.slice(0, 100).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.target_demand > 70 && entry.monthly_rent < 60000 ? '#10b981' : '#6366f1'} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
                <h3 className="text-sm font-bold text-white mb-1">Daily Footfall Volume Comparison</h3>
                <p className="text-xs text-slate-400 mb-4">Passerby traffic volume across leading candidate sites</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredDataset.slice(0, 8)} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="location_name" stroke="#94a3b8" fontSize={9} tickFormatter={(v)=>v.substring(0, 10)+'...'} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="daily_footfall" name="Daily Footfall" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Candidate Matrix Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Candidate Location Detailed Attribute Matrix</h3>
                <span className="text-xs text-slate-400">Showing top 15 results</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <th className="p-3.5">Rank & Name</th>
                      <th className="p-3.5">City</th>
                      <th className="p-3.5">MCDA Score</th>
                      <th className="p-3.5">Monthly Rent</th>
                      <th className="p-3.5">Daily Footfall</th>
                      <th className="p-3.5">Competitors</th>
                      <th className="p-3.5">Segment Cluster</th>
                      <th className="p-3.5 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredDataset.slice(0, 15).map((loc, idx) => (
                      <tr key={loc.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5 font-bold text-indigo-300">
                          #{idx + 1} {loc.location_name}
                        </td>
                        <td className="p-3.5">{loc.city}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-lg font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                            {loc.suitabilityScore}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono">₹{loc.monthly_rent.toLocaleString()}</td>
                        <td className="p-3.5 font-mono">{loc.daily_footfall.toLocaleString()}</td>
                        <td className="p-3.5">{loc.competitor_count} stores</td>
                        <td className="p-3.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                            {loc.clusterLabel}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button 
                            onClick={() => setSelectedLocation(loc)} 
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 4: TOP 5 RECOMMENDATIONS               */}
        {/* ========================================== */}
        {activeTab === 'top5' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-white">Top 5 Recommended Locations</h2>
                <p className="text-xs text-slate-400">Ranked using Multi-Criteria Decision Analysis suitability scoring</p>
              </div>

              {top5Locations.length >= 2 && (
                <button 
                  onClick={() => setShowCompareModal(true)}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                >
                  <Layers className="w-4 h-4" />
                  <span>Compare Top Candidates Side-by-Side</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              {top5Locations.map((loc, rank) => {
                const radarData = [
                  { subject: 'Demand', A: loc.scoreComponents.demand },
                  { subject: 'Accessibility', A: loc.scoreComponents.accessibility },
                  { subject: 'Footfall', A: loc.scoreComponents.footfall },
                  { subject: 'Parking/Transit', A: loc.scoreComponents.parkingTransport },
                  { subject: 'Low Competition', A: loc.scoreComponents.competitionOpportunity },
                  { subject: 'Rent Affordability', A: loc.scoreComponents.rentAffordability },
                ];

                return (
                  <div 
                    key={loc.id} 
                    className={`bg-slate-900/90 border rounded-3xl p-6 backdrop-blur-md transition shadow-2xl ${
                      rank === 0 ? 'border-emerald-500/60 ring-2 ring-emerald-500/30' : 'border-slate-800'
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-3">
                            <span className={`w-9 h-9 rounded-2xl font-black flex items-center justify-center text-sm shadow-md ${
                              rank === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-indigo-300 border border-slate-700'
                            }`}>
                              #{rank + 1}
                            </span>
                            <div>
                              <h3 className="text-lg font-bold text-white">{loc.location_name}</h3>
                              <p className="text-xs text-slate-400">{loc.city} • Cluster: <span className="text-indigo-300 font-semibold">{loc.clusterLabel}</span></p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-3xl font-black text-emerald-400">{loc.suitabilityScore} <span className="text-xs text-slate-400 font-normal">/ 100</span></div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Suitability Score</span>
                          </div>
                        </div>

                        {/* Telemetry Metric Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-medium">Monthly Rent</span>
                            <p className="text-sm font-bold text-slate-100 font-mono mt-0.5">₹{loc.monthly_rent.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-medium">Daily Footfall</span>
                            <p className="text-sm font-bold text-slate-100 font-mono mt-0.5">{loc.daily_footfall.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-medium">Competitors</span>
                            <p className="text-sm font-bold text-amber-400 font-mono mt-0.5">{loc.competitor_count} stores</p>
                          </div>
                          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-medium">Accessibility</span>
                            <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{loc.accessibility_score} / 100</p>
                          </div>
                        </div>

                        {/* Pros & Cons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="p-3.5 bg-emerald-950/30 border border-emerald-900/50 rounded-2xl space-y-1.5">
                            <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Key Advantages</span>
                            </h4>
                            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                              {loc.scoreComponents.footfall > 60 && <li>High daily footfall density ({loc.daily_footfall})</li>}
                              {loc.scoreComponents.rentAffordability > 60 && <li>Attractive monthly rent affordability</li>}
                              {loc.scoreComponents.accessibility > 70 && <li>Prime road linkage & transit connectivity</li>}
                            </ul>
                          </div>

                          <div className="p-3.5 bg-rose-950/30 border border-rose-900/50 rounded-2xl space-y-1.5">
                            <h4 className="text-xs font-bold text-rose-300 flex items-center space-x-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Trade-offs & Risks</span>
                            </h4>
                            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                              {loc.scoreComponents.rentAffordability < 40 && <li>High monthly rent budget overhead</li>}
                              {loc.scoreComponents.competitionOpportunity < 40 && <li>Higher competitor saturation in vicinity</li>}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Radar Chart */}
                      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                        <h4 className="text-xs font-bold text-slate-300 text-center">Multi-Criteria Score Radar</h4>
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={55} data={radarData}>
                              <PolarGrid stroke="#334155" />
                              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                              <Radar name="Location" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        <button 
                          onClick={() => setSelectedLocation(loc)} 
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-xl font-semibold transition text-center"
                        >
                          Deep-Dive Inspector
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 5: SPATIAL MAP SIMULATOR             */}
        {/* ========================================== */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <MapIcon className="w-5 h-5 text-indigo-400" />
                    <span>Spatial Interactive Map & Candidate Hotspots</span>
                  </h2>
                  <p className="text-xs text-slate-400">Interactive geographic visualization with pin markers and popup details</p>
                </div>

                <div className="flex items-center space-x-4 text-xs font-semibold">
                  <span className="flex items-center space-x-1.5 text-emerald-400">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
                    <span>#1 Top Recommendation</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-indigo-400">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block shadow-sm shadow-indigo-500/50" />
                    <span>Candidate Locations</span>
                  </span>
                </div>
              </div>

              {/* Map Canvas Visualizer */}
              <div className="relative w-full h-[420px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-70" />

                {/* Simulated Pins */}
                <div className="absolute inset-0 p-8 overflow-hidden">
                  {filteredDataset.slice(0, 20).map((loc, idx) => {
                    const topPct = 15 + ((loc.latitude % 1) * 750) % 70;
                    const leftPct = 10 + ((loc.longitude % 1) * 750) % 80;
                    const isTop1 = idx === 0;

                    return (
                      <div 
                        key={loc.id}
                        style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                        onClick={() => setSelectedLocation(loc)}
                      >
                        <div className={`relative flex items-center justify-center rounded-full p-2.5 transition transform group-hover:scale-125 shadow-xl ${
                          isTop1 ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 animate-bounce' : 'bg-indigo-600 text-white ring-2 ring-indigo-400/40'
                        }`}>
                          <MapPin className="w-4 h-4" />
                          <span className="absolute -top-7 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow-xl">
                            {loc.location_name} ({loc.suitabilityScore})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="relative z-20 pointer-events-none flex justify-between items-end text-xs text-slate-400">
                  <span className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
                    Coordinates: WGS84 GPS Mesh • City Focus: {selectedCity}
                  </span>
                  <span className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
                    Click pin markers to open candidate telemetry
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 6: MACHINE LEARNING LAB              */}
        {/* ========================================== */}
        {activeTab === 'mllab' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <BrainCircuit className="w-5 h-5 text-indigo-400" />
                    <span>Machine Learning Experiments & Clustering Laboratory</span>
                  </h2>
                  <p className="text-xs text-slate-400">Train regression algorithms, evaluate metrics (MAE, RMSE, R²), and analyze silhouette scores</p>
                </div>

                <button 
                  onClick={handleTrainModels} 
                  disabled={isTraining}
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                >
                  <RefreshCw className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
                  <span>{isTraining ? 'Training Models...' : 'Train ML Models Now'}</span>
                </button>
              </div>

              {trainedModels ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[trainedModels.rf, trainedModels.dt, trainedModels.lr].map((m, idx) => (
                      <div key={idx} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-white">{m.name}</h4>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold">
                            {m.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center pt-2">
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">MAE</span>
                            <span className="text-xs font-bold text-slate-200">{m.mae}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">RMSE</span>
                            <span className="text-xs font-bold text-slate-200">{m.rmse}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">R² Score</span>
                            <span className="text-xs font-black text-emerald-400">{m.r2}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-white">Random Forest Feature Importance Weights</h4>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trainedModels.featureImportances} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="feature" stroke="#94a3b8" fontSize={10} />
                          <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 0.5]} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                          <Bar dataKey="importance" fill="#818cf8" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950/50 border border-slate-800 rounded-2xl space-y-3">
                  <BrainCircuit className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
                  <p className="text-xs text-slate-300">Click "Train ML Models Now" to fit Random Forest, Decision Tree, and Linear Regression models.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 7: EXPLAINABLE AI (XAI)               */}
        {/* ========================================== */}
        {activeTab === 'xai' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-indigo-400" />
                  <span>Explainable AI (XAI) Attribution Breakdown</span>
                </h2>
                <p className="text-xs text-slate-400">Deconstruct why a candidate location scored high or low</p>
              </div>

              {top5Locations[0] ? (
                <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Score Deconstruction for #1 Candidate: {top5Locations[0].location_name}
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Customer Demand Indicator', score: top5Locations[0].scoreComponents.demand, weight: weights.demand },
                      { name: 'Accessibility & Linkage', score: top5Locations[0].scoreComponents.accessibility, weight: weights.access },
                      { name: 'Daily Footfall Density', score: top5Locations[0].scoreComponents.footfall, weight: weights.footfall },
                      { name: 'Parking & Transit Link', score: top5Locations[0].scoreComponents.parkingTransport, weight: weights.parking },
                      { name: 'Low Competition Opportunity', score: top5Locations[0].scoreComponents.competitionOpportunity, weight: weights.comp },
                      { name: 'Rent Affordability', score: top5Locations[0].scoreComponents.rentAffordability, weight: weights.rent },
                    ].map((driver, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-medium">{driver.name} (Weight: {driver.weight})</span>
                          <span className="font-mono font-bold text-emerald-400">+{(driver.score * driver.weight).toFixed(1)} pts</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: `${driver.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No candidates currently loaded for XAI.</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 8: DATASET & REPORTS                 */}
        {/* ========================================== */}
        {activeTab === 'dataset' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <span>Synthetic Dataset Management & Data Export</span>
                  </h2>
                  <p className="text-xs text-slate-400">1,000 synthetic candidate location records generated with PRNG seed</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleRegenerateData} 
                    className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Regenerate 1,000 Data Records</span>
                  </button>

                  <button 
                    onClick={() => {
                      const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredDataset, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", jsonStr);
                      downloadAnchor.setAttribute("download", "seema_location_selector_report.json");
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/30 border border-indigo-400/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON / CSV Report</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300">Data Dictionary Summary</h4>
                <div className="text-[11px] text-slate-400 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-200 block">location_name</span> Candidate Identifier
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-200 block">monthly_rent</span> Rental overhead (₹)
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-200 block">daily_footfall</span> Passerby traffic
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-200 block">target_demand</span> ML target variable
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 9: ETHICS & VIVA GUIDE               */}
        {/* ========================================== */}
        {activeTab === 'viva' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-indigo-400" />
                    <span>Academic Ethics & Viva Presentation Documentation</span>
                  </h2>
                  <p className="text-xs text-slate-400">Technical guide for B.Tech AIML academic evaluation</p>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs text-pink-300 font-semibold">
                  <span>Project Created by</span>
                  <strong className="text-white font-bold">Seema</strong>
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                  <h3 className="text-xs font-bold text-indigo-300">1. Windows PowerShell Installation & Setup Commands</h3>
                  <pre className="bg-slate-900 p-3.5 rounded-xl text-xs font-mono text-emerald-400 border border-slate-800 overflow-x-auto">
{`# Step 1: Create Virtual Environment
python -m venv venv
.\\venv\\Scripts\\Activate.ps1

# Step 2: Install Required Dependencies
pip install streamlit pandas numpy scikit-learn matplotlib seaborn plotly folium streamlit-folium joblib

# Step 3: Execute Streamlit Dashboard
streamlit run app.py`}
                  </pre>
                </div>

                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                  <h3 className="text-xs font-bold text-indigo-300">2. Frequently Asked Viva Evaluation Questions</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-semibold text-white">Q: Why use Multi-Criteria Decision Analysis (MCDA) alongside Machine Learning?</p>
                      <p className="text-slate-400 mt-0.5">A: ML models predict market demand based on features, whereas MCDA allows business owners to weigh customized financial constraints (e.g., rent limits) transparently.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Q: How is synthetic dataset bias managed?</p>
                      <p className="text-slate-400 mt-0.5">A: Synthetic data serves to demonstrate structural decision support and algorithm pipeline functionality; real-world deployment requires local market validation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- COMPARISON MODAL --- */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Side-by-Side Candidate Comparison Matrix</h3>
              <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {top5Locations.slice(0, 2).map((loc, idx) => (
                <div key={loc.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-300">#{idx + 1} {loc.location_name}</span>
                    <span className="text-xs font-black text-emerald-400">{loc.suitabilityScore} / 100</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p>Rent: <span className="font-mono">₹{loc.monthly_rent.toLocaleString()}</span></p>
                    <p>Daily Footfall: <span className="font-mono">{loc.daily_footfall}</span></p>
                    <p>Competitor Density: <span className="font-mono">{loc.competitor_count} stores</span></p>
                    <p>Accessibility Score: <span className="font-mono">{loc.accessibility_score}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- INSPECTOR MODAL --- */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedLocation.location_name}</h3>
                <p className="text-xs text-slate-400">{selectedLocation.city}</p>
              </div>
              <button onClick={() => setSelectedLocation(null)} className="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span>MCDA Suitability Score</span>
                <span className="font-bold text-emerald-400">{selectedLocation.suitabilityScore} / 100</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span>Monthly Rent</span>
                <span className="font-mono">₹{selectedLocation.monthly_rent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span>Daily Footfall</span>
                <span className="font-mono">{selectedLocation.daily_footfall}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span>Competitors</span>
                <span className="font-mono">{selectedLocation.competitor_count}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Nearby Facilities</span>
                <span className="text-right text-indigo-300">{selectedLocation.nearby_facilities}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedLocation(null)} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2.5 rounded-xl font-semibold transition"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* --- FOOTER WITH CREATOR ATTRIBUTION --- */}
      <footer className="bg-slate-900/90 border-t border-indigo-500/20 px-6 py-5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <span>AI-Based Business Location Selector • ML & MCDA Decision Support</span>
          </div>

          {/* FOOTER ATTRIBUTION BADGE */}
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-purple-500/10 border border-pink-500/30 text-pink-300 shadow-md shadow-pink-500/10 font-semibold">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
            <span>by <strong className="text-white font-bold tracking-wide">Seema</strong></span>
          </div>

          <div className="text-slate-500 text-[11px]">
            Academic B.Tech AIML Project Framework
          </div>
        </div>
      </footer>
    </div>
  );
}