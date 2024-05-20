import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import apiService from '../util/http';
import styles from './winnersTable.module.scss';
import { GlobalStateType } from '../util/types';
import SVGComponent from './SVGComponent';
import { queryForWinners } from '../util/fnHelpers';
import { trackActions } from '../util/redux/trackSlice';

function WinnersTable() {
  const winnersTable = useSelector(
    (state: GlobalStateType) => state.Track.winnersTable,
  );
  const sortSelector = useSelector(
    (state: GlobalStateType) => state.Track.winnersSort,
  );
  const currentWinnersPage = useSelector(
    (state: GlobalStateType) => state.Track.currentWinnersPage,
  );
  const totalWinners = useSelector(
    (state: GlobalStateType) => state.Track.allWinners,
  );
  const [sortTypeToggle, setSortTypeToggle] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function initWinnersFetching() {
      dispatch(trackActions.clearWinnerTable());
      const allWinners = await apiService.getWinners();
      dispatch(trackActions.setAllWinners(allWinners));
      const totalCars = await apiService.getCars();
      const visibleWinners = await apiService.getWinners(
        queryForWinners(currentWinnersPage, 10, sortSelector.sortType, sortSelector.orderType),
      );
      visibleWinners.map((winner) => {
        for (let i = 0; i < totalCars.length; i++) {
          if (winner.id === totalCars[i].id) {
            const mappedWinner = {
              id: winner.id,
              name: totalCars[i].name,
              duration: winner.time,
              wins: winner.wins,
              color: totalCars[i].color,
            };
            dispatch(trackActions.pushToWinnersTable(mappedWinner));
          }
        }
      });
    }

    initWinnersFetching();
  }, [currentWinnersPage, sortSelector.sortType, sortSelector.orderType]);


  function handleSort(typeSort:string) {
    if(typeSort === 'time') {
      if (sortTypeToggle) {
        dispatch(trackActions.setSortType('time'));
        dispatch(trackActions.setOrderType('ASC'));
        setSortTypeToggle(prev => !prev);
      } else {
        dispatch(trackActions.setSortType('time'));
        dispatch(trackActions.setOrderType('DESC'));
        setSortTypeToggle(prev => !prev);
      }      
    }
    if(typeSort === 'wins') {
      if (sortTypeToggle) {
        dispatch(trackActions.setSortType('wins'));
        dispatch(trackActions.setOrderType('ASC'));
        setSortTypeToggle(prev => !prev);
      } else {
        dispatch(trackActions.setSortType('wins'));
        dispatch(trackActions.setOrderType('DESC'));
        setSortTypeToggle(prev => !prev);
      }      
    }
  }
  async function handleNextPage() {
    dispatch(trackActions.setNextPageWinners());
  }
  async function handlePrevPage() {
    dispatch(trackActions.setPrevPageWinners());
  }
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHead}>
            <th>ID</th>
            <th>CAR</th>
            <th>NAME</th>
            <th onClick={() => handleSort('wins')} className={sortSelector.sortType === 'wins' ? styles.active : undefined}>WINS ⇅</th>
            <th onClick={() => handleSort('time')} className={sortSelector.sortType === 'time' ? styles.active : undefined}>BEST TIME ⇅</th>
          </tr>
        </thead>
        <tbody>
          {winnersTable.length > 0
            && winnersTable.map((winner) => (
              <tr key={winner.id}>
                <td>{winner.id}</td>
                <td>
                  <SVGComponent color={winner.color} />
                </td>
                <td>{winner.name}</td>
                <td>{winner.wins}</td>
                <td>{winner.duration}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={styles.paginationWrap}>
        <div className={styles.totalQuantity}>
        Winners ({totalWinners.length})
        </div>
        <div className={styles.paginationButtons}>
          <button onClick={handlePrevPage} disabled={currentWinnersPage === 1}>
          ↩
          </button>
          <p>{currentWinnersPage}</p>
          <button
            onClick={handleNextPage}
            disabled={currentWinnersPage === Math.ceil(totalWinners.length / 7)}
          >↪
          </button>
        </div>
        </div>
    </div>
  );
}

export default WinnersTable;