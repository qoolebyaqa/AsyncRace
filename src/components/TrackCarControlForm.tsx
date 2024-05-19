import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './trackcarform.module.scss';
import apiService from '../util/http';
import { trackActions } from '../util/redux/trackSlice';
import { GlobalStateType } from '../util/types';
import { queryForCars } from '../util/fnHelpers';
import SVGComponent from './SVGComponent';

function TrackCarControlForm({ titleBtn }: { titleBtn: string }) {
  const color = useRef<HTMLInputElement | null>(null);
  const model = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const [colorOfPreview, setcolorOfPreview] = useState({
    visible: false,
    color: '#4682B4',
  });
  const selectedCar = useSelector(
    (state: GlobalStateType) => state.Track.selectedCar,
  );
  const currentPage = useSelector(
    (state: GlobalStateType) => state.Track.currentPage,
  );

  async function handleCarForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setcolorOfPreview((prev) => ({ ...prev, visible: false }));
    const carToAdd = {
      name: model.current!.value,
      color: color.current!.value,
    };
    if (titleBtn === 'CREATE' && model.current?.value !== '') {
      const newCar = await apiService.createCar(carToAdd);
      model.current!.value = '';
      const carsOnPage = await apiService.getCars(queryForCars(currentPage, 7));
      dispatch(trackActions.setCarsOnPage(carsOnPage));
      dispatch(trackActions.addCarToTotal(newCar));
    }
    if (titleBtn === 'UPDATE' && model.current?.value !== '' && selectedCar) {
      const updatedCar = {
        id: selectedCar.id,
        name: model.current!.value,
        color: color.current!.value,
      };
      await apiService.updateCar(
        updatedCar.id,
        updatedCar.name,
        updatedCar.color,
      );
      dispatch(trackActions.updateCar(updatedCar));
      dispatch(trackActions.unSelectCar());
      color.current!.value = '#4682B4';
      model.current!.value = '';
    }
  }
  if (selectedCar && titleBtn === 'UPDATE') {
    color.current!.value = selectedCar.color;
    model.current!.value = selectedCar.name;
  }

  function handleChangeInput() {
    setcolorOfPreview((prev) => ({ ...prev, visible: true, color: color.current!.value }));
  }
  return (
    <form className={styles.form} onSubmit={handleCarForm}>
      <input
        type="text"
        ref={model}
        disabled={!selectedCar && titleBtn === 'UPDATE'}
      />
      <input
        type="color"
        ref={color}
        defaultValue="#4682B4"
        onChange={titleBtn === 'CREATE' ? handleChangeInput : undefined}
        disabled={!selectedCar && titleBtn === 'UPDATE'}
      />
      {colorOfPreview.visible && (
        <div className={styles.prview}>
          <SVGComponent color={colorOfPreview.color} />
        </div>
      )}
      <button disabled={!selectedCar && titleBtn === 'UPDATE'}>
        {titleBtn}
      </button>
    </form>
  );
}

export default TrackCarControlForm;
