/* Optional asset preparation; not needed to run the website.
   Usage: node scripts/prepare-images.cjs <source-directory>
   Requires sharp. Originals remain untouched. */
const path = require('node:path');
const fs = require('node:fs');
let sharp;
try { sharp = require('sharp'); } catch { sharp = require('../.tools/node_modules/sharp'); }
const source = process.argv[2];
if (!source) throw new Error('Pass the directory containing the supplied PNG images.');
const root = path.resolve(__dirname, '..');
const crops = [
  ['a_high_end_soft_lit_minimalist_beauty_clinic_adv.png', 'hero/hero-desktop', 254, 205, 770, 805],
  ['a_high_end_soft_lit_minimalist_beauty_clinic_adv.png', 'hero/hero-mobile', 254, 205, 770, 805],
  ['a_large_collage_portfolio_style_editorial_photo_gr.png', 'model/model-front', 3, 3, 378, 333],
  ['a_large_collage_portfolio_style_editorial_photo_gr.png', 'model/model-side', 389, 3, 280, 333],
  ['a_large_collage_portfolio_style_editorial_photo_gr.png', 'model/model-closeup', 979, 3, 275, 333],
  ['a_large_collage_portfolio_style_editorial_photo_gr.png', 'editorial/philosophy', 3, 3, 378, 333],
  ['a_large_collage_portfolio_style_editorial_photo_gr.png', 'editorial/anti-aging', 389, 3, 280, 333],
  ['a_large_collage_portfolio_style_editorial_photo_gr.png', 'editorial/brightening', 979, 3, 275, 333],
  ['a_large_collage_portfolio_style_editorial_photo_gr.png', 'editorial/skin-quality', 292, 343, 233, 300],
  ['a_large_collage_portfolio_style_editorial_photo_gr.png', 'editorial/contour', 1259, 650, 270, 370],
  ['a_high_end_soft_lit_minimalist_beauty_clinic_adv.png', 'editorial/comparison', 254, 205, 770, 805],
  ['a_high_end_editorial_minimal_collage_board_layou.png', 'space/reception', 844, 3, 690, 355],
  ['a_high_end_editorial_minimal_collage_board_layou.png', 'space/consultation', 352, 659, 326, 361],
  ['wide_clean_professional_medical_aesthetics_clini.png', 'space/treatment', 4, 694, 539, 327],
  ['a_high_end_editorial_minimal_collage_board_layou.png', 'space/lounge', 950, 659, 298, 361],
  ...['ultherapy', 'thermage', 'sylfirm', 'pico-laser'].map((name, i) => [
    'a_clean_professional_high_end_medical_dermatolog.png', `treatments/${name}`, i * 384 + 4, 3, 376, 780
  ])
];
(async () => {
  for (const [file, name, left, top, width, height] of crops) {
    fs.mkdirSync(path.dirname(path.join(root, 'images', name)), { recursive: true });
    const crop = sharp(path.join(source, file)).extract({ left, top, width, height });
    await crop.clone().webp({ quality: 88 }).toFile(path.join(root, 'images', `${name}.webp`));
    if (name.startsWith('hero/') || name.startsWith('treatments/')) {
      await crop.clone().resize({ width: name.startsWith('hero/') ? 480 : 240 }).webp({ quality: 84 })
        .toFile(path.join(root, 'images', `${name}-small.webp`));
    }
  }
  console.log('Cropped assets generated without embedded advertising copy or collage dividers.');
})();
