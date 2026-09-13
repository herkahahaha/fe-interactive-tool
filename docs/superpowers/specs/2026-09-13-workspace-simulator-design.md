# Monis / Rent Workspace Simulator Design

## Approved direction

Build a guided workspace customizer inspired by the supplied hand-drawn reference, using a warmer modern palette called “Studio daylight”: oat paper, charcoal ink, terracotta actions, muted sage, and amber highlights.

## Experience

The page opens with a concise product statement and a two-column builder. The left rail is persistent and groups the catalog into Desks, Chairs, and Accessories. The right side is a live workspace preview. Desks and chairs are mutually exclusive selections; accessories are additive and toggleable. The bottom summary stays visible and presents the current monthly rental total. “Review setup” opens a checkout summary with selected items and a save action.

## Technical structure

The Next.js client page owns selection state and renders catalog controls, summary, modal, and a Three.js orthographic scene. The scene uses simple geometric meshes so the experience works without third-party model downloads. Items are represented by typed data; the scene maps selected ids to geometry and material changes.

## Acceptance criteria

- At least two desks and two chairs are selectable.
- At least four accessories can be added or removed.
- The stage changes when selections change.
- The monthly summary and checkout modal reflect current selections.
- Layout is responsive to mobile widths, keyboard focus is visible, and reduced motion is respected.
