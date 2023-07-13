export function capitaliseFirstLetter(value) {
  let arrayOfChars = value.split('');
  arrayOfChars[0] = arrayOfChars.at(0).toUpperCase();
  return arrayOfChars.join('');
}
