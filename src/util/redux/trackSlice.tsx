import { configureStore, createSlice } from '@reduxjs/toolkit';
import { trackState } from '../types';

const trackSlice = createSlice({
  name: 'trackControl',
  initialState: {
    cars: [],
    startRace: false,
    distance: 0,
    winner: [],
    selectedCar: null,
    visibleCars: [],
    renderedCarsWithParams: [],
    currentPage: 1,
    carsActivatedManualy: [],
    pending: false,
    winnersTable: [],
    currentWinnersPage: 1,
    allWinners: [],
    winnersSort: {sortType: 'time', orderType: 'ASC'},
  } as trackState,
  reducers: {
    setTotalCars(state, action) {
      state.cars = action.payload;
    },
    setCarsOnPage(state, action) {
      state.visibleCars = action.payload;
    },
    addCarToTotal(state, action) {
      state.cars = [...state.cars, action.payload];
    },
    deleteCarFromTotal(state, action) {
      state.cars = state.cars.filter((car) => car.id !== action.payload);
    },
    selectCar(state, action) {
      state.selectedCar = state.visibleCars.filter(
        (car) => car.id === action.payload,
      )[0];
    },
    unSelectCar(state) {
      state.selectedCar = null;
    },
    updateCar(state, action) {
      state.visibleCars = state.visibleCars.map((car) => (car.id === action.payload.id
        ? { ...car, name: action.payload.name, color: action.payload.color }
        : car));
    },
    carsOnNextPage(state) {
      state.currentPage++;
    },
    carsOnPrevPage(state) {
      state.currentPage--;
    },
    setCarsActivatedManualy(state, action) {
      state.carsActivatedManualy.push(action.payload);
    },
    excludeFromCarsActivatedManualy(state, action) {
      state.carsActivatedManualy = state.carsActivatedManualy.filter(
        (carID) => carID !== action.payload,
      );
    },
    excludeAllFromCarsActivatedManualy(state) {
      state.carsActivatedManualy = [];
    },
    stopAnimation(state, action) {
      state.renderedCarsWithParams = state.renderedCarsWithParams.map(
        (participant) => {
          if (participant.id === action.payload) {
            return {
              ...participant,
              stylesForAnimation: {
                ...participant.stylesForAnimation,
                animationPlayState: 'paused',
              },
            };
          }
          return participant;
        },
      );
    },
    setStartRace(state) {
      state.startRace = true;
    },
    setResetRace(state) {
      state.startRace = false;
      state.renderedCarsWithParams = state.renderedCarsWithParams.map(
        (participant) => ({
          ...participant,
          stylesForAnimation: {
            ...participant.stylesForAnimation,
            animationPlayState: 'running',
          },
        }),
      );
    },
    setRaceWinner(state, action) {
      state.winner.push(action.payload);
    },
    resetRaceWinner(state) {
      state.winner = [];
    },
    setRenderedCarsWithParams(state, action) {
      if (
        state.renderedCarsWithParams.filter(
          (car) => car.id === action.payload.id,
        ).length > 0
      ) {
        state.renderedCarsWithParams = state.renderedCarsWithParams.map(
          (carItem) => {
            if (carItem.id === action.payload.id) {
              return {
                ...carItem,
                ...action.payload,
              };
            }
            return carItem;
          },
        );
      } else {
        state.renderedCarsWithParams.push(action.payload);
      }
    },
    setDistance(state, action) {
      state.distance = action.payload;
    },
    setNextPageWinners(state) {
      state.currentWinnersPage++;
    },
    setPrevPageWinners(state) {
      state.currentWinnersPage--;
    },
    pushToWinnersTable(state, action) {
      if (
        state.winnersTable.filter((winner) => winner.id === action.payload.id)
          .length === 1
      ) {
        state.winnersTable = state.winnersTable.map((winner) => {
          if (winner.id === action.payload.id) {
            if (winner.duration > action.payload.duration) {
              return {
                ...winner,
                wins: action.payload.wins,
                duration: action.payload.duration,
              };
            }
            return {
              ...winner,
              wins: action.payload.wins,
            };
          }
          return winner;
        });
      } else {
        state.winnersTable.push(action.payload);
      }
    },
    clearWinnerTable(state) {
      state.winnersTable = [];
    },
    deleteWinnerFromTable(state, action) {
      state.winnersTable = state.winnersTable.filter(
        (winner) => winner.id !== action.payload,
      );
    },
    setAllWinners(state, action) {
      state.allWinners = action.payload;
    },
    setSortType(state, action) {
      state.winnersSort = {...state.winnersSort, sortType: action.payload}
    },
    setOrderType(state, action) {
      state.winnersSort = {...state.winnersSort, orderType: action.payload}
    }
  },
});

const store = configureStore({
  reducer: { Track: trackSlice.reducer },
});

export const trackActions = trackSlice.actions;
export default store;
