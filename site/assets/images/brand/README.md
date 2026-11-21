# Tanvir Anjum Personal Brand Assets

## Approved direction
A geometric, interlocking TA monogram paired with a confident wordmark. The icon is designed to remain recognizable on its own; the horizontal lockup is for larger placements.

## Palette
- Near-black: #0B0B0C
- Crimson: #C92530
- Paper white: #F5F5F2
- Neutral gray: #525252

## Wordmark descriptor
The supplied lockups use `CSE · DEVELOPER · PROBLEM SOLVER`, a current and accurate descriptor for a CSE undergraduate and developer. The descriptor is separate from the symbol and can be omitted at small sizes.

## Main files
- `assets/tanvir-mark-light.svg`: standalone mark for light backgrounds.
- `assets/tanvir-mark-dark.svg`: standalone mark for dark backgrounds.
- `assets/tanvir-mark-interactive-dark.svg`: dark-background SVG with independently addressable `#ta-t` and `#ta-a` groups for subtle pointer interaction.
- `assets/tanvir-logo-horizontal-light.svg`: horizontal full lockup for light backgrounds.
- `assets/tanvir-logo-horizontal-dark.svg`: horizontal full lockup for dark backgrounds.
- `assets/tanvir-logo-stacked-light.svg` and `...-dark.svg`: centered lockups.
- `assets/favicon.svg` and PNG sizes: browser/app icons.
- PNG counterparts: raster exports.

## Interactive integration note
For pointer response, inline `tanvir-mark-interactive-dark.svg` into the site's navigation and animate only the `#ta-t` and `#ta-a` groups. Keep the SVG accessible and preserve the enclosing home link. Avoid motion when `prefers-reduced-motion: reduce` is active. Keep pointer translation/rotation subtle and disable hover behavior for coarse pointers.

## Usage guidance
- Header: standalone mark beside existing name text.
- Favicon: `favicon.svg`.
- CV / README / social preview: horizontal lockup.
- Avoid adding the monogram to every section; leave visual breathing room.
