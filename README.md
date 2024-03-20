# Futoshiki

Prolog based solver and generator for Futoshiki[1] puzzles. Based on ["Solving
Logic Puzzles in Prolog"][2] by [Jack Oliver][3].

## Building

The project was bootstrapped via `pnpm create vite` with the "react-ts"
template. The Prolog code is execute through the [WASM build][4] of
SWI-Prolog[5]. After any changes to `src/solve/solve_futoshiki.pl` please run
`pnpm generate` to make the new code available to the browser.

## Deployment

The website is automatically deployed to GitHub pages on any push to the `main`
branch.

[1]: https://en.wikipedia.org/wiki/Futoshiki
[2]: https://blademaw.github.io/posts/2023/07/prolog-puzzles/#Futoshiki
[3]: https://github.com/blademaw
[4]: https://github.com/SWI-Prolog/npm-swipl-wasm
[5]: https://www.swi-prolog.org/
