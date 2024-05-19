import  { ICarRes, IEngineRes, IWinRes } from "./types";

class ApiService {
  baseUrl: string;

  constructor () {
    this.baseUrl = 'http://localhost:3000'
  }

 async getCar(id: string): Promise<ICarRes> {
    const resp = await fetch(`${this.baseUrl}/garage/${id}`);
    const respConverted = await resp.json();
    return respConverted;
  }

  async updateCar(id: number, name: string, color: string): Promise<ICarRes> {
    const resp = await fetch(`${this.baseUrl}/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, color})
    });
    const newCar = await resp.json();
    return newCar
  }

  async deleteCar(id: number) {
    await fetch(`${this.baseUrl}/garage/${id}`, {
      method: 'DELETE'
    });
  }

  async engineCar(id: number, start: boolean): Promise<IEngineRes> {
    const resp = await fetch(`${this.baseUrl}/engine?id=${id}&status=${start? 'started' : 'stopped'}`, { method: 'PATCH'});
    return resp.json();
  }

  async driveMode (id:number) {
    const resp = await fetch(`${this.baseUrl}/engine?id=${id}&status=drive`, { method: 'PATCH' });
    return resp.json();
  }

  async createCar (car: {name: string, color: string}): Promise<ICarRes> {
    const resp = await fetch(`${this.baseUrl}/garage/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car)
    });
    const newCar = await resp.json();
    return newCar;
  }

  async getCars (query?: string): Promise<ICarRes[]> {
    const resp = await fetch(`${this.baseUrl}/garage?${query}`)
    const respConverted = await resp.json();
    return respConverted;
  }

  async getWinners (query?: string): Promise<IWinRes[]> {
    const resp = await fetch(`${this.baseUrl}/winners?${query}`)
    const respConverted = await resp.json();
    return respConverted;
  }

  async createWinner (winner: IWinRes): Promise<IWinRes> {
    const resp = await fetch(`${this.baseUrl}/winners/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winner)
    });
    const newWinner = await resp.json();
    return newWinner;
  }

  async updateWinner({id, wins, time}:{id: number, wins: number, time: number}) {    
  const resp = await fetch(`${this.baseUrl}/winners/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({wins, time})
  });
  const updatedWinner = await resp.json();
  return updatedWinner;
  }


}

export default new ApiService();