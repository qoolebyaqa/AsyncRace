import { GlobalStateType, ICarRes } from "../util/types";
import SVGComponent from "./SVGComponent";
import styles from "./participant.module.scss";
import apiService from "../util/http";
import { useDispatch, useSelector } from "react-redux";
import { trackActions } from "../util/redux/trackSlice";
import { getCarParams, queryForCars } from "../util/fnHelpers";
import { useEffect, useRef } from "react";

function Participant({ name, color, id }: ICarRes) {
  const currentPage = useSelector(
    (state: GlobalStateType) => state.Track.currentPage
  );
  const totalCars = useSelector((state: GlobalStateType) => state.Track.cars);
  const carsInWayID = useSelector(
    (state: GlobalStateType) => state.Track.carsActivatedManualy
  );
  const carsParams = useSelector(
    (state: GlobalStateType) => state.Track.renderedCarsWithParams
  );
  const winner = useSelector((state: GlobalStateType) => state.Track.winner);
  const raceStarted = useSelector(
    (state: GlobalStateType) => state.Track.startRace
  );
  const winnersTable = useSelector(
    (state: GlobalStateType) => state.Track.winnersTable
  );
  const finish = useRef<HTMLDivElement | null>(null);
  const carElem = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(trackActions.setDistance(finish.current!.offsetLeft - carElem.current!.offsetLeft));
  },[])

  async function handleRemoveCar() {
    let carsOnPage = [];
    dispatch(trackActions.deleteCarFromTotal(id));
    dispatch(trackActions.deleteWinnerFromTable(id));
    await apiService.deleteCar(id);
    await apiService.deleteWinner(id)
    if (currentPage - (totalCars.length - 1) / 7 === 1) {
      dispatch(trackActions.carsOnPrevPage());
      carsOnPage = await apiService.getCars(queryForCars(currentPage - 1, 7));
    } else {
      carsOnPage = await apiService.getCars(queryForCars(currentPage, 7));
    }
    dispatch(trackActions.setCarsOnPage(carsOnPage));
  }
  function handleSelectCar() {
    dispatch(trackActions.selectCar(id));
  }
  async function handleStartEngine() {
    dispatch(trackActions.setRenderedCarsWithParams(await getCarParams(id, name, finish.current!.offsetLeft - carElem.current!.offsetLeft)));
    dispatch(trackActions.setCarsActivatedManualy(id));
    try {
      await apiService.driveMode(id);
    } catch (error) {
      dispatch(trackActions.stopAnimation(id));
      console.log(error);
    }
  }
  async function handleStopEngine() {
    await apiService.engineCar(id, false);
    dispatch(trackActions.excludeFromCarsActivatedManualy(id));
  }
  async function endAnimation() {
    if (winner.length < 1) {
      const newWinnerParams = carsParams.filter(car => car.id === id)[0];
      dispatch(trackActions.setRaceWinner({ name, duration: (newWinnerParams.duration/1000).toFixed(2), color }));
      const winnerToCheck = winnersTable.filter(winner => winner.id === id)[0];
      if(!winnerToCheck){
        await apiService.createWinner({id, wins: 1, time:Number((newWinnerParams.duration/1000).toFixed(2))});
        dispatch(trackActions.pushToWinnersTable({ id, name, duration: (newWinnerParams.duration/1000).toFixed(2), wins: 1, color }));
      } else {
        const dublicateFromAPI = await apiService.getWinner(id);
        if (dublicateFromAPI.time > Number((newWinnerParams.duration/1000).toFixed(2))) {
          await apiService.updateWinner({id, wins: winnerToCheck.wins + 1, time: Number((newWinnerParams.duration/1000).toFixed(2))});
        } else {
          await apiService.updateWinner({id, wins: winnerToCheck.wins + 1, time: dublicateFromAPI.time});
        }
        dispatch(trackActions.pushToWinnersTable({ id, name, duration: (newWinnerParams.duration/1000).toFixed(2), wins: winnerToCheck.wins + 1, color }));
      }      
    } else {
      return;
    }
  }

  return (
    <div className={styles.participant}>
      <div className={styles.container}>
        <div id={String(id)} className={styles.btnContainer}>
          <button onClick={handleSelectCar}>SELECT</button>
          <button onClick={handleRemoveCar}>REMOVE</button>
        </div>
        <div className={styles.btnContainer}>
          <button onClick={handleStartEngine} disabled={carsInWayID.includes(id) || raceStarted}>A</button>
          <button onClick={handleStopEngine} disabled={!carsInWayID.includes(id) || raceStarted}>B</button>
        </div>
        {(carsInWayID.includes(id) || raceStarted) && (
          <style>
            {carsParams.filter((animCar) => animCar.id === id)[0].keyframes}
          </style>
        )}
        <div
          onAnimationEnd={raceStarted ? endAnimation : undefined}
          ref={carElem}
          style={
            (carsInWayID.includes(id) || raceStarted)
              ? carsParams.filter((animCar) => animCar.id === id)[0].stylesForAnimation
              : { position: "relative" }
          }
        >
          <SVGComponent color={color} />
        </div>
      </div>
      <div className={styles.trackStart}></div>
      <p className={styles.carName}>{name}</p>
      <div className={styles.trackFinish} ref={finish}></div>
    </div>
  );
}

export default Participant;
