"use client";

import {
  CalendarDays,
  Check,
  ChevronLeft,
  CircleCheck,
  Clock,
  LoaderCircle,
  Phone,
  RotateCcw,
  Scissors,
  User,
  Users,
} from "lucide-react";
import { useState, useTransition } from "react";
import { buscarHorarios, criarAgendamento } from "@/app/acoes/agendamento";
import { IconeWhatsApp } from "@/components/IconesMarcas";
import { BARBEARIA, DIAS_AGENDAMENTO, HORARIO_FUNCIONAMENTO } from "@/lib/config";
import { diaDaSemana, formatarDia, hojeSP, somarDias } from "@/lib/datas";
import { duracao, linkWhatsApp, mascaraTelefone, precoBRL, somenteDigitos } from "@/lib/formatos";
import type { Barbeiro, Servico } from "@/lib/tipos";

const PASSOS = [
  { titulo: "Serviço", icone: Scissors },
  { titulo: "Barbeiro", icone: User },
  { titulo: "Data & hora", icone: CalendarDays },
  { titulo: "Seus dados", icone: Phone },
  { titulo: "Confirmação", icone: CircleCheck },
];

const QUALQUER = "qualquer";

type Props = { servicos: Servico[]; barbeiros: Barbeiro[]; demo: boolean };

