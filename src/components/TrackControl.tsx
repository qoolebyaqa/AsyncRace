import { useDispatch, useSelector } from "react-redux";
import { carsGenerator, getCarParams, queryForCars } from "../util/fnHelpers";
import apiService from "../util/http";
import TrackCarControlForm from "./TrackCarControlForm";
import styles from "./trackcontrol.module.scss";
import { trackActions } from "../util/redux/trackSlice";
import { GlobalStateType } from "../util/types";

function TrackControl() {
  const distance = useSelector(
    (state: GlobalStateType) => state.Track.distance
  );
  const currentPage = useSelector(
    (state: GlobalStateType) => state.Track.currentPage
  );
  const visibleCars = useSelector(
    (state: GlobalStateType) => state.Track.visibleCars
  );
  const startRace = useSelector(
    (state: GlobalStateType) => state.Track.startRace
  );
  /* const renderedCarsWithParams = useSelector(
    (state: GlobalStateType) => state.Track.renderedCarsWithParams
  ); */
  const dispatch = useDispatch();

  async function handleGeneratingCars() {
    dispatch(trackActions.setResetRace())
    const carsArr = carsGenerator();
    await Promise.all(carsArr.map((car) => apiService.createCar(car)));
    const carsOnPage = await apiService.getCars(queryForCars(currentPage, 7));
    const carsInGarage = await apiService.getCars();
    dispatch(trackActions.setTotalCars(carsInGarage));
    dispatch(trackActions.setCarsOnPage(carsOnPage));
  }

  async function handleStartRace() {
    dispatch(trackActions.excludeAllFromCarsActivatedManualy());
    const promisesForCars = visibleCars.map(async(car) => {
      const params = await getCarParams(car.id, car.name, distance);
      dispatch(trackActions.setRenderedCarsWithParams(params));
    });
    await Promise.all(promisesForCars); 
    dispatch(trackActions.setStartRace());
      
    const driveModePromises = visibleCars.map(async(car) => {
      try {
        await apiService.driveMode(car.id);
      } catch (error) {
        dispatch(trackActions.stopAnimation(car.id));
        console.log(error);
      }
    })
    await Promise.all(driveModePromises);    
  }
  function handleResetRace() {
    /* visibleCars.map(async(car) => {
      await offEnginesOfCars(car.id);
    }) */
    dispatch(trackActions.excludeAllFromCarsActivatedManualy());
    dispatch(trackActions.setResetRace());
    dispatch(trackActions.resetRaceWinner());
  }
  return (
    <div className={styles.trackControl}>
      <div className={styles.raceButtons}>
        <button onClick={handleStartRace} disabled={startRace}>RACE ▶</button>
        <button onClick={handleResetRace} disabled={!startRace}>RESET ↻</button>
      </div>
      <TrackCarControlForm titleBtn="CREATE" />
      <TrackCarControlForm titleBtn="UPDATE" />
      <button onClick={handleGeneratingCars} disabled={startRace}>GENERATE CARS</button>
    </div>
  );
}

export default TrackControl;
