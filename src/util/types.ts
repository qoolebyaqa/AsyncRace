import { CSSProperties } from 'react';
import store from './redux/trackSlice';

export interface ICarRes {
  color: string;
  name: string;
  id: number;
}

export interface IWinRes {
  id: number;
  wins: number;
  time: number;
}
export interface IEngineRes {
  velocity: number;
  distance: number;
}

type carToAnimate = {
  id: number;
  name: string;
  duration: number;
  distance: number;
  keyframes: string;
  stylesForAnimation: CSSProperties | undefined;
};
export type winner = {
  id: number;
  name: string;
  duration: number;
  wins: number;
  color: string;
};

export type trackState = {
  cars: ICarRes[];
  startRace: boolean;
  distance: number;
  winner: winner[];
  selectedCar: ICarRes | null;
  visibleCars: ICarRes[];
  renderedCarsWithParams: carToAnimate[];
  currentPage: number;
  carsActivatedManualy: number[];
  pending: boolean;
  winnersTable: winner[];
  currentWinnersPage: number;
  allWinners: winner[];
  winnersSort: {sortType: string, orderType: string},
};
export type GlobalStateType = ReturnType<typeof store.getState>;
