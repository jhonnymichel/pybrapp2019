const font = 'HelveticaNeue';

function getFont(weight = 'Medium') {
  return {fontFamily: `${font}-${weight}`};
}

export default getFont;
