import { brands, models } from "./constants";
import apiService from "../util/http";

export function queryForCars(pageN:number = 1, pageSize:number = 7) {
  return `_page=${pageN}&_limit=${pageSize}`;
}

export function queryForWinners(pageN:number = 1, pageSize:number = 7, sort:string = 'time', order:string = 'ASC') {
  return `_page=${pageN}&_limit=${pageSize}&_sort=${sort}&_order=${order}`;
}

export function hexGenerator () {
  const hex = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  const color = [];
  for (let i = 0; i < 6; i+=1) {
    color.push(hex[Math.ceil(Math.random()*hex.length)])
  }
  return '#'.concat(color.join(''));
}

export function carsGenerator() {
  const res = [];
    for (let i = 0; i < 100; i++) {
      res.push({
        name: `${brands[Math.floor(Math.random() * brands.length)]} ${models[Math.floor(Math.random() * models.length)]}`,
        color: hexGenerator()
      })
    }
  return res;
}

export function animateCar(duration:number, finishPosition:number) {  
  const keyframes = `
  @keyframes Drive {
      0% { left: 0; }
      100% { left: ${finishPosition + 15}px; }
  }
`;
  const stylesForAnimation = {
  'position': 'relative',
  'animationName': 'Drive',
  'animationFillMode': 'forwards',
  'animationDuration': `${duration}ms` 
  };
  return [keyframes, stylesForAnimation];
}

export async function getCarParams (id:number, name:string, distance:number) {
  const response = await apiService.engineCar(id, true);
  const duration = response.distance / response.velocity;
  const [keyframes, stylesForAnimation] = animateCar(duration, distance);
  return {
    id,
    name,
    duration,
    distance,
    keyframes, 
    stylesForAnimation
  }
}

