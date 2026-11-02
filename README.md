# coins-img

Coin logos downloaded from CoinMarketCap and published as static PNG files.

## Public image URLs

GitHub Pages publishes the `static` directory at
`https://ferdo29.github.io/coins-img/static/` after each push to `main`.
For example:

- `https://ferdo29.github.io/coins-img/static/img/thumb/bitcoin.png`
- `https://ferdo29.github.io/coins-img/static/img/small/bitcoin.png`
- `https://ferdo29.github.io/coins-img/static/img/large/bitcoin.png`
- `https://ferdo29.github.io/coins-img/static/img/orig/bitcoin.png`

Use the coin slug as the PNG filename. These URLs serve static files; they do
not provide an API for searching coins.

## Download and generate images

Install dependencies with `bun install`, set `CMC_PRO_API_KEY` in `.env`, and
run `bun run index.ts`. Image resizing also requires `ffmpeg`.

The `.env` file is ignored by Git.
