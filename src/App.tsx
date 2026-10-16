import React, { useState, useEffect } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import { TopAppBar } from './components/TopAppBar';
import { BottomTabBar } from './components/BottomTabBar';
import { WelcomeView } from './components/WelcomeView';
import { MatchSwipeDeck } from './components/MatchSwipeDeck';
import { MatchListFeed } from './components/MatchListFeed';
import { HostPanel } from './components/HostPanel';
import { MyMatchesSquadView } from './components/MyMatchesSquadView';
import { JoinMatchSheet } from './components/JoinMatchSheet';
import { MatchDetailModal } from './components/MatchDetailModal';
import { CreateMatchModal } from './components/CreateMatchModal';
import { TacticalPitchView } from './components/TacticalPitchView';
import { INITIAL_MATCHES, INITIAL_REQUESTS } from './data/initialData';
import { Match, JoinRequest, AppTab, UserRole } from './types';
import { playTapSound, triggerHaptic } from './utils/audio';

export default function App() {
  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem('pitchmatch_matches');
      return saved ? JSON.parse(saved) : INITIAL_MATCHES;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [requests, setRequests] = useState<JoinRequest[]>(() => {
    try {
      const saved = localStorage.getItem('pitchmatch_requests');
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AppTab>('descubrir');
  const [activeRole, setActiveRole] = useState<UserRole>('jugador');

  // Modals
  const [joinModalMatch, setJoinModalMatch] = useState<Match | null>(null);
  const [detailModalMatch, setDetailModalMatch] = useState<Match | null>(null);
  const [tacticalPitchMatch, setTacticalPitchMatch] = useState<Match | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('pitchmatch_matches', JSON.stringify(matches));
    } catch {
      // silent
    }
  }, [matches]);

  useEffect(() => {
    try {
      localStorage.setItem('pitchmatch_requests', JSON.stringify(requests));
    } catch {
      // silent
    }
  }, [requests]);

  const pendingRequestsCount = requests.filter((r) => r.estado === 'pendiente').length;

  // Role toggle
  const handleRoleToggle = () => {
    const nextRole: UserRole = activeRole === 'jugador' ? 'host' : 'jugador';
    setActiveRole(nextRole);
    if (nextRole === 'host') {
      setActiveTab('host');
    } else {
      setActiveTab('descubrir');
    }
  };

  const handleRoleSelectFromWelcome = (role: 'jugador' | 'host') => {
    setActiveRole(role);
    setShowWelcome(false);
    if (role === 'host') {
      setActiveTab('host');
    } else {
      setActiveTab('descubrir');
    }
  };

  // Submit Join Request
  const handleSubmitJoinRequest = (
    reqData: Omit<JoinRequest, 'id' | 'fechaSolicitud' | 'estado'>
  ) => {
    const newReq: JoinRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      fechaSolicitud: 'Recién',
      estado: 'pendiente',
    };
    setRequests((prev) => [newReq, ...prev]);
  };

  // Accept Request
  const handleAcceptRequest = (reqId: string) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;

    // Update request state
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, estado: 'aceptada' } : r))
    );

    // Update match: reduce missing players and add player to roster
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === req.partidoId) {
          const newPlayer = {
            id: `p-${Date.now()}`,
            nombre: req.nombreJugador,
            avatar: req.avatar,
            posicion: req.posicion,
            nivel: req.nivel,
            telefono: req.telefono,
            calificacion: 4.8,
          };
          return {
            ...m,
            jugadores_faltantes: Math.max(0, m.jugadores_faltantes - 1),
            jugadores_confirmados: [...m.jugadores_confirmados, newPlayer],
          };
        }
        return m;
      })
    );
  };

  // Reject Request
  const handleRejectRequest = (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, estado: 'rechazada' } : r))
    );
  };

  // Create New Match
  const handleMatchCreated = (newMatch: Match) => {
    setMatches((prev) => [newMatch, ...prev]);
    setActiveRole('host');
    setActiveTab('host');
  };

  return (
    <DeviceFrame
      activeRole={activeRole}
      onRoleChange={(r) => {
        setActiveRole(r);
        setShowWelcome(false);
        setActiveTab(r === 'host' ? 'host' : 'descubrir');
      }}
      pendingRequestsCount={pendingRequestsCount}
    >
      {/* If Welcome screen is shown */}
      {showWelcome ? (
        <WelcomeView onSelectRole={handleRoleSelectFromWelcome} />
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Bar following contract */}
          <TopAppBar
            activeRole={activeRole}
            onRoleToggle={handleRoleToggle}
            pendingRequestsCount={pendingRequestsCount}
            onOpenRequests={() => {
              setActiveRole('host');
              setActiveTab('host');
            }}
          />

          {/* Sub Navigation Bar / Breadcrumb back to Bienvenida if needed */}
          <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => {
                playTapSound();
                setShowWelcome(true);
              }}
              className="text-slate-400 hover:text-emerald-400 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>← Bienvenida</span>
            </button>

            {/* Quick Mode Indicator Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  playTapSound();
                  setActiveTab('descubrir');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === 'descubrir'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Radar
              </button>
              <button
                onClick={() => {
                  playTapSound();
                  setActiveTab('swipe');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === 'swipe'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Match Deck ⚡
              </button>
            </div>
          </div>

          {/* Dynamic Main Body Content */}
          <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            {activeTab === 'swipe' && (
              <MatchSwipeDeck
                matches={matches}
                onJoinMatch={(m) => setJoinModalMatch(m)}
                onOpenDetails={(m) => setDetailModalMatch(m)}
                onResetDeck={() => setMatches([...INITIAL_MATCHES])}
              />
            )}

            {activeTab === 'descubrir' && (
              <MatchListFeed
                matches={matches}
                onJoinMatch={(m) => setJoinModalMatch(m)}
                onOpenDetails={(m) => setDetailModalMatch(m)}
                onCreateMatchPrompt={() => {
                  setActiveRole('host');
                  setIsCreateModalOpen(true);
                }}
              />
            )}

            {activeTab === 'host' && (
              <HostPanel
                matches={matches}
                requests={requests}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onOpenTacticalPitch={(m) => setTacticalPitchMatch(m)}
              />
            )}

            {activeTab === 'mis_partidos' && (
              <MyMatchesSquadView
                matches={matches}
                onOpenTacticalPitch={(m) => setTacticalPitchMatch(m)}
                onExploreMatches={() => setActiveTab('descubrir')}
              />
            )}
          </main>

          {/* Fixed Bottom Tab Bar */}
          <BottomTabBar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === 'host') setActiveRole('host');
              else if (tab === 'descubrir' || tab === 'swipe') setActiveRole('jugador');
            }}
            pendingRequestsCount={pendingRequestsCount}
          />
        </div>
      )}

      {/* Join Match Bottom Sheet Modal */}
      <JoinMatchSheet
        match={joinModalMatch}
        onClose={() => setJoinModalMatch(null)}
        onSubmitRequest={handleSubmitJoinRequest}
      />

      {/* Match Details Full Modal */}
      <MatchDetailModal
        match={detailModalMatch}
        onClose={() => setDetailModalMatch(null)}
        onJoin={(m) => {
          setDetailModalMatch(null);
          setJoinModalMatch(m);
        }}
        onOpenPitch={(m) => {
          setDetailModalMatch(null);
          setTacticalPitchMatch(m);
        }}
      />

      {/* Tactical Football Pitch Board */}
      <TacticalPitchView
        match={tacticalPitchMatch}
        onClose={() => setTacticalPitchMatch(null)}
        onOpenRequests={() => {
          setTacticalPitchMatch(null);
          setActiveRole('host');
          setActiveTab('host');
        }}
      />

      {/* Create Match Modal */}
      <CreateMatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onMatchCreated={handleMatchCreated}
      />
    </DeviceFrame>
  );
}
