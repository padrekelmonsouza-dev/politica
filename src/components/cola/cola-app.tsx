import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import {
  COLA_DEMO_DISCLAIMER,
  POSITIONS,
  type Candidate,
  type PositionKey,
} from "@/data/cola-candidates";
import colaOficial from "@/assets/colinha-oficial.jpg";
import {
  clearColaSelection,
  countColaProgress,
  loadColaSelection,
  saveColaSelection,
  type ColaSelection,
} from "@/lib/cola-store";
import { downloadColaImage, generateColaImage, shareColaImage } from "@/lib/cola-image";
import { getCandidates } from "@/services/tse";
import { candidateInitials, formatColaDate, nextEmptyPosition, uniqueSorted } from "@/utils/cola";
import colaLogo from "@/assets/minha-colinha-logo.png";

import "./cola.css";

type ColaView =
  | "home"
  | "assemble"
  | "candidates"
  | "profile"
  | "cola"
  | "review"
  | "done"
  | "info"
  | "compare";

const STEPS = [
  "Escolha o cargo",
  "Conheça os candidatos",
  "Escolha seus candidatos",
  "Monte sua cola",
  "Salve no celular",
];

export function ColaApp() {
  const [view, setView] = useState<ColaView>("home");
  const [selection, setSelection] = useState<ColaSelection>({
    federal: null,
    estadual: null,
    senador1: null,
    senador2: null,
    governador: null,
    presidente: null,
  });
  const [hydrated, setHydrated] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentPosition, setCurrentPosition] = useState<PositionKey | null>(null);
  const [currentCandidateId, setCurrentCandidateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterParty, setFilterParty] = useState("");
  const [filterState, setFilterState] = useState("");
  const [lockPosition, setLockPosition] = useState(false);
  const [compareA, setCompareA] = useState("");
  const [compareB, setCompareB] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setSelection(loadColaSelection());
    setHydrated(true);
    getCandidates().then(setCandidates);
  }, []);

  useEffect(() => {
    if (hydrated) saveColaSelection(selection);
  }, [hydrated, selection]);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const byId = useMemo(
    () => Object.fromEntries(candidates.map((item) => [item.id, item])),
    [candidates],
  );
  const progress = countColaProgress(selection);
  const currentCandidate = currentCandidateId ? byId[currentCandidateId] ?? null : null;
  const parties = uniqueSorted(candidates.map((item) => item.party));
  const states = uniqueSorted(candidates.map((item) => item.state));

  const filtered = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return candidates.filter((item) => {
      const positionOk = !filterPosition || item.position === filterPosition;
      const partyOk = !filterParty || item.party === filterParty;
      const stateOk = !filterState || item.state === filterState;
      const searchOk =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.ballotName.toLowerCase().includes(term) ||
        item.number.includes(term) ||
        item.party.toLowerCase().includes(term);
      return positionOk && partyOk && stateOk && searchOk;
    });
  }, [candidates, filterParty, filterPosition, filterState, searchQuery]);

  function goHome() {
    setView("home");
    setCurrentPosition(null);
    setLockPosition(false);
  }

  function openAssemble() {
    setView("assemble");
    setCurrentPosition(null);
  }

  function openAllCandidates() {
    setCurrentPosition(null);
    setLockPosition(false);
    setFilterPosition("");
    setView("candidates");
  }

  function openPosition(key: PositionKey) {
    setCurrentPosition(key);
    setLockPosition(true);
    setFilterPosition(key);
    setSearchQuery("");
    setFilterParty("");
    setFilterState("");
    setView("candidates");
  }

  function openProfile(id: string) {
    setCurrentCandidateId(id);
    setView("profile");
  }

  function chooseCandidate(candidate: Candidate) {
    const slot = currentPosition ?? candidate.position;
    const nextSelection = { ...selection, [slot]: candidate.id };
    setSelection(nextSelection);
    setToast(`${candidate.ballotName} foi adicionado à sua cola.`);
    const next = nextEmptyPosition(nextSelection, slot);
    if (next) {
      openPosition(next.key);
      return;
    }
    setView("review");
  }

  function clearSlot(key: PositionKey) {
    setSelection((prev) => ({ ...prev, [key]: null }));
  }

  async function handleGenerate() {
    setBusy(true);
    setToast("");
    try {
      const blob = await generateColaImage(selection, byId);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(blob);
      setPreviewBlob(blob);
      setPreviewUrl(url);
      setView("done");
    } catch {
      setToast("Não foi possível gerar a imagem agora.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    if (!previewBlob) await handleGenerate();
    const blob = previewBlob ?? (await generateColaImage(selection, byId));
    await downloadColaImage(blob);
    setToast("Imagem salva.");
  }

  async function handleShare() {
    try {
      const blob = previewBlob ?? (await generateColaImage(selection, byId));
      setPreviewBlob(blob);
      const shared = await shareColaImage(blob);
      setToast(shared ? "Pronto para compartilhar." : "Seu navegador baixou a imagem.");
    } catch {
      setToast("Compartilhamento cancelado.");
    }
  }

  function confirmReset() {
    clearColaSelection();
    setSelection({
      federal: null,
      estadual: null,
      senador1: null,
      senador2: null,
      governador: null,
      presidente: null,
    });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewBlob(null);
    setShowReset(false);
    setToast("Sua cola foi apagada neste aparelho.");
    setView("home");
  }

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    setInstallEvent(null);
  }

  const navActive =
    view === "candidates" || view === "profile" || view === "compare"
      ? "candidates"
      : view === "cola" || view === "assemble" || view === "review" || view === "done"
        ? "cola"
        : view === "info"
          ? "info"
          : "home";

  return (
    <div className="cola-app">
      <div className="cola-wrap cola-app-pad">
        <header className="cola-top">
          <button type="button" className="cola-brand" onClick={goHome} aria-label="Minha Colinha 2026, ir ao início">
            <img className="cola-logo" src={colaLogo} alt="" width={44} height={44} />
            <span>
              <strong>Minha Colinha</strong>
              <span>Eleições 2026</span>
            </span>
          </button>
          <nav className="cola-desk-nav" aria-label="Navegação principal">
            <button type="button" className={navActive === "home" ? "is-active" : ""} onClick={goHome}>
              Início
            </button>
            <button
              type="button"
              className={navActive === "candidates" ? "is-active" : ""}
              onClick={openAllCandidates}
            >
              Candidatos
            </button>
            <button type="button" className={navActive === "cola" ? "is-active" : ""} onClick={() => setView("cola")}>
              Minha Cola
            </button>
            <button type="button" className={navActive === "info" ? "is-active" : ""} onClick={() => setView("info")}>
              Informações
            </button>
          </nav>
          <Link to="/" className="cola-site-link">
            Site oficial
          </Link>
        </header>

        {view === "home" && (
          <HomeScreen
            selection={selection}
            byId={byId}
            onAssemble={openAssemble}
            onCandidates={openAllCandidates}
          />
        )}

        {view === "assemble" && (
          <AssembleScreen
            selection={selection}
            byId={byId}
            progress={progress}
            onBack={goHome}
            onPick={openPosition}
            onReview={() => setView("review")}
            onCola={() => setView("cola")}
          />
        )}

        {view === "candidates" && (
          <CandidatesScreen
            title={
              currentPosition
                ? POSITIONS.find((item) => item.key === currentPosition)?.label ?? "Candidatos"
                : "Candidatos"
            }
            items={filtered}
            selection={selection}
            currentPosition={currentPosition}
            searchQuery={searchQuery}
            filterPosition={filterPosition}
            filterParty={filterParty}
            filterState={filterState}
            parties={parties}
            states={states}
            lockPosition={lockPosition}
            onSearch={setSearchQuery}
            onFilterPosition={setFilterPosition}
            onFilterParty={setFilterParty}
            onFilterState={setFilterState}
            onBack={() => setView(currentPosition ? "assemble" : "home")}
            onProfile={openProfile}
            onChoose={chooseCandidate}
            onCompare={() => setView("compare")}
            onSkip={() => {
              if (!currentPosition) {
                setView("assemble");
                return;
              }
              const start = POSITIONS.findIndex((item) => item.key === currentPosition) + 1;
              const next = POSITIONS.slice(start).find((item) => !selection[item.key]);
              if (next) openPosition(next.key);
              else setView("assemble");
            }}
          />
        )}

        {view === "profile" && currentCandidate && (
          <ProfileScreen
            candidate={currentCandidate}
            selected={Object.values(selection).includes(currentCandidate.id)}
            onBack={() => setView("candidates")}
            onChoose={() => chooseCandidate(currentCandidate)}
          />
        )}

        {view === "compare" && (
          <CompareScreen
            candidates={candidates}
            a={compareA}
            b={compareB}
            onA={setCompareA}
            onB={setCompareB}
            onBack={() => setView("candidates")}
          />
        )}

        {view === "cola" && (
          <ColaScreen
            selection={selection}
            byId={byId}
            progress={progress}
            onBack={goHome}
            onChange={openPosition}
            onReview={() => setView("review")}
            onReset={() => setShowReset(true)}
          />
        )}

        {view === "review" && (
          <ReviewScreen
            selection={selection}
            byId={byId}
            progress={progress}
            busy={busy}
            onBack={() => setView("cola")}
            onChange={openPosition}
            onGenerate={handleGenerate}
          />
        )}

        {view === "done" && (
          <DoneScreen
            previewUrl={previewUrl}
            onDownload={handleDownload}
            onShare={handleShare}
            onEdit={() => setView("cola")}
            onHome={goHome}
          />
        )}

        {view === "info" && (
          <InfoScreen
            canInstall={Boolean(installEvent)}
            onInstall={handleInstall}
            onLegal={() => setShowLegal(true)}
            onReset={() => setShowReset(true)}
          />
        )}

        {toast && (
          <p className="cola-toast" role="status">
            {toast}
          </p>
        )}
      </div>

      <div className="cola-bottom">
        <div className="cola-wrap">
          <nav aria-label="Navegação do aplicativo">
            <button type="button" className={navActive === "home" ? "is-active" : ""} onClick={goHome}>
              <span aria-hidden>🏠</span>
              Início
            </button>
            <button
              type="button"
              className={navActive === "candidates" ? "is-active" : ""}
              onClick={openAllCandidates}
            >
              <span aria-hidden>👥</span>
              Candidatos
            </button>
            <button type="button" className={navActive === "cola" ? "is-active" : ""} onClick={() => setView("cola")}>
              <span aria-hidden>🗳️</span>
              Minha Cola
            </button>
            <button type="button" className={navActive === "info" ? "is-active" : ""} onClick={() => setView("info")}>
              <span aria-hidden>ℹ️</span>
              Informações
            </button>
          </nav>
        </div>
      </div>

      {showReset && (
        <ConfirmModal
          title="Apagar minha cola"
          text="Tem certeza que deseja apagar sua cola?"
          confirmLabel="Apagar"
          onCancel={() => setShowReset(false)}
          onConfirm={confirmReset}
        />
      )}

      {showLegal && <LegalModal onClose={() => setShowLegal(false)} />}
    </div>
  );
}

type CandidateMap = Record<string, Candidate>;

function HomeScreen({
  selection,
  byId,
  onAssemble,
  onCandidates,
}: {
  selection: ColaSelection;
  byId: CandidateMap;
  onAssemble: () => void;
  onCandidates: () => void;
}) {
  return (
    <div className="cola-screen">
      <section className="cola-hero">
        <div>
          <p className="cola-kicker">Eleições 2026</p>
          <h1>
            Minha cola.
            <br />
            Minha escolha.
          </h1>
          <p>Conheça os candidatos, confira as informações e monte sua cola para o dia da votação.</p>
          <p className="cola-banner">Você escolhe. O sistema apenas organiza as informações.</p>
          <div className="cola-actions">
            <button type="button" className="cola-btn cola-btn-primary" onClick={onAssemble}>
              Montar minha cola
            </button>
            <button type="button" className="cola-btn cola-btn-secondary" onClick={onCandidates}>
              Conhecer os candidatos
            </button>
          </div>
        </div>
        <div className="cola-phone" aria-hidden>
          <div className="cola-phone-screen">
            <small>MINHA COLA</small>
            <h3>2026</h3>
            {POSITIONS.map((item) => {
              const chosen = selection[item.key] ? byId[selection[item.key] as string] : null;
              return (
                <div className="cola-mini-row" key={item.key}>
                  <span>{item.shortLabel}</span>
                  <b>{chosen?.number ?? "—"}</b>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cola-section">
        <h2>Como funciona?</h2>
        <div className="cola-steps">
          {STEPS.map((step, index) => (
            <div className="cola-step" key={step}>
              <i>{index + 1}</i>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <p className="cola-note">
          As informações vêm de fontes públicas e devem ser confirmadas no TSE.
        </p>
      </section>
    </div>
  );
}

function AssembleScreen({
  selection,
  byId,
  progress,
  onBack,
  onPick,
  onReview,
  onCola,
}: {
  selection: ColaSelection;
  byId: CandidateMap;
  progress: number;
  onBack: () => void;
  onPick: (key: PositionKey) => void;
  onReview: () => void;
  onCola: () => void;
}) {
  return (
    <section className="cola-screen cola-section">
      <button type="button" className="cola-back" onClick={onBack}>
        Voltar
      </button>
      <h1>Vamos montar sua cola</h1>
      <p className="cola-note">Escolha um cargo na ordem oficial de votação.</p>
      <ProgressBlock progress={progress} />
      <div className="cola-grid">
        {POSITIONS.map((item) => {
          const chosen = selection[item.key] ? byId[selection[item.key] as string] : null;
          return (
            <button
              type="button"
              key={item.key}
              className="cola-card cola-office"
              onClick={() => onPick(item.key)}
            >
              <em>0{item.order}</em>
              <strong>{item.label}</strong>
              <em>{item.digits} dígitos</em>
              <em>{chosen ? `${chosen.number} · ${chosen.ballotName}` : "Escolher candidato →"}</em>
            </button>
          );
        })}
      </div>
      <div className="cola-actions">
        <button type="button" className="cola-btn cola-btn-secondary" onClick={onCola}>
          Ver minha cola
        </button>
        <button type="button" className="cola-btn cola-btn-primary" onClick={onReview}>
          Revisar minha cola
        </button>
      </div>
    </section>
  );
}

function CandidatesScreen({
  title,
  items,
  selection,
  currentPosition,
  searchQuery,
  filterPosition,
  filterParty,
  filterState,
  parties,
  states,
  lockPosition,
  onSearch,
  onFilterPosition,
  onFilterParty,
  onFilterState,
  onBack,
  onProfile,
  onChoose,
  onCompare,
  onSkip,
}: {
  title: string;
  items: Candidate[];
  selection: ColaSelection;
  currentPosition: PositionKey | null;
  searchQuery: string;
  filterPosition: string;
  filterParty: string;
  filterState: string;
  parties: string[];
  states: string[];
  lockPosition: boolean;
  onSearch: (value: string) => void;
  onFilterPosition: (value: string) => void;
  onFilterParty: (value: string) => void;
  onFilterState: (value: string) => void;
  onBack: () => void;
  onProfile: (id: string) => void;
  onChoose: (candidate: Candidate) => void;
  onCompare: () => void;
  onSkip: () => void;
}) {
  const selectedId = currentPosition ? selection[currentPosition] : null;

  return (
    <section className="cola-screen cola-section">
      <button type="button" className="cola-back" onClick={onBack}>
        Voltar
      </button>
      <h1>{title}</h1>
      <p className="cola-note">Ordem dos cargos da urna. Sem ranking e sem recomendação.</p>
      <label className="sr-only" htmlFor="cola-search">
        Pesquisar candidato
      </label>
      <input
        id="cola-search"
        className="cola-search"
        value={searchQuery}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Pesquisar candidato"
      />
      <div className="cola-filters">
        <select
          className="cola-select"
          aria-label="Filtrar por cargo"
          value={filterPosition}
          disabled={lockPosition}
          onChange={(event) => onFilterPosition(event.target.value)}
        >
          <option value="">Todos os cargos</option>
          {POSITIONS.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          className="cola-select"
          aria-label="Filtrar por partido"
          value={filterParty}
          onChange={(event) => onFilterParty(event.target.value)}
        >
          <option value="">Todos os partidos</option>
          {parties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="cola-select"
          aria-label="Filtrar por UF"
          value={filterState}
          onChange={(event) => onFilterState(event.target.value)}
        >
          <option value="">Todas as UFs</option>
          {states.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <div className="cola-card">
          <p className="cola-empty">
            Ainda não há candidatos cadastrados para este filtro. Os dados de demonstração serão
            substituídos por fonte oficial do TSE.
          </p>
          {currentPosition && (
            <button type="button" className="cola-btn cola-btn-secondary" onClick={onSkip}>
              Pular este cargo
            </button>
          )}
        </div>
      ) : (
        <div className="cola-grid">
          {items.map((item) => {
            const chosen = selectedId === item.id || Object.values(selection).includes(item.id);
            return (
              <article key={item.id} className="cola-card cola-candidate">
                <CandidatePhoto candidate={item} />
                <div>
                  <strong>{item.ballotName}</strong>
                  <div>{item.number}</div>
                  <div>
                    {POSITIONS.find((pos) => pos.key === item.position)?.label} · {item.party} —{" "}
                    {item.state}
                  </div>
                  {item.demo && <span className="cola-demo">{COLA_DEMO_DISCLAIMER}</span>}
                  {chosen && <div className="cola-chosen">Na sua cola</div>}
                  <div className="cola-actions">
                    <button type="button" className="cola-btn cola-btn-secondary" onClick={() => onProfile(item.id)}>
                      Ver perfil
                    </button>
                    <button type="button" className="cola-btn cola-btn-primary" onClick={() => onChoose(item)}>
                      {chosen ? "Manter escolha" : "Escolher"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="cola-actions">
        <button type="button" className="cola-btn cola-btn-ghost" onClick={onCompare}>
          Comparar informações
        </button>
      </div>
    </section>
  );
}

function ProfileScreen({
  candidate,
  selected,
  onBack,
  onChoose,
}: {
  candidate: Candidate;
  selected: boolean;
  onBack: () => void;
  onChoose: () => void;
}) {
  const position = POSITIONS.find((item) => item.key === candidate.position);

  return (
    <article className="cola-screen cola-section">
      <button type="button" className="cola-back" onClick={onBack}>
        Voltar
      </button>
      <div className="cola-card">
        <CandidatePhoto candidate={candidate} large />
        <h1>{candidate.ballotName}</h1>
        <p>{candidate.name}</p>
        <p>
          <strong>{candidate.number}</strong> · {position?.label} · {candidate.party} — {candidate.state}
        </p>
        <p>Situação da candidatura: {candidate.status}</p>
        {candidate.demo && <p className="cola-demo">{COLA_DEMO_DISCLAIMER}</p>}
        <div className="cola-actions">
          <button type="button" className="cola-btn cola-btn-primary" onClick={onChoose}>
            {selected ? "Manter na cola" : "Escolher"}
          </button>
        </div>
      </div>

      <section className="cola-card" style={{ marginTop: 12 }}>
        <h2>Sobre o candidato</h2>
        <p>{candidate.biography}</p>
        <SourceList sources={candidate.sources} />
      </section>
      <section className="cola-card" style={{ marginTop: 12 }}>
        <h2>Trajetória</h2>
        <p>{candidate.trajectory}</p>
        <SourceList sources={candidate.sources} />
      </section>
      <section className="cola-card" style={{ marginTop: 12 }}>
        <h2>Propostas / temas apresentados</h2>
        {candidate.proposals.length ? (
          <ul>
            {candidate.proposals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="cola-empty">Nenhum tema cadastrado a partir de fonte oficial.</p>
        )}
        <SourceList sources={candidate.sources} />
      </section>
      <section className="cola-card" style={{ marginTop: 12 }}>
        <h2>Informações eleitorais</h2>
        <p>{candidate.electoralInfo}</p>
        <SourceList sources={candidate.sources} />
      </section>
      <section className="cola-card" style={{ marginTop: 12 }}>
        <h2>Fontes oficiais</h2>
        <SourceList sources={candidate.sources} />
        <p className="cola-note">Última atualização: {formatColaDate(candidate.updatedAt)}</p>
      </section>
    </article>
  );
}

function CompareScreen({
  candidates,
  a,
  b,
  onA,
  onB,
  onBack,
}: {
  candidates: Candidate[];
  a: string;
  b: string;
  onA: (value: string) => void;
  onB: (value: string) => void;
  onBack: () => void;
}) {
  const left = candidates.find((item) => item.id === a) ?? null;
  const right = candidates.find((item) => item.id === b) ?? null;
  const rows = [
    ["Cargo", left && POSITIONS.find((item) => item.key === left.position)?.label, right && POSITIONS.find((item) => item.key === right.position)?.label],
    ["Partido", left?.party, right?.party],
    ["Número", left?.number, right?.number],
    ["UF", left?.state, right?.state],
    ["Situação", left?.status, right?.status],
    ["Temas declarados", left?.proposals.join("; ") || "Não cadastrado", right?.proposals.join("; ") || "Não cadastrado"],
  ] as const;

  return (
    <section className="cola-screen cola-section">
      <button type="button" className="cola-back" onClick={onBack}>
        Voltar
      </button>
      <h1>Comparar informações</h1>
      <p className="cola-note">Comparação factual. Sem ranking e sem recomendação de voto.</p>
      <div className="cola-filters">
        <select className="cola-select" aria-label="Candidato A" value={a} onChange={(event) => onA(event.target.value)}>
          <option value="">Candidato A</option>
          {candidates.map((item) => (
            <option key={item.id} value={item.id}>
              {item.ballotName}
            </option>
          ))}
        </select>
        <select className="cola-select" aria-label="Candidato B" value={b} onChange={(event) => onB(event.target.value)}>
          <option value="">Candidato B</option>
          {candidates.map((item) => (
            <option key={item.id} value={item.id}>
              {item.ballotName}
            </option>
          ))}
        </select>
      </div>
      <div className="cola-card" style={{ overflowX: "auto" }}>
        <table className="cola-table">
          <thead>
            <tr>
              <th>Informação</th>
              <th>{left?.ballotName ?? "Candidato A"}</th>
              <th>{right?.ballotName ?? "Candidato B"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, leftValue, rightValue]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{leftValue ?? "—"}</td>
                <td>{rightValue ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ColaScreen({
  selection,
  byId,
  progress,
  onBack,
  onChange,
  onReview,
  onReset,
}: {
  selection: ColaSelection;
  byId: CandidateMap;
  progress: number;
  onBack: () => void;
  onChange: (key: PositionKey) => void;
  onReview: () => void;
  onReset: () => void;
}) {
  return (
    <section className="cola-screen cola-section">
      <button type="button" className="cola-back" onClick={onBack}>
        Voltar
      </button>
      <h1>Minha Cola</h1>
      <ProgressBlock progress={progress} />
      <div className="cola-grid">
        {POSITIONS.map((item) => {
          const chosen = selection[item.key] ? byId[selection[item.key] as string] : null;
          return (
            <div className={chosen ? "cola-card cola-slot" : "cola-card"} key={item.key}>
              {chosen && <CandidatePhoto candidate={chosen} />}
              <div>
                <em>{item.label}</em>
                {chosen ? (
                  <>
                    <strong style={{ display: "block", fontSize: 28 }}>{chosen.number}</strong>
                    <div>{chosen.ballotName}</div>
                  </>
                ) : (
                  <p className="cola-empty">Não escolhido</p>
                )}
                <div className="cola-actions">
                  <button type="button" className="cola-btn cola-btn-secondary" onClick={() => onChange(item.key)}>
                    {chosen ? "Alterar" : "Escolher candidato"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cola-actions">
        <button type="button" className="cola-btn cola-btn-primary" onClick={onReview}>
          Revisar minha cola
        </button>
        <button type="button" className="cola-btn cola-btn-ghost" onClick={onReset}>
          Apagar minha cola
        </button>
      </div>
    </section>
  );
}

function ReviewScreen({
  selection,
  byId,
  progress,
  busy,
  onBack,
  onChange,
  onGenerate,
}: {
  selection: ColaSelection;
  byId: CandidateMap;
  progress: number;
  busy: boolean;
  onBack: () => void;
  onChange: (key: PositionKey) => void;
  onGenerate: () => void;
}) {
  return (
    <section className="cola-screen cola-section">
      <button type="button" className="cola-back" onClick={onBack}>
        Voltar
      </button>
      <h1>Minha Cola 2026</h1>
      <p>Confira suas escolhas antes de salvar.</p>
      <ProgressBlock progress={progress} />
      <div className="cola-grid">
        {POSITIONS.map((item) => {
          const chosen = selection[item.key] ? byId[selection[item.key] as string] : null;
          return (
            <div className={chosen ? "cola-card cola-slot" : "cola-card"} key={item.key}>
              {chosen && <CandidatePhoto candidate={chosen} />}
              <div>
                <strong>{item.label.toUpperCase()}</strong>
                <div style={{ fontSize: 32, fontWeight: 800 }}>{chosen?.number ?? "—"}</div>
                <div>{chosen?.ballotName ?? "Não escolhido"}</div>
                <button type="button" className="cola-btn cola-btn-ghost" onClick={() => onChange(item.key)}>
                  Alterar
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cola-actions">
        <button type="button" className="cola-btn cola-btn-primary" onClick={onGenerate} disabled={busy}>
          {busy ? "Gerando..." : "Gerar minha cola"}
        </button>
      </div>
      <ColaPoster src={colaOficial} alt="Colinha 2026: candidatos da família Bolsonaro" />
    </section>
  );
}

function DoneScreen({
  previewUrl,
  onDownload,
  onShare,
  onEdit,
  onHome,
}: {
  previewUrl: string | null;
  onDownload: () => void;
  onShare: () => void;
  onEdit: () => void;
  onHome: () => void;
}) {
  return (
    <section className="cola-screen cola-section">
      <h1>Pronto! Sua cola está salva.</h1>
      <p className="cola-note">A cola fica neste aparelho. Você pode salvar a imagem para consultar no dia da votação.</p>
      <div className="cola-actions">
        <button type="button" className="cola-btn cola-btn-primary" onClick={onDownload}>
          Salvar no celular
        </button>
        <button type="button" className="cola-btn cola-btn-secondary" onClick={onShare}>
          Compartilhar
        </button>
        <button type="button" className="cola-btn cola-btn-ghost" onClick={onEdit}>
          Editar minha cola
        </button>
        <button type="button" className="cola-btn cola-btn-ghost" onClick={onHome}>
          Voltar ao início
        </button>
      </div>
      {(previewUrl || colaOficial) && (
        <ColaPoster src={previewUrl ?? colaOficial} alt="Colinha 2026: candidatos da família Bolsonaro" />
      )}
    </section>
  );
}

function InfoScreen({
  canInstall,
  onInstall,
  onLegal,
  onReset,
}: {
  canInstall: boolean;
  onInstall: () => void;
  onLegal: () => void;
  onReset: () => void;
}) {
  return (
    <section className="cola-screen cola-section">
      <h1>Informações</h1>
      <div className="cola-card">
        <h2>Sobre esta plataforma</h2>
        <p>
          Esta plataforma tem finalidade informativa e de organização pessoal. As escolhas apresentadas
          na Minha Cola são feitas exclusivamente pelo usuário. O sistema não recomenda candidatos nem
          determina preferência de voto.
        </p>
        <p>
          Consulte sempre as informações oficiais do Tribunal Superior Eleitoral antes da votação.
        </p>
      </div>
      <div className="cola-card" style={{ marginTop: 12 }}>
        <h2>Privacidade</h2>
        <p>
          Não é necessário cadastro. A cola é guardada só neste aparelho, no armazenamento local. Não
          pedimos CPF, título de eleitor, zona, seção nem endereço.
        </p>
      </div>
      <div className="cola-card" style={{ marginTop: 12 }}>
        <h2>Adicionar à tela inicial</h2>
        <p>
          No celular, use o menu do navegador e escolha “Adicionar à tela inicial” para abrir o Minha
          Cola 2026 como aplicativo.
        </p>
        {canInstall && (
          <button type="button" className="cola-btn cola-btn-primary" onClick={onInstall}>
            Adicionar à tela inicial
          </button>
        )}
      </div>
      <div className="cola-actions">
        <button type="button" className="cola-btn cola-btn-secondary" onClick={onLegal}>
          Aviso legal
        </button>
        <button type="button" className="cola-btn cola-btn-ghost" onClick={onReset}>
          Começar novamente
        </button>
      </div>
    </section>
  );
}

function ProgressBlock({ progress }: { progress: number }) {
  const ready = progress === 6;
  return (
    <div className="cola-progress">
      <p>{ready ? "Tudo pronto!" : `Sua cola está ${progress}/6 completa.`}</p>
      <div className="cola-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={6} aria-valuenow={progress}>
        <span style={{ width: `${(progress / 6) * 100}%` }} />
      </div>
    </div>
  );
}

function ColaPoster({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="cola-poster">
      <img className="cola-preview" src={src} alt={alt} width={1080} height={1920} />
    </figure>
  );
}

function CandidatePhoto({ candidate, large }: { candidate: Candidate; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const className = large ? "cola-profile-photo" : "cola-photo";
  const photo =
    !candidate.photo || failed ? (
      <div className={large ? "cola-photo-fallback cola-profile-photo" : "cola-photo-fallback"} aria-hidden>
        {candidateInitials(candidate)}
      </div>
    ) : (
      <img
        className={className}
        src={candidate.photo}
        alt={`Foto de ${candidate.ballotName}`}
        onError={() => setFailed(true)}
      />
    );
  return large ? <div className="cola-profile-photo-wrap">{photo}</div> : photo;
}

function SourceList({ sources }: { sources: Candidate["sources"] }) {
  return (
    <div className="cola-source">
      <p>Fonte da informação</p>
      <ul>
        {sources.map((item) => (
          <li key={`${item.name}-${item.url}`}>
            {item.name} —{" "}
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.url}
            </a>{" "}
            · consulta {formatColaDate(item.consultedAt)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConfirmModal({
  title,
  text,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  text: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="cola-modal" role="dialog" aria-modal="true" aria-labelledby="cola-reset-title">
      <div className="cola-modal-card">
        <h2 id="cola-reset-title">{title}</h2>
        <p>{text}</p>
        <div className="cola-actions">
          <button type="button" className="cola-btn cola-btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="cola-btn cola-btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function LegalModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="cola-modal" role="dialog" aria-modal="true" aria-labelledby="cola-legal-title">
      <div className="cola-modal-card">
        <h2 id="cola-legal-title">Sobre esta plataforma</h2>
        <p>
          Esta plataforma tem finalidade informativa e de organização pessoal. As escolhas apresentadas
          na Minha Cola são feitas exclusivamente pelo usuário. O sistema não recomenda candidatos nem
          determina preferência de voto.
        </p>
        <p>Consulte sempre as informações oficiais do Tribunal Superior Eleitoral antes da votação.</p>
        <button type="button" className="cola-btn cola-btn-primary" onClick={onClose}>
          Entendi
        </button>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}