export function Agendamento({ servicos, barbeiros, demo }: Props) {
  const [passo, setPasso] = useState(0);
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [barbeiroId, setBarbeiroId] = useState<string | null>(null);
  const [dia, setDia] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [horarios, setHorarios] = useState<string[] | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState<{ barbeiroNome: string; demo: boolean } | null>(null);
  const [carregandoHorarios, iniciarCargaHorarios] = useTransition();
  const [enviando, iniciarEnvio] = useTransition();

  const servico = servicos.find((s) => s.id === servicoId);
  const barbeiro = barbeiros.find((b) => b.id === barbeiroId);
  const nomeBarbeiro = confirmado?.barbeiroNome ?? barbeiro?.nome ?? "Qualquer barbeiro disponível";
  const dadosValidos = nome.trim().length >= 2 && somenteDigitos(telefone).length >= 10;

  function irPara(n: number) {
    setErro(null);
    setPasso(n);
  }

  function escolherServico(id: string) {
    if (id !== servicoId) limparHorario();
    setServicoId(id);
    irPara(1);
  }

  function escolherBarbeiro(id: string) {
    if (id !== barbeiroId) limparHorario();
    setBarbeiroId(id);
    irPara(2);
  }

  function limparHorario() {
    setDia(null);
    setHora(null);
    setHorarios(null);
  }

  function carregarHorarios(novoDia: string) {
    if (!servicoId) return;
    setDia(novoDia);
    setHora(null);
    setHorarios(null);
    setErro(null);
    iniciarCargaHorarios(async () => {
      const r = await buscarHorarios({ dia: novoDia, servicoId, barbeiroId: barbeiroId === QUALQUER ? null : barbeiroId });
      setHorarios(r.horarios);
      if (r.erro) setErro(r.erro);
    });
  }

  function confirmar() {
    if (!servicoId || !dia || !hora) return;
    setErro(null);
    iniciarEnvio(async () => {
      const r = await criarAgendamento({
        servicoId,
        barbeiroId: barbeiroId === QUALQUER ? null : barbeiroId,
        dia,
        hora,
        nome,
        telefone,
      });
      if (r.ok) {
        setConfirmado({ barbeiroNome: r.barbeiroNome, demo: r.demo });
        return;
      }
      if (r.horarioOcupado) {
        irPara(2);
        carregarHorarios(dia);
      }
      setErro(r.erro);
    });
  }

  function recomecar() {
    setServicoId(null);
    setBarbeiroId(null);
    limparHorario();
    setConfirmado(null);
    irPara(0);
  }

  const mensagemWhatsApp = servico && dia && hora
    ? [
        `Olá! Acabei de agendar pelo site da ${BARBEARIA.nome} ${BARBEARIA.sobrenome}:`,
        "",
        `✂️ Serviço: ${servico.nome} (${precoBRL(servico.preco_centavos)})`,
        `💈 Barbeiro: ${nomeBarbeiro}`,
        `📅 Data: ${formatarDia(dia)}`,
        `🕒 Horário: ${hora}`,
        `👤 Nome: ${nome.trim()}`,
        `📱 Telefone: ${telefone}`,
      ].join("\n")
    : "";

  return (
    <section id="agendar" className="scroll-mt-16 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ambar-400">Rápido e sem ligação</p>
          <h2 className="mt-2 font-display text-5xl tracking-wide sm:text-6xl">Agende seu horário</h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-sangue-500" />
        </div>

        {demo && (
          <p className="mb-6 rounded-md border border-ambar-500/30 bg-ambar-500/10 px-4 py-3 text-center text-sm text-ambar-300">
            Modo demonstração: o Supabase ainda não foi configurado, então nenhum agendamento é salvo.
          </p>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-asfalto-900 shadow-2xl shadow-black/40">
          {!confirmado && <IndicadorPassos atual={passo} />}

          <div className="p-5 sm:p-8">
            {erro && (
              <p role="alert" className="mb-5 rounded-md border border-sangue-500/40 bg-sangue-500/10 px-4 py-3 text-sm text-red-200">
                {erro}
              </p>
            )}

            {confirmado ? (
              <Sucesso
                demo={confirmado.demo}
                resumo={<Resumo servico={servico!} barbeiro={nomeBarbeiro} dia={dia!} hora={hora!} nome={nome} telefone={telefone} />}
                linkWhatsApp={linkWhatsApp(BARBEARIA.whatsapp, mensagemWhatsApp)}
                onNovo={recomecar}
              />
            ) : (
              <>
                {passo === 0 && (
                  <Passo titulo="Escolha o serviço">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {servicos.map((s) => (
                        <Opcao key={s.id} selecionada={s.id === servicoId} onClick={() => escolherServico(s.id)}>
                          <span className="font-display text-2xl tracking-wide">{s.nome}</span>
                          <span className="mt-1 flex items-center justify-between text-sm">
                            <span className="text-ambar-400">{precoBRL(s.preco_centavos)}</span>
                            <span className="inline-flex items-center gap-1 text-creme/50">
                              <Clock className="size-3.5" /> {duracao(s.duracao_min)}
                            </span>
                          </span>
                        </Opcao>
                      ))}
                    </div>
                  </Passo>
                )}

                {passo === 1 && (
                  <Passo titulo="Escolha o barbeiro" onVoltar={() => irPara(0)}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Opcao selecionada={barbeiroId === QUALQUER} onClick={() => escolherBarbeiro(QUALQUER)}>
                        <span className="flex items-center gap-3">
                          <Avatar>
                            <Users className="size-5" />
                          </Avatar>
                          <span>
                            <span className="block font-display text-2xl tracking-wide">Qualquer barbeiro</span>
                            <span className="text-sm text-creme/50">Mais horários disponíveis</span>
                          </span>
                        </span>
                      </Opcao>
                      {barbeiros.map((b) => (
                        <Opcao key={b.id} selecionada={b.id === barbeiroId} onClick={() => escolherBarbeiro(b.id)}>
                          <span className="flex items-center gap-3">
                            <Avatar foto={b.foto_url}>{b.nome.charAt(0)}</Avatar>
                            <span>
                              <span className="block font-display text-2xl tracking-wide">{b.nome}</span>
                              {b.bio && <span className="text-sm text-creme/50">{b.bio}</span>}
                            </span>
                          </span>
                        </Opcao>
                      ))}
                    </div>
                  </Passo>
                )}

                {passo === 2 && (
                  <Passo titulo="Escolha a data e o horário" onVoltar={() => irPara(1)}>
                    <SeletorDia selecionado={dia} onSelecionar={carregarHorarios} />

                    <div className="mt-6 min-h-32">
                      {!dia && <p className="py-8 text-center text-creme/50">Selecione um dia para ver os horários livres.</p>}
                      {dia && carregandoHorarios && (
                        <p className="flex items-center justify-center gap-2 py-8 text-creme/60">
                          <LoaderCircle className="size-5 animate-spin" /> Consultando a agenda...
                        </p>
                      )}
                      {dia && !carregandoHorarios && horarios?.length === 0 && (
                        <p className="py-8 text-center text-creme/50">Nenhum horário livre neste dia. Tente outra data.</p>
                      )}
                      {dia && !carregandoHorarios && !!horarios?.length && (
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                          {horarios.map((h) => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => setHora(h)}
                              className={`rounded-md border py-2.5 font-semibold tabular-nums transition ${
                                h === hora
                                  ? "border-ambar-400 bg-ambar-500 text-asfalto-950"
                                  : "border-white/10 bg-asfalto-800 hover:border-ambar-500/60"
                              }`}
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <BotaoAvancar desabilitado={!hora} onClick={() => irPara(3)} />
                  </Passo>
                )}

                {passo === 3 && (
                  <Passo titulo="Seus dados" onVoltar={() => irPara(2)}>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (dadosValidos) irPara(4);
                      }}
                    >
                      <Campo rotulo="Nome" icone={<User className="size-4" />}>
                        <input
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          autoComplete="name"
                          maxLength={80}
                          required
                          placeholder="Como podemos te chamar?"
                          className="w-full bg-transparent py-3 outline-none placeholder:text-creme/30"
                        />
                      </Campo>
                      <Campo rotulo="Telefone / WhatsApp" icone={<Phone className="size-4" />}>
                        <input
                          value={telefone}
                          onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          required
                          placeholder="(11) 99999-9999"
                          className="w-full bg-transparent py-3 outline-none placeholder:text-creme/30"
                        />
                      </Campo>
                      <BotaoAvancar desabilitado={!dadosValidos} tipo="submit" />
                    </form>
                  </Passo>
                )}

                {passo === 4 && servico && dia && hora && (
                  <Passo titulo="Confira e confirme" onVoltar={() => irPara(3)}>
                    <Resumo servico={servico} barbeiro={nomeBarbeiro} dia={dia} hora={hora} nome={nome} telefone={telefone} />
                    <button
                      type="button"
                      onClick={confirmar}
                      disabled={enviando}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-ambar-500 py-4 font-display text-2xl tracking-wider text-asfalto-950 transition hover:bg-ambar-400 disabled:opacity-60"
                    >
                      {enviando ? <LoaderCircle className="size-6 animate-spin" /> : <Check className="size-6" />}
                      {enviando ? "Confirmando..." : "Confirmar agendamento"}
                    </button>
                  </Passo>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function IndicadorPassos({ atual }: { atual: number }) {
  return (
    <ol className="flex border-b border-white/10 bg-asfalto-950/60">
      {PASSOS.map(({ titulo, icone: Icone }, i) => {
        const estado = i < atual ? "feito" : i === atual ? "atual" : "futuro";
        return (
          <li
            key={titulo}
            aria-current={estado === "atual" ? "step" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 border-b-2 px-1 py-3 text-center transition ${
              estado === "atual" ? "border-ambar-400 text-ambar-400" : estado === "feito" ? "border-ambar-600/50 text-creme/70" : "border-transparent text-creme/30"
            }`}
          >
            {estado === "feito" ? <Check className="size-5" /> : <Icone className="size-5" />}
            <span className="hidden text-[11px] font-semibold uppercase tracking-wider sm:block">{titulo}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Passo({ titulo, onVoltar, children }: { titulo: string; onVoltar?: () => void; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        {onVoltar && (
          <button type="button" onClick={onVoltar} className="-ml-2 rounded-md p-1.5 text-creme/60 hover:bg-white/5 hover:text-creme" aria-label="Voltar">
            <ChevronLeft className="size-5" />
          </button>
        )}
        <h3 className="font-display text-3xl tracking-wide">{titulo}</h3>
      </div>
      {children}
    </div>
  );
}

function Opcao({ selecionada, onClick, children }: { selecionada: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selecionada}
      className={`flex flex-col rounded-lg border p-4 text-left transition ${
        selecionada ? "border-ambar-400 bg-ambar-500/10" : "border-white/10 bg-asfalto-800 hover:border-ambar-500/50 hover:bg-asfalto-700"
      }`}
    >
      {children}
    </button>
  );
}

function Avatar({ foto, children }: { foto?: string | null; children: React.ReactNode }) {
  return (
    <span
      className="flex size-12 shrink-0 items-center justify-center rounded-full border border-ambar-500/40 bg-couro-700 bg-cover bg-center font-display text-2xl text-ambar-300"
      style={foto ? { backgroundImage: `url(${foto})` } : undefined}
    >
      {!foto && children}
    </span>
  );
}

function SeletorDia({ selecionado, onSelecionar }: { selecionado: string | null; onSelecionar: (dia: string) => void }) {
  const hoje = hojeSP();
  const dias = Array.from({ length: DIAS_AGENDAMENTO }, (_, i) => somarDias(hoje, i));

  return (
    <div className="sem-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8">
      {dias.map((d) => {
        const fechado = !HORARIO_FUNCIONAMENTO[diaDaSemana(d)];
        const ativo = d === selecionado;
        return (
          <button
            key={d}
            type="button"
            disabled={fechado}
            onClick={() => onSelecionar(d)}
            className={`flex w-16 shrink-0 flex-col items-center rounded-lg border py-2.5 transition disabled:cursor-not-allowed disabled:opacity-30 ${
              ativo ? "border-ambar-400 bg-ambar-500 text-asfalto-950" : "border-white/10 bg-asfalto-800 hover:border-ambar-500/60"
            }`}
          >
            <span className="text-[11px] font-semibold uppercase">{d === hoje ? "Hoje" : formatarDia(d, { weekday: "short" }).replace(".", "")}</span>
            <span className="font-display text-3xl leading-none">{d.slice(8)}</span>
            <span className="text-[11px] uppercase">{formatarDia(d, { month: "short" }).replace(".", "")}</span>
          </button>
        );
      })}
    </div>
  );
}

function Campo({ rotulo, icone, children }: { rotulo: string; icone: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-creme/70">{rotulo}</span>
      <span className="flex items-center gap-3 rounded-md border border-white/10 bg-asfalto-800 px-4 text-creme/40 focus-within:border-ambar-400">
        {icone}
        <span className="flex-1 text-creme">{children}</span>
      </span>
    </label>
  );
}

function BotaoAvancar({ desabilitado, onClick, tipo = "button" }: { desabilitado: boolean; onClick?: () => void; tipo?: "button" | "submit" }) {
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={desabilitado}
      className="mt-6 w-full rounded-md bg-ambar-500 py-3.5 font-display text-2xl tracking-wider text-asfalto-950 transition hover:bg-ambar-400 disabled:cursor-not-allowed disabled:bg-asfalto-600 disabled:text-creme/40"
    >
      Continuar
    </button>
  );
}

function Resumo(props: { servico: Servico; barbeiro: string; dia: string; hora: string; nome: string; telefone: string }) {
  const linhas = [
    { rotulo: "Serviço", valor: `${props.servico.nome} · ${duracao(props.servico.duracao_min)}` },
    { rotulo: "Barbeiro", valor: props.barbeiro },
    { rotulo: "Data", valor: formatarDia(props.dia) },
    { rotulo: "Horário", valor: props.hora },
    { rotulo: "Cliente", valor: `${props.nome.trim()} · ${props.telefone}` },
  ];
  return (
    <dl className="divide-y divide-white/5 rounded-lg border border-white/10 bg-asfalto-950/60">
      {linhas.map((l) => (
        <div key={l.rotulo} className="flex justify-between gap-4 px-4 py-3 text-sm">
          <dt className="text-creme/50">{l.rotulo}</dt>
          <dd className="text-right font-semibold first-letter:uppercase">{l.valor}</dd>
        </div>
      ))}
      <div className="flex justify-between gap-4 px-4 py-3">
        <dt className="text-creme/50">Total</dt>
        <dd className="font-display text-2xl text-ambar-400">{precoBRL(props.servico.preco_centavos)}</dd>
      </div>
    </dl>
  );
}

function Sucesso({ demo, resumo, linkWhatsApp, onNovo }: { demo: boolean; resumo: React.ReactNode; linkWhatsApp: string; onNovo: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-ambar-500/15 text-ambar-400">
        <CircleCheck className="size-9" />
      </div>
      <h3 className="font-display text-4xl tracking-wide">Horário reservado!</h3>
      <p className="mx-auto mt-2 max-w-sm text-creme/60">
        {demo ? "Simulação concluída (modo demonstração)." : "Te esperamos na Rota 66. Chegue com 5 minutos de antecedência."}
      </p>

      <div className="my-6 text-left">{resumo}</div>

      <a
        href={linkWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] py-3.5 font-bold text-asfalto-950 transition hover:brightness-110"
      >
        <IconeWhatsApp /> Enviar resumo no WhatsApp
      </a>
      <button
        type="button"
        onClick={onNovo}
        className="mt-3 inline-flex items-center gap-2 py-2 text-sm text-creme/60 hover:text-ambar-400"
      >
        <RotateCcw className="size-4" /> Fazer outro agendamento
      </button>
    </div>
  );
}
