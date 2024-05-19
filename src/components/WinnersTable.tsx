import { useDispatch, useSelector } from "react-redux";
import apiService from "../util/http";
import styles from "./winnersTable.module.scss";
import { GlobalStateType } from "../util/types";
import SVGComponent from "./SVGComponent";
import { useEffect } from "react";
import { queryForWinners } from "../util/fnHelpers";
import { trackActions } from "../util/redux/trackSlice";

function WinnersTable() {
  const WINNERS = useSelector(
    (state: GlobalStateType) => state.Track.winnersTable
  );
  const currentWinnersPage = useSelector(
    (state: GlobalStateType) => state.Track.currentWinnersPage
  );
  const totalCars = useSelector(
    (state: GlobalStateType) => state.Track.cars
  );
  const dispatch = useDispatch();

  useEffect(() => {
    async function initWinnersFetching() {
      const visibleWinners = await apiService.getWinners(queryForWinners(currentWinnersPage));
      const visibleWinnersToDispatch = visibleWinners.map((winner) => {
        for (let i = 0; i < totalCars.length; i++) {
          if(winner.id === totalCars[i].id) {
            return {
              id:winner.id, 
              name: totalCars[i].name, 
              duration: winner.time, 
              wins: winner.wins, 
              color: totalCars[i].color              
            }
          }
        }
      });
      visibleWinnersToDispatch.forEach((winner) => {
        dispatch(trackActions.pushToWinnersTable(winner));
      });   
    }
    initWinnersFetching();
  }, [])
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
          {WINNERS.length > 0 && WINNERS.map((winner) => {
            return (
              <tr key={winner.id}>
                <td>{winner.id}</td>
                <td>
                  <SVGComponent color={winner.color} />
                </td>
                <td>{winner.name}</td>
                <td>{winner.wins}</td>
                <td>{winner.duration}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.paginationButtons}>
        <button>↩</button>
        <p>1</p>
        <button>↪</button>
      </div>
    </div>
  );
}

export default WinnersTable;
