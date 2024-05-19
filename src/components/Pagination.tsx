import { useDispatch, useSelector } from 'react-redux';
import styles from './pagination.module.scss';
import apiService from "../util/http";
import { GlobalStateType } from '../util/types';
import { trackActions } from '../util/redux/trackSlice';
import { queryForCars } from "../util/fnHelpers";

function Pagination() {
  const cars = useSelector((state: GlobalStateType) => state.Track.cars);
  const currentPage = useSelector((state: GlobalStateType) => state.Track.currentPage);
  const dispatch = useDispatch();
  async function handleNextPage() {
    dispatch(trackActions.carsOnNextPage());
    const responseNextPageCars = await apiService.getCars(queryForCars(currentPage + 1, 7));
    dispatch(trackActions.setCarsOnPage(responseNextPageCars));
  }
  async function handlePreviousPage() {
    dispatch(trackActions.carsOnPrevPage());
    const responseNextPageCars = await apiService.getCars(queryForCars(currentPage - 1, 7));
    dispatch(trackActions.setCarsOnPage(responseNextPageCars));
  }
  return ( <>
  <div className={styles.paginationWrap}>
    <p className={styles.totalQuantity}>GARAGE ({cars.length})</p>
    <div className={styles.paginationButtons}>
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>↩</button>
      <p>{currentPage}</p>
      <button onClick={handleNextPage} disabled={currentPage === Math.ceil(cars.length/7)}>↪</button>
    </div>
  </div>
  </> );
}

export default Pagination;