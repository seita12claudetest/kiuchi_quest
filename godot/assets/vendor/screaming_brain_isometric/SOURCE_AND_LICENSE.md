# Screaming Brain Studios — Isometric Tile/Object Packs (CC0)

- Source: https://screamingbrainstudios.itch.io/isotilepack (Floor Pack), https://screamingbrainstudios.itch.io/isometric-object-pack (Object Pack)
- Creator: Screaming Brain Studios
- Retrieved: 2026-07-20
- Packages: `SBS - Isometric Floor Tiles - Small 128x64.rar`, `SBS - Isometric Object Pack.rar`
- Contents: true 2:1 isometric floor tilesheets (Interior: Wood/Stone/Brick/Metal/Tile/Grill/Pattern; Exterior: Grass/Stones/Dry/Rocky/Flora/Ice/Elements) plus object tilesheets (crates, copings, stairs, temple kit).

## License

CC0 1.0 Universal / Public Domain. Free for commercial and non-commercial use, no attribution required. See `Floor_Small_128x64/License.txt` and `Object_Pack/License.txt` for the verbatim text.

## Integration note

Raw tilesheets here are multi-frame atlases (each floor sheet is an 18-frame 3x6 grid of 128x64 diamond tiles; each object sheet is a 6x4 grid of 128x128 cells) rendered with magenta (floor) or black (object) padding instead of alpha. `godot/assets/iso/*.png` holds single-frame, alpha-keyed crops actually used by `scripts/iso_prototype.gd` — regenerate those from the raw sheets here if different variants/lighting directions are needed.
