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
    KIVIMAAKELIRIKKO: { r: 54, g: 75, b: 154, a: 1 },
    KIVIMAANORMAALIKESA: { r: 74, g: 123, b: 183, a: 1 },
    KIVIMAKUIVAESA: { r: 110, g: 166, b: 205, a: 1 },
    TURVEMAANORMAALIKESA: { r: 254, g: 218, b: 139, a: 1 },
    TURVEMAAKUIVAKESA: { r: 246, g: 126, b: 75, a: 1 },
    KIVITURVEMAATALVI: { r: 165, g: 0, b: 38, a: 1 }
  }
};

export const createColorPalette = (color: boolean) => {
  const  thresholds = [0, 1, 2, 3, 4, 5, 6]
  const selectedColors = color ? colorSets.normal : colorSets.alternate;
  
  return {
    thresholds,
    palette_huono: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAANORMAALIKESA,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TURVEMAANORMAALIKESA,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TRANSPARENT,
    ],
    palette_epavarma_kesa_keli: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAANORMAALIKESA,
      selectedColors.KIVIMAKUIVAESA,
      selectedColors.TURVEMAANORMAALIKESA,
      selectedColors.TURVEMAAKUIVAKESA,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TRANSPARENT,
    ],
    palette_epavarma_talvi_keli: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAANORMAALIKESA,
      selectedColors.KIVIMAKUIVAESA,
      selectedColors.TURVEMAANORMAALIKESA,
      selectedColors.TURVEMAAKUIVAKESA,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TRANSPARENT,
    ],
    palette_hyva_kesa_keli: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVITURVEMAATALVI,
      selectedColors.TRANSPARENT,
    ],
    palette_hyva_talvi_keli: [
      selectedColors.TRANSPARENT,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.KIVIMAAKELIRIKKO,
      selectedColors.TRANSPARENT,
    ],
  }
};
