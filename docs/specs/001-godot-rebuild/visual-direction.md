# Visual Direction — 1988 Corporate Adventure

## Status

Approved implementation direction for the Godot vertical slice. The reference image is stored at `godot/assets/concepts/office-front-ui-target.png`; it is a direction board, not a shippable background.

## Design promise

The world must read as a real place before it reads as a menu. Entrances, sidewalks, desks and shop doors are spatially connected and usable. UI frames support the world instead of covering it.

## Palette and hierarchy

- World: warm concrete, weathered brown, late-afternoon amber, foliage greens.
- Primary UI: ink navy `#071923` with brass `#C6A461` hairlines.
- Accent UI: restrained burgundy `#5C1320` and oxidized teal `#5B8D86`.
- Text: warm ivory `#F2E7C9`; never pure white on large areas.
- Top HUD has three priorities: location, time/rank, condition/resources.
- Objective panel remains compact and never blocks a portal or actor.
- Dialogue occupies the lower quarter, with a speaker tab and readable 18 px body copy at the 960×540 logical viewport.

## Pixel-art rules

- Crisp nearest-neighbour rendering and integer-aligned shapes.
- Character silhouettes must be readable at gameplay scale; face, jacket, tie and legs need separate values.
- Buildings require depth, repeated window rhythm, visible entrances and at least two environmental props.
- Interactive people use a nameplate. Objects use a restrained teal/brass glint rather than unexplained circles.
- Generated concept art cannot be inserted wholesale as a playable map. It must be rebuilt as collision-aware, reusable game elements.

## First vertical-slice acceptance

- Company entrance is visually centered and its portal aligns with the door.
- Kiuchi and Tanaka can be distinguished without a label.
- The player can talk to Tanaka, inspect the company sign and inspect the vending machine.
- Initial toast does not overlap the building sign or the objective panel.
- No full-screen flat placeholder block remains in the company-front view.
- A 1280×720 capture must be reviewed before propagating the system to the remaining nine maps.

## External asset policy

CC0 sources saved in ToolVault (Kenney, Screaming Brain, Free Game UI and selected itch.io packs) may be used after recording the exact asset URL and license in the project asset ledger. Interface In Game and Game UI Database are reference-only. No visual element may be copied from PowerPro, Pokémon or Dragon Quest; those titles inform game structure and interaction philosophy only.

## Production pipeline decision — 2026-07-19

The prototype's procedural rectangles cannot reach the approved visual target. The production pipeline is therefore:

1. Dedicated original background plates for hero locations such as the company facade, aligned to real collision and portal coordinates.
2. Licensed 32×32 tile assets for reusable streets, storefronts, props and secondary maps.
3. Godot `TileMapLayer` for ground, collision, foreground and interaction layers rather than one monolithic draw script.
4. `CanvasModulate`, `DirectionalLight2D` and selected `PointLight2D` nodes for time-of-day grading and illuminated windows/signs.
5. Separate animated character sheets and portrait assets; no more code-drawn rectangle characters in release-quality scenes.
6. Nine-patch UI textures for HUD and dialogue frames so border thickness remains consistent at every resolution.

The first dedicated background is `godot/assets/backgrounds/office-front-v2.png`. It is an original generated project asset. Gameplay nodes remain independent, so the entrance, Tanaka, vending machine and sign still have real coordinates and interactions.
