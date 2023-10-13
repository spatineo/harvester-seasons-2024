const colorSets = {
  normal: {
    TRANSPARENT: { r: 0, g: 0, b: 0, a: 0 },
    KIVIMAAKELIRIKKO: { r: 0, g: 0.38, b: 0, a: 1 },
    KIVIMAANORMAALIKESA: { r: 0.38, g: 0.6, b: 0, a: 1 },
    KIVIMAKUIVAESA: { r: 0.627, g: 0.859, b: 0, a: 1 },
    TURVEMAANORMAALIKESA: { r: 1.0, g: 0.98, b: 0, a: 1 },
    TURVEMAAKUIVAKESA: { r: 1.0, g: 0.518, b: 0, a: 1 },
    KIVITURVEMAATALVI: { r: 1.0, g: 0.149, b: 0, a: 1 }
  },
  alternate: {
    TRANSPARENT: { r: 0, g: 0, b: 0, a: 0 },
    KIVIMAAKELIRIKKO: { r: 0.21, g: 0.29, b: 0.61, a: 0.9 },
    KIVIMAANORMAALIKESA: { r: 0.29, g: 0.48, b: 0.72, a: 0.9 },
    KIVIMAKUIVAESA: { r: 0.43, g: 0.65, b: 0.80, a: 0.9 },
    TURVEMAANORMAALIKESA: { r: 0.99, g: 0.85, b: 0.55, a: 0.9 },
    TURVEMAAKUIVAKESA: { r: 0.96, g: 0.49, b: 0.29, a: 0.8 },
    KIVITURVEMAATALVI: { r: 0.65, g: 0, b: 0.15, a: 0.8 }
  }
};

export const createColorPalette = (color: boolean) => {
  const selectedColors = color ? colorSets.normal : colorSets.alternate;

  return {
    palette_huono: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAANORMAALIKESA,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TURVEMAANORMAALIKESA,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TRANSPARENT
    ],
    palette_epavarma_kesa_keli: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAANORMAALIKESA,
      selectedColors.KIVIMAKUIVAESA,
      selectedColors.TURVEMAANORMAALIKESA,
      selectedColors.TURVEMAAKUIVAKESA,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TRANSPARENT
    ],
    palette_epavarma_talvi_keli: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAANORMAALIKESA,
      selectedColors.KIVIMAKUIVAESA,
      selectedColors.TURVEMAANORMAALIKESA,
      selectedColors.TURVEMAAKUIVAKESA,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TRANSPARENT
    ],
    palette_hyva_kesa_keli: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TRANSPARENT
    ],
    palette_hyva_talvi_keli: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.TRANSPARENT
    ],
    palette_base_color: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAANORMAALIKESA,
      selectedColors.KIVIMAKUIVAESA,
      selectedColors.TURVEMAANORMAALIKESA,
      selectedColors.TURVEMAAKUIVAKESA,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TRANSPARENT
    ]
  };
};
