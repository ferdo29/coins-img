import { CoinMarketCap } from "@coinmarketcap/sdk";
import axios from "axios";
import { mkdir } from "node:fs/promises";

const sizes = {
  thumb: 150,
  small: 100,
  large: 200,
} as const;

const cmc = new CoinMarketCap({
  apiKey: process.env.CMC_PRO_API_KEY,
});

const coinmarketcapApi = axios.create({
  baseURL: "https://s2.coinmarketcap.com",
  headers: {
    "X-CMC_PRO_API_KEY": process.env.CMC_PRO_API_KEY,
  },
});

async function downloadLogo(id: number, filename: string) {
  const response = await coinmarketcapApi.get(
    `/static/img/coins/200x200/${id}.png`,
    {
      responseType: "arraybuffer",

      timeout: 10000,
    },
  );
  const path = `./static/img/orig/${filename}.png`
  await Bun.write(path, response.data);
  return path;
}

async function resizeLogo(input: string, slug: string) {
  await mkdir("./static/img", { recursive: true });

  await Promise.all(
    Object.entries(sizes).map(async ([name, size]) => {
      const output = `./static/img/${name}/${slug}.png`;
      const proc = Bun.spawn(
        [
          `ffmpeg`,
          `-i`,
          input,
          `-vf`,
          `scale=${size}:${size}`,
          `-pix_fmt`,
          `rgba`,
          output,
        ],
        {
          stdout: "ignore",
          stderr: "pipe",
        },
      );

      const exitCode = await proc.exited;

      if (exitCode !== 0) {
        throw new Error(`FFmpeg failed: ${output}`);
      }
    }),
  );
}

const { data, error } = await cmc.api.cryptocurrency.map({
  query: {
    limit: 500,
    sort: "cmc_rank",
    aux: "platform,first_historical_data,last_historical_data,is_active,status",
  },
});
if (error) throw error;

const slugs = data?.data.flatMap((v) => ({ slug: v.slug, id: v.id })) || [];

for (const { slug, id } of slugs) {
  try {
    const res = await downloadLogo(id, slug)
    resizeLogo(res, slug)
    console.info(`Downloaded ${slug}`)
  } catch (e) {
    console.error(slug, e)
  }
}
