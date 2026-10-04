// Selected Lucide icons, ISC licensed. See THIRD-PARTY-NOTICES.md.
/** @type {Record<string, string>} */
const paths = {
  "arrow-right": "<path d=\"M5,12h14\" /> <path d=\"m12,5,7,7,-7,7\" />",
  "arrow-up-right": "<path d=\"M7,7h10v10\" /> <path d=\"M7,17,17,7\" />",
  "book-open": "<path d=\"M12,5v16\" /> <path d=\"M20.001,19A2,2,0,0022,17V5a2,2,0,00,-1.999,-2L16,3.002A5,5,0,0012,5a5,5,0,00,-4,-2H4a2,2,0,00,-2,2v12a2,2,0,001.999,2H8a5,5,0,014,2,5,5,0,014,-2z\" />",
  "book-text": "<path d=\"M4,19.5v-15A2.5,2.5,0,0,1,6.5,2H19a1,1,0,0,1,1,1v18a1,1,0,0,1,-1,1H6.5a1,1,0,0,1,0,-5H20\" /> <path d=\"M8,11h8\" /> <path d=\"M8,7h6\" />",
  "check": "<path d=\"M20,6,9,17l-5,-5\" />",
  "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /> <path d=\"M4,16c-1.1,0,-2,-.9,-2,-2V4c0,-1.1,.9,-2,2,-2h10c1.1,0,2,.9,2,2\" />",
  "graduation-cap": "<path d=\"M21.42,10.922a1,1,0,0,0,-.019,-1.838L12.83,5.18a2,2,0,0,0,-1.66,0L2.6,9.08a1,1,0,0,0,0,1.832l8.57,3.908a2,2,0,0,0,1.66,0z\" /> <path d=\"M22,10v6\" /> <path d=\"M6,12.5V16a6,3,0,0,0,12,0v-3.5\" />",
  "headphones": "<path d=\"M3,14h3a2,2,0,0,1,2,2v3a2,2,0,0,1,-2,2H5a2,2,0,0,1,-2,-2v-7a9,9,0,0,1,18,0v7a2,2,0,0,1,-2,2h-1a2,2,0,0,1,-2,-2v-3a2,2,0,0,1,2,-2h3\" />",
  "languages": "<path d=\"m5,8,6,6\" /> <path d=\"m4,14,6,-6,2,-3\" /> <path d=\"M2,5h12\" /> <path d=\"M7,2h1\" /> <path d=\"m22,22,-5,-10,-5,10\" /> <path d=\"M14,18h6\" />",
  "layout-grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" /> <rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" />",
  "library": "<path d=\"m16,6,4,14\" /> <path d=\"M12,6v14\" /> <path d=\"M8,8v12\" /> <path d=\"M4,4v16\" />",
  "list": "<path d=\"M3,5h.01\" /> <path d=\"M3,12h.01\" /> <path d=\"M3,19h.01\" /> <path d=\"M8,5h13\" /> <path d=\"M8,12h13\" /> <path d=\"M8,19h13\" />",
  "map-pin": "<path d=\"M20,10c0,4.993,-5.539,10.193,-7.399,11.799a1,1,0,0,1,-1.202,0C9.539,20.193,4,14.993,4,10a8,8,0,0,1,16,0\" /> <circle cx=\"12\" cy=\"10\" r=\"3\" />",
  "mic": "<path d=\"M12,19v3\" /> <path d=\"M19,10v2a7,7,0,0,1,-14,0v-2\" /> <rect x=\"9\" y=\"2\" width=\"6\" height=\"13\" rx=\"3\" />",
  "newspaper": "<path d=\"M15,18h-5\" /> <path d=\"M18,14h-8\" /> <path d=\"M4,22h16a2,2,0,0,0,2,-2V4a2,2,0,0,0,-2,-2H8a2,2,0,0,0,-2,2v16a2,2,0,0,1,-4,0v-9a2,2,0,0,1,2,-2h2\" /> <rect width=\"8\" height=\"4\" x=\"10\" y=\"6\" rx=\"1\" />",
  "notebook-pen": "<path d=\"M13.4,2H6a2,2,0,0,0,-2,2v16a2,2,0,0,0,2,2h12a2,2,0,0,0,2,-2v-7.4\" /> <path d=\"M2,6h4\" /> <path d=\"M2,10h4\" /> <path d=\"M2,14h4\" /> <path d=\"M2,18h4\" /> <path d=\"M21.378,5.626a1,1,0,1,0,-3.004,-3.004l-5.01,5.012a2,2,0,0,0,-.506,.854l-.837,2.87a.5,.5,0,0,0,.62,.62l2.87,-.837a2,2,0,0,0,.854,-.506z\" />",
  "pen-line": "<path d=\"M13,21h8\" /> <path d=\"M21.174,6.812a1,1,0,0,0,-3.986,-3.987L3.842,16.174a2,2,0,0,0,-.5,.83l-1.321,4.352a.5,.5,0,0,0,.623,.622l4.353,-1.32a2,2,0,0,0,.83,-.497z\" />",
  "play": "<path d=\"M5,5a2,2,0,0,1,3.008,-1.728l11.997,6.998a2,2,0,0,1,.003,3.458l-12,7A2,2,0,0,1,5,19z\" />",
  "search": "<path d=\"m21,21,-4.34,-4.34\" /> <circle cx=\"11\" cy=\"11\" r=\"8\" />",
  "star": "<path d=\"M11.525,2.295a.53,.53,0,0,1,.95,0l2.31,4.679a2.123,2.123,0,0,0,1.595,1.16l5.166,.756a.53,.53,0,0,1,.294,.904l-3.736,3.638a2.123,2.123,0,0,0,-.611,1.878l.882,5.14a.53,.53,0,0,1,-.771,.56l-4.618,-2.428a2.122,2.122,0,0,0,-1.973,0L6.396,21.01a.53,.53,0,0,1,-.77,-.56l.881,-5.139a2.122,2.122,0,0,0,-.611,-1.879L2.16,9.795a.53,.53,0,0,1,.294,-.906l5.165,-.755a2.122,2.122,0,0,0,1.597,-1.16z\" />",
  "wrench": "<path d=\"M14.7,6.3a1,1,0,0,0,0,1.4l1.6,1.6a1,1,0,0,0,1.4,0l3.106,-3.105c.32,-.322,.863,-.22,.983,.218a6,6,0,0,1,-8.259,7.057l-7.91,7.91a1,1,0,0,1,-2.999,-3l7.91,-7.91a6,6,0,0,1,7.057,-8.259c.438,.12,.54,.662,.219,.984z\" />",
  "x": "<path d=\"M18,6,6,18\" /> <path d=\"m6,6,12,12\" />"
};
/** @type {Record<string, string>} */
export const categoryIcons = { courses: 'book-open', exams: 'graduation-cap', vocabulary: 'languages', grammar: 'notebook-pen', listening: 'headphones', speaking: 'mic', reading: 'book-text', writing: 'pen-line', news: 'newspaper', video: 'play', tools: 'wrench', life: 'map-pin' };
/** @param {string} name */
export function icon(name) {
  return `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0,0,24,24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.library}</svg>`;
}
