/**
 * utility file contains differen methods
*/

export const uniqueIdentifier = () => {
  return Math.floor(Math.random() * 1000000000)
}

export const capitalize = (str:string) => {
  return str.split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(" ")
}