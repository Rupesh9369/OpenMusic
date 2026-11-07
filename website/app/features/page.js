import PageHead from "../../components/PageHead";
import Reveal from "../../components/Reveal";
import Download from "../../components/Download";

export const metadata = { title: "Features · OpenMusic" };

const groups = [
  {
    name: "Listen",
    items: [
      ["Two catalogues, one search", "YouTube Music first, with JioSaavn as an automatic fallback when a song is missing."],
      ["Downloads", "Save songs for offline listening. Pick streaming quality from Data saver up to High."],
      ["Synced lyrics", "Lyrics that follow the song line by line, from LRCLIB."],
      ["Your own files", "Plays the music in Music/K4 Audio on your phone or Music\\K4 Audio on your PC."],
      ["Playlist import", "Bring playlists in from Spotify and YouTube Music links."],
      ["Phone to PC transfer", "Encrypted, over your Wi-Fi, with no server in between."],
    ],
  },
  {
    name: "Sound",
    items: [
      ["10-band equalizer", "Built-in presets for the sound you want, adjusted band by band."],
      ["Audio effects", "Bass boost, wide stage, reverb, loudness normalization, pitch and skip silence."],
      ["Spatial audio", "2D, 3D, 8D and 16D modes. The sound moves around your head, applied to the song that is playing."],
    ],
  },
  {
    name: "Windows and look",
    items: [
      ["Discord status", "Shows OpenMusic and the song you are playing on Windows."],
      ["Backgrounds", "Pure Glass, Blurred Artwork and other background styles on Windows."],
      ["Updates from a file", "A popup tells you when a newer version is out, with Update and Skip buttons."],
    ],
  },
];

export default function Features() {
  return (
    <>
      <PageHead
        eyebrow="Features"
        title="Everything, in one app."
        subtitle="The full list of what OpenMusic does on Android and Windows."
      />
      <div className="mx-auto max-w-[1100px] space-y-20 px-5 pb-24">
        {groups.map((g) => (
          <section key={g.name}>
            <Reveal>
              <h2 className="font-display text-2xl font-semibold">{g.name}</h2>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map(([title, body], i) => (
                <Reveal key={title} delay={(i % 3) * 0.06} className="h-full">
                  <div className="h-full rounded-[20px] border border-line bg-card p-6 transition hover:border-fern/60">
                    <h3 className="font-display text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-body">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Download />
    </>
  );
}
