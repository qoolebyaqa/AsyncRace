import { NavLink } from "react-router-dom";
import headerBG from '/headerBG.png';
import styles from './header.module.scss';

function Header() {
  return ( <header className={styles.header}>
    <nav>
      <ul>
        <li>
          <NavLink to='/AsyncRace/'>GARAGE</NavLink>
        </li>
        <li>
          <NavLink to='/AsyncRace/winners'>WINNERS</NavLink>
        </li>
      </ul>
    </nav>
    <h1>Async-Race</h1>
    <div>
      <img src={headerBG} alt="start-race-pic" className={styles.header__Img}/>
    </div>
  </header> );
}

export default Header;