---
layout: page.njk
title: "being.0: ontogenetic phototaxis on commodity silicon"
---


*being.0: emergent light-seeking learned within a single creature's lifetime,
on a self-contained microcontroller.*

## Abstract

We present being.0, a palm-sized embodied artificial creature whose entire
interior is a 32–128-unit Closed-form Continuous-time (CfC) liquid neural
network running sovereign on a single commodity microcontroller (ESP32-S3).
The creature harvests light through bilateral photovoltaic panels (which double
as direction-sensing "eyes") and is driven by an interoceptive hunger signal
(battery charge). We require light-seeking (phototaxis) to **emerge** from the
creature minimizing its own metabolic prediction error within a single
lifetime — never hardcoded, never selected across a population. Through a
sequence of ablations we show: (i) naïve normalization-based adaptation
produces apparent learning that is in fact directionless statistical drift;
(ii) an explicit generative self-model yields genuine inference with a
near-optimal policy gradient (cosine 0.998 to ground truth); (iii) gating
exploration on metabolic state resolves survival (3/5 → 5/5 seeds) by
transferring the creature's own energy economy into its learning dynamics;
(iv) residual orientation variance is a **representational-capacity** limit,
not a training-time or readout limit; and (v) widening the interior from 32 to
128 units makes the required signal linearly accessible, resolving the limit
while remaining feasible on-chip (53% SRAM, 1.74 ms/tick, measured). A trained
creature was compiled to flash and verified faithful to its simulated origin to
numerical precision.

## 1. Introduction

A central question in minimal artificial life is whether adaptive,
survival-relevant behavior can **emerge** in a genuinely small, embodied,
self-contained agent — rather than being engineered into it. being.0 is built
around four design convictions held as hard constraints throughout: (1) the
agent's competence is **ontogenetic** — learned within the individual's
lifetime, not produced by selection across a population; (2) the interior
representation is **emergent and unlabeled** — no hidden dimension is assigned a
meaning; (3) behavior is **not hardcoded** — every learning signal is the
agent's own metabolic prediction error, never a supervised target encoding the
desired geometry; (4) the agent is **sovereign** — interior, sensing, and
actuation fit one ~\$15 microcontroller. We report the developmental path by
which phototaxis emerged under these constraints, including the negative
results, which were as decisive as the positive ones.

## 2. Architecture

**Interior.** A CfC liquid-neural-network cell, hidden state `h ∈ ℝⁿ`
(n = 32 initially, 128 finally), of the NCP lineage descended from the
*C. elegans* connectome. The continuous-time gating gives the unit a learned
per-timescale response. The interior is the only state; affect/hunger enters as
*input* (prediction error fed back), never as labeled dimensions.

**Sensing (12-dim percept).** Bilateral panel voltages furnish light direction
(differential) and intensity (sum); battery charge furnishes interoceptive
hunger; additional channels (camera bright-spot bearing; a reserved
"neighbor-glow" social channel; ambient audio) are present in the percept but
inactive in the experiments reported here.

**Actuation & homeostasis.** A learned motor projection maps `h` to turn-rate
and forward velocity. The world couples action to survival thermodynamically:
orienting toward the light source increases harvest, raising charge; orienting
away lets it starve. At the world parameters used here, orientation dominates
harvest and translation proved metabolically near-redundant — a creature that
merely faces the source stays fed without approaching. Making approach itself
load-bearing requires a steeper intensity falloff; we treat that as a deliberate
next step rather than a property of the present world.

**Substrate.** The CfC forward pass was ported to the ESP32-S3 and validated
bit-faithful to the reference implementation early in development
(~390 µs/tick at n=32).

## 3. Method: a developmental ladder

Competence is staged: reactive dynamics → closed sensorimotor loop with
translation → **learning to survive** → **interior capacity**. Learning uses
metabolic prediction error (charge dynamics) as the sole reward-like signal.
No angular error or light bearing ever enters any loss. Evaluation is over
multiple random-initialization seeds; we report survival (charge maintained
above a margin) and final orientation error (degrees from optimal heading).

## 4. Experiments and results

**4.1 Naïve sleep-consolidation (negative).** Online experience batched into
periodic consolidation produced metric improvement, but mechanistic analysis
showed the gain arose from collapse of a running-normalization variance
(~4×10⁻⁴ after ~500 ticks), which amplified internal activations and
chaotically reshuffled attractors until a workable one was found. The
adaptation is ontogenetic but **directionless** — not inference. *Finding:
metric improvement ≠ working mechanism.*

