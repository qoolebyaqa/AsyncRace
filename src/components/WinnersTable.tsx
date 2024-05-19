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
  const currentWinnersPage = useSelector(
    (state: GlobalStateType) => state.Track.currentWinnersPage,
  );
  const totalWinners = useSelector(
    (state: GlobalStateType) => state.Track.allWinners,
  );
  const [ASC, setASC] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function initWinnersFetching() {
      dispatch(trackActions.clearWinnerTable());
      const allWinners = await apiService.getWinners();
      dispatch(trackActions.setAllWinners(allWinners));
      const totalCars = await apiService.getCars();
      const visibleWinners = await apiService.getWinners(
        queryForWinners(currentWinnersPage),
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
  }, [currentWinnersPage]);

  /* async function handleSortWinner() {
    if (ASC) {
      const sortedWinners = await apiService.getWinners(queryForWinners(currentWinnersPage, undefined, 'ASC', 'time'))
      dispatch(trackActions.clearWinnerTable());
      dispatch(trackActions.pushToWinnersTable());
    }
  } */
  
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
          <tr>
            <th>ID</th>
            <th>CAR</th>
            <th>NAME</th>
            <th>WINS</th>
            <th>BEST TIME</th>
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
