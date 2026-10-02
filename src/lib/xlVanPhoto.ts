/**
 * Real, license-clean stock photo (Pexels License — free for commercial
 * use, no attribution required) for the XL Van vehicle card. Client
 * feedback, repeated across several rounds this session: the previous
 * XL Van image (heroPhoto.ts — a dark van on an airport service road,
 * headlights on, actual aircraft visible, a high-vis-vest-wearing
 * person faintly visible through the windscreen) read as an industrial/
 * airside ground-service vehicle, not a passenger taxi — "echt raar"
 * next to comfortPhoto.ts's clean street-side sedan shot.
 *
 * This replacement: a pure side-profile passenger minibus at a modern
 * airport terminal drop-off area — same honesty bar as every other
 * photo in this project. No visible license plate on the van itself
 * (front plate area is genuinely out of frame/not fitted in the source
 * photo), no visible company livery/branding on the vehicle's own
 * bodywork. A different, unrelated car is visible in the background
 * with its own plate — not the subject of this photo, same as
 * comfortPhoto.ts's background buildings/traffic. White rather than
 * black (comfortPhoto.ts's sedan) — deliberate: after an extensive,
 * multi-session search across Pexels/Unsplash/Pixabay specifically for
 * a BLACK van/minibus with this same clean side-profile style, every
 * clean black candidate found had a visible plate, wrong camera angle,
 * or visible branding (see git history for the full search). A
 * genuinely clean white minibus beats continuing to ship a mismatched
 * industrial-looking photo while waiting indefinitely for a black one
 * that may not exist in any free, license-clean library. Photographer
 * credit: Yazid N (Pexels photo id 39075475) — self-hosted in
 * public/images, not hotlinked.
 */
export const xlVanPhoto = {
  url: "/images/xl-van-airport.jpg",
  alt: {
    nl: "Witte taxibus geparkeerd bij een luchthaventerminal",
    en: "White passenger van parked at an airport terminal",
  },
};