**4.2 Explicit generative self-model (positive, partial).** Replacing the
incidental normalization with an explicit Gaussian model of the interior,
updated by prediction error, produced genuine inference: the self-model
modulates exploration *gain* while the policy gradient supplies *direction*,
which was near-optimal (cosine 0.998 to ground-truth phototaxis). Two deficits
remained: high seed-dependence of orientation (≈44° std) and a metabolic cost —
exploration occasionally drained charge faster than feeding.

**4.3 Charge-gated exploration (positive).** Gating exploration gain on charge
state — explore when fed, conserve when depleted, the creature's own
energy-economy applied to its learning — resolved survival: **3/5 → 5/5 seeds
survive**, mean final charge +0.218, near-zero distress epochs, orientation
quality preserved. Seed-dependence (≈44° std) was unaffected, confirming it is
not metabolic.

**4.4 Lifetime sweep (negative).** To distinguish incomplete learning from a
ceiling, lifetimes were scaled 1×–8×. Orientation-error std was flat
(44.06° → 44.89°; trending marginally worse), with specific seeds locked
(+109° throughout) or losing survival under longer lifetimes. *Finding:
the seed-variance is a structural ceiling, not unfinished development.*

**4.5 Birth-time policy diversity (positive, diagnostic).** Endowing each
individual with K candidate policies and selecting among them by lived
metabolic outcome (within one lifetime — not cross-generational) freed
policy-limited seeds (one stuck seed improved 109° → 6°, unsupervised).
Population std improved 44° → 38°, mean 73.7° → 57.5°; one fortunate seed
regressed under mixture dilution. One seed remained stuck for a deeper reason:
the *best achievable* policy fit to its interior trajectory reached only 90°,
indicating its interior **does not generate** a light-mappable signal — a
representational, not policy, failure.

**4.6 Readout vs. capacity (decisive).** Two cheap hypotheses for the
representational failure were tested before any interior-training intervention.
*(E) Nonlinear readout:* a nonlinear oracle on the n=32 interior reached 97°,
worse than the 79° linear oracle — the signal is **absent, not hidden**.
*(C) Capacity:* at n=128 the linear oracle for the stuck seed dropped 79° →
**0.09°** — the signal is linearly present once the interior is large enough.
The live n=128 sweep: all seeds survive, the formerly-stuck seed freed (12.6°),
mean error 57.5° → 44°. (n=256 regressed, attributable to the n=32-tuned
learning configuration under-navigating the larger space within one lifetime —
a configuration artifact, not a ceiling.)

**4.7 On-chip validation.** n=128 was confirmed feasible on the target
microcontroller by direct measurement: 53% of SRAM, **1.74 ms/tick** (≈4.5×
n=32, sub-linear in n² because the recurrent matmul is one component of the
tick). A trained individual was exported to PROGMEM (the on-chip RNG cannot
reproduce the host RNG, so interior weights are baked rather than regenerated)
and verified against the reference: **maximum state deviation 0.000000**,
bounded activations, ~1.78 ms/tick. The learned creature runs faithfully on
silicon.

**4.8 World v2: making approach load-bearing (constructive).** The footnote
in §2 noted that at the world parameters used, translation proved
metabolically near-redundant. We redesigned the world. A steep-falloff
regime — `k=0.3, I_0=0.5, d_0=5 m, charge_start=0.50` — opens a clean
life/death gap: an untrained creature whose forward output is suppressed
reaches charge 0.126 over a lifetime; one allowed to translate reaches
0.319. The gap (+0.193) is **386× the v1 gap of +0.0005**. Approach is now
genuinely survival-relevant.

Under the Rung-3 v4 mechanism in v2 at n=128 across 10 seeds: 9/10 survive,
mean final charge 0.636. The proof-of-concept individual learns to
*purposefully approach* — its distance to the light closes from 5 m to 2 m
over 15 epochs while forward speed climbs from 0.008 → 0.025 m/s.
Load-bearing translation, not accidental drift. The capacity finding (§4.6)
generalises one channel over: widening from 32 to 128 units frees most
approach-stuck individuals just as it freed the orientation-stuck one.

One death is informative. Initialisation `cfc_seed=99` never grows a
forward-channel subspace at any interior size — the exact twin of the
orientation-stuck initialisation at n=32, one channel over. A
minimum-mobility floor on the charge-gated motor would close it; we
deliberately left it untreated. Some individuals are failed by who they
were born as, and capacity does not always redeem it. World v1 remains the
exact default; v2 is opt-in.

**4.9 Activating the camera channel (negative-positive).** Two reserved
percept slots (`[6], [7]`) encode `(sin, cos)` of the bright-spot bearing
in the camera frame — a low-dimensional derived feature exposed as ordinary
input to the CfC. They had been hardcoded to 0.0 throughout. We added a
forward-facing camera model (half-FOV ±30°) as an opt-in and asked whether
learning recruits the channel.

