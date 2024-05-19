import { useDispatch, useSelector } from 'react-redux';
import styles from './modal.module.scss';
import { GlobalStateType } from '../util/types';
import { trackActions } from '../util/redux/trackSlice';

function Modal() {
  const winner = useSelector((state: GlobalStateType) => state.Track.winner);
  /* const visibleCars = useSelector((state: GlobalStateType) => state.Track.visibleCars); */
  const dispatch = useDispatch();

  function handleOkClick() {
    dispatch(trackActions.resetRaceWinner());
    dispatch(trackActions.excludeAllFromCarsActivatedManualy());
    dispatch(trackActions.setResetRace());
    /* visibleCars.map(async(car) => {
      await offEnginesOfCars(car.id);
    }) */
  }
  return (
    <div className={styles.wrapper__modal}>
      <div className={styles.modal__details}>
        <div className={styles.modal__details__name}>
          <p>
            {winner[0].name}
            {' '}
            won this race with the best time
            {' '}
            {winner[0].duration}
            {' '}
            seconds
          </p>
          <button onClick={handleOkClick}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
