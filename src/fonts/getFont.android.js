const font = 'Roboto';

const weights = {
  Light: '100',
  Bold: 'bold',
};

function getFont(weight) {
  return {
    fontFamily: font,
    fontWeight: weights[weight] || '400',
  };
}

export default getFont;