*Joint regime.* With panels and camera both active in world v2 at n=128,
camera-on improved outcomes substantially (static: charge 0.79 → 0.99,
orientation error 91° → 48°), but `R_turn[6,7]` remained at noise — the
policy did *not* learn a directional bearing decoder. The improvement was
mechanistic: the new in-FOV signal enriched the gradient landscape under
R-diversity, improving candidate selection without writing the bearing
into a clean linear readout. Static-light improved more than
drifting-light — the opposite of what a bearing-decoding hypothesis
predicts, consistent with state-enrichment rather than perception.

*Dim-isolation probe.* To distinguish "channel not useful" from "channel
outcompeted by panels," we zeroed the panel *percept* dimensions while
preserving panel *harvest* physics: the creature can still feed
geometrically, but has no panel-derived sense of where the light is. Under
this ablation in v2 at n=128, **7/10 seeds converged to ~30° orientation
error — exactly the camera's half-FOV.** That is a geometric attractor
produced by the camera signal itself: the creature turns until the light
just enters its frame, then holds at the FOV edge, where `sin(bearing)`
and the camera-signal gradient are at their strongest. The decoding is
real but **edge-finding rather than center-finding** — the policy
stabilises at the steepest-gradient point in camera-input space, not at
the bearing-zero point in light-position space. `R_turn[6,7]` again
remained at noise: the decoding lives in `h`-state dynamics under
R-diversity, not in an explicit linear readout. Three of ten seeds failed
to bootstrap (never aligned for the camera to fire), echoing the
per-channel structural-exception pattern.

Together these probes establish the camera as a fundamentally usable
degree of freedom while showing that its use is *mechanistic and
distributed* rather than *explicit and read-out*. The firmware integration
(OV2640 capture, brightest-spot extraction, percept emission via HIL) is
the natural next step.

## 5. Discussion

The decisive finding is that the residual competence gap was neither a learning
nor a readout problem but an **interior-capacity** problem: 32 units cannot
represent a light-mappable signal under the stress regime; 128 can. This was
reached by systematic elimination (policy → lifetime → readout → capacity), and
the resolution did **not** require making the interior trainable/rewritable —
i.e. it was achieved without crossing into modifying the creature's
"constitution," preserving the emergent-interior constraint. Capacity was
right-sized empirically rather than maximized: 32 is provably insufficient, 128
sufficient, 256 counterproductive and costly to the sovereignty constraint. We
argue this *right-sizing-to-demand* is the correct discipline for sovereign
minimal agents.

A noted residual: at n=128 all individuals survive, but orientation *quality*
still varies by seed (two of ten seeds orient poorly, selection still
converging at end-of-life). We interpret this not as failure but as individual
variation under a solid survival floor — a population of individuals shaped by
their own initial conditions and lived experience.

The capacity finding (§4.6) and its echoes in §4.8 and §4.9 expose a
**per-channel structural-exception pattern**: at the harshness threshold for
each channel — orientation at n=32, forward at n=128 in world v2, camera under
panel ablation — a small minority of initialisations fails to grow the
required subspace and is not rescued by capacity. The same shape recurs across
orthogonal channels with no shared mechanism; it appears to be a general
property of randomly-initialised continuous-time recurrent interiors under
metabolic-error-only learning. We interpret it as honest individual variation,
not architectural failure.

The camera result also delivers a methodological caution: `R[i,j] ≈ noise` is
**not** the same as "the channel is unused" under R-diversity. A candidate
policy can be selected for the `h`-state dynamics its inputs evoke without
anywhere writing the input into a clean linear readout. The geometric
attractor in §4.9 is a behavioural signature the policy-weight diagnostic
alone would have missed.

## 6. Conclusion and future work

being.0 demonstrates emergent, ontogenetically-learned phototaxis in a
sovereign liquid-neural-network creature on commodity silicon, with the agent's
competence earned within its lifetime under strict no-hardcoding,
no-cross-generational-selection constraints. The creature is currently a
phototroph; light and hunger are the only behaviorally-active senses. Future
work follows the directions opened above. The camera channel, now activated
in simulation, is fundamentally decoded but only edge-finding and distributed
rather than read out — its firmware path (OV2640 capture, brightest-spot
extraction, HIL emission) is the active next step. The reserved
neighbour-glow channel (slot `[8]`) remains the most consequential reserved
direction: because every being.0 both *emits* light and *senses* it, two of
them placed together could discover each other with no added protocol — one
creature's expression becoming another's perception. Interior capacity is
expected to be re-grown empirically as these richer senses impose new
representational demand. World v1 is retained as the lower-demand baseline;
world v2 is the configuration under which approach is genuinely
load-bearing.
