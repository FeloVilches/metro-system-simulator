import Station from "./Station";
import LineSegment from "./LineSegment";
import Train from "./Train";
import * as _ from "lodash";

export default class Line{

  private _stations: Station[];
  private _accumDistances: number[];

  constructor(stations: Station[], distanceFromPrev: number[]){

    this._stations = stations;
    let distances:any = [];

    this._accumDistances = [0];

    for(let i=0; i<distanceFromPrev.length; i++){
      let prev = _.last(this._accumDistances);
      this._accumDistances.push(prev + distanceFromPrev[i]);
    }

    if(!this.stations[0].isTerminal) throw Error("First station must be a terminal.");

    if(!(<Station>_.last(this.stations)).isTerminal) throw Error("Last station must be a terminal.");
  }

  public get stations(){
    return this._stations;
  }

  public getDistance(index1:number, index2:number){
    let accum = this._accumDistances;
    if(accum.length <= index2) throw Error("Argument out of bounds");
    return Math.abs(accum[index2] - accum[index1]);
  }

  public get fullLength(){
    return this.getDistance(0, this._accumDistances.length-1);
  }


  public isDangerous(allTrains: Train[], maximumDistanceAllowed: number){

    let tooClose: Function = (t1: number, t2: number) => Math.abs(t1 - t2) < maximumDistanceAllowed;

    for(let i=0; i<allTrains.length; i++){
      for(let j=i+1; j<allTrains.length; j++){
        if(tooClose(allTrains[i].currentPos, allTrains[j].currentPos)) return true;
      }
    }

    return false;
  }


  public getLineTerminalSegments(): LineSegment[]{

    let stations: Station[] = this.stations;
    let segments: LineSegment[] = [];

    let first = 0; // First one is always a terminal

    for(let i=1; i<stations.length; i++){

      let s = stations[i];

      if(s.isTerminal){
        segments.push({
          firstTerminal: first,
          secondTerminal: i
        });
        first = i;
      }
    }
    return segments;
  }

}
