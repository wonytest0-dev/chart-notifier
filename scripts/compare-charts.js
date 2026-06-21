const fs = require("fs");
const crypto = require("crypto");

const SOURCES = [
  {
    name: "Apple Music Daily",
    url: "https://raw.githubusercontent.com/wonytest0-dev/AMPRJFN/main/apple-music.json"
  },
  {
    name: "Apple Music Realtime",
    url: "https://raw.githubusercontent.com/sstsss-sys/realtimeapp/main/apple-music-realtime.json"
  },
  {
    name: "Apple Music Albums",
    url: "https://raw.githubusercontent.com/sstsss-sys/albmmkaa/main/apple-music-albums-realtime.json"
  },
  {
    name: "Deezer",
    url: "https://raw.githubusercontent.com/wonpyu/zzzzrrr/main/deezer-song.json"
  },
  {
    name: "Shazam",
    url: "https://raw.githubusercontent.com/wonytest0-dev/dzhmsk/main/data/jimin-deezer-shazam.json"
  },
  {
    name: "Spotify Chart",
    url: "https://raw.githubusercontent.com/spotify-chart-hit/merge/refs/heads/main/final.json"
  },
  {
    name: "Spotify Counter",
    url: "https://raw.githubusercontent.com/wonytest0-dev/PROJ1CONTR/main/counter.json"
  },
  {
    name: "YouTube",
    url: "https://raw.githubusercontent.com/wonytest0-dev/YTJFMZZ/main/data/youtube-chart.json"
  },
  {
    name: "Digital Artist",
    url: "https://raw.githubusercontent.com/wonpyu/attnnnm/main/digital-artists.json"
  }
];

const HASH_FILE = "./hashes.json";

function createHash(data) {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex");
}

async function sendNotification(title) {

  const response = await fetch(
    "https://api.onesignal.com/notifications",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${process.env.ONESIGNAL_API_KEY}`
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,

        included_segments: [
          "Subscribed Users"
        ],

        headings: {
          en: "📈 Chart Updated"
        },

        contents: {
          en: `${title} Updated`
        },

        url: "https://jimination.com/charts/charts"
      })
    }
  );

  const data = await response.text();

  console.log(data);
}

async function main() {

  let oldHashes = {};

  if (fs.existsSync(HASH_FILE)) {
    oldHashes = JSON.parse(
      fs.readFileSync(HASH_FILE, "utf8")
    );
  }

  const newHashes = {};

  for (const source of SOURCES) {

    try {

      const response =
        await fetch(source.url);

      const text =
        await response.text();

      const hash =
        createHash(text);

      newHashes[source.name] = hash;

      if (
        oldHashes[source.name] &&
        oldHashes[source.name] !== hash
      ) {

        console.log(
          `${source.name} changed`
        );

        await sendNotification(
          source.name
        );

      }

    } catch (error) {

      console.error(
        source.name,
        error
      );

    }

  }

  fs.writeFileSync(
    HASH_FILE,
    JSON.stringify(
      newHashes,
      null,
      2
    )
  );

}

main();
