/**
 * Original line-art silhouette of Amsterdam canal houses — hand-drawn
 * vector shapes (varying gable styles: pointed, bell, and stepped
 * "trapgevel" rooftops, the three classic Amsterdam canal-house
 * profiles), not a photo or a stock asset. Used purely as a subtle,
 * low-opacity brand motif — the one piece of "imagery" this site uses,
 * per the requirement to never fake a company/vehicle/building photo
 * that doesn't exist. `currentColor` so callers control the color via a
 * text-* className, matching every other icon in this app.
 */
export function AmsterdamSkyline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 120"
      preserveAspectRatio="none"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {/* Pointed gable */}
      <path d="M0 120V60l20-18 20 18v60Z" />
      {/* Bell gable */}
      <path d="M46 120V50c0-10 6-16 9-22 3 6 9 12 9 22v70Z" />
      {/* Stepped "trapgevel" gable */}
      <path d="M80 120V70h8V58h8V46h8V58h8V70h8v50Z" />
      <path d="M126 120V45l16-15 16 15v75Z" />
      <path d="M164 120V55c0-9 5-14 8-19 3 5 8 10 8 19v65Z" />
      <path d="M196 120V72h7V60h7V49h7V60h7V72h7v48Z" />
      <path d="M240 120V38l18-17 18 17v82Z" />
      <path d="M282 120V52c0-9 5-15 8-20 3 5 8 11 8 20v68Z" />
      <path d="M316 120V68h8V56h8V44h8V56h8V68h8v52Z" />
      <path d="M364 120V48l17-16 17 16v72Z" />
      <path d="M404 120V58c0-9 5-14 8-19 3 5 8 10 8 19v62Z" />
      <path d="M436 120V70h7V58h7V47h7V58h7V70h7v50Z" />
      <path d="M480 120V40l18-17 18 17v80Z" />
      <path d="M522 120V54c0-9 5-15 8-20 3 5 8 11 8 20v66Z" />
      <path d="M556 120V72h7V60h7V49h7V60h7V72h7v48Z" />
      <path d="M600 120V46l17-16 17 16v74Z" />
      <path d="M640 120V56c0-9 5-14 8-19 3 5 8 10 8 19v64Z" />
      <path d="M672 120V70h7V58h7V47h7V58h7V70h7v50Z" />
      <path d="M716 120V42l18-17 18 17v78Z" />
      <path d="M758 120V54c0-9 5-15 8-20 3 5 8 11 8 20v66Z" />
      {/* Plain flat-roofed building — not every canal house has a gable */}
      <path d="M792 120V78h8v42Z" />
    </svg>
  );
}
