import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import apiService from '../util/http';
import { trackActions } from '../util/redux/trackSlice';
import Participant from './Participant';
import styles from './track.module.scss';
import { GlobalStateType, ICarRes } from '../util/types';
import Pagination from './Pagination';
import { queryForCars } from '../util/fnHelpers';
import Modal from './Modal';

function Track() {
  const currentPage = useSelector(
    (state: GlobalStateType) => state.Track.currentPage,
  );
  const visibleCars = useSelector(
    (state: GlobalStateType) => state.Track.visibleCars,
  );
  const winner = useSelector((state: GlobalStateType) => state.Track.winner);
  const dispatch = useDispatch();
  useEffect(() => {
    async function initFetching() {
      const totalCars = await apiService.getCars();
      const visiblePageCars = await apiService.getCars(
        queryForCars(currentPage, 7),
      );
      dispatch(trackActions.setCarsOnPage(visiblePageCars));
      dispatch(trackActions.setTotalCars(totalCars));
    }
    initFetching();
  }, []);

  return (
    <>
      {winner.length > 0 && <Modal />}
      <div className={styles.track}>
        <ul>
          {visibleCars.map((car: ICarRes) => (
            <li key={car.id}>
              <Participant name={car.name} color={car.color} id={car.id} />
            </li>
          ))}
        </ul>
        <Pagination />
      </div>
    </>
  );
}

export default Track;
