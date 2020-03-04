import { theme } from "./theme";

const paletteKeys = Object.keys(theme.palette);
const makePaletteSelector = key => props => props.theme.palette[key];
export const palette = paletteKeys.reduce((result, key) => Object.assign(result, {
  [key]: makePaletteSelector(key),
}), {});
palette.fromProp = (propName, _default) =>
  ({ [propName]: propValue = _default, ...props }) =>
    props.theme.palette[propValue];

const fontKeys = Object.keys(theme.fonts);
const makeFontSelector = key => props => props.theme.fonts[key];
export const fonts = fontKeys.reduce((result, key) => Object.assign(result, {
  [key]: makeFontSelector(key)
}), {});

export const space = {
  units: multiplier => props => props.theme.space.unit * multiplier + 'px',
  borderRadius: props => props.theme.space.borderRadius + 'px',
  iconSmall: props => props.theme.space.iconSmall,
  iconMedium: props => props.theme.space.iconMedium,
  iconLarge: props => props.theme.space.iconLarge,
};