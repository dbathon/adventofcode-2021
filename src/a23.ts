import { dijkstraSearch, Neighbor, Node } from "./util/graphUtil";
import { p, readLines } from "./util/util";

const lines = readLines("input/a23.txt", false);

const ROOM_TO_HALLWAY = [2, 4, 6, 8];
const TARGET_ORDER = "ABCD";
const HALLWAY_TO_ROOM = [-1, -1, 0, -1, 1, -1, 2, -1, 3, -1, -1];
const STEP_ENERGY: Record<string, number> = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

class State implements Node {
  constructor(readonly hallway: string[], readonly rooms: string[][], readonly energy = 0, readonly prevState?: State) {
    if (hallway.length !== 11 || rooms.length !== 4) {
      throw "illegal state";
    }
  }

  getNodeKey(): string {
    return this.hallway.join("") + ";" + this.rooms.map((room) => room.join(",")).join(";");
  }

  draw(roomSize: number): string {
    const mappedRooms = this.rooms.map((room) => [".", ".", ".", ".", ...room].slice(room.length + 4 - roomSize));
    let result = "-------------\n|" + this.hallway.join("") + "|";
    for (let i = 0; i < roomSize; i++) {
      result += "\n  |" + mappedRooms.map((room) => room[i][0]).join("|") + "|";
    }

    return result;
  }

  getReachableHallwayPositions(startPosition: number): { position: number; steps: number }[] {
    const result: { position: number; steps: number }[] = [];

    for (let position = startPosition - 1; position >= 0 && this.hallway[position] === "."; --position) {
      result.push({
        position,
        steps: startPosition - position,
      });
    }

    for (
      let position = startPosition + 1;
      position < this.hallway.length && this.hallway[position] === ".";
      ++position
    ) {
      result.push({
        position,
        steps: position - startPosition,
      });
    }

    return result;
  }

  updatedState(
    hallwayChangeIndex: number,
    hallwayChange: string,
    roomChangeIndex: number,
    roomChange: string | undefined,
    energy: number
  ): State {
    const newHallway = [...this.hallway];
    newHallway[hallwayChangeIndex] = hallwayChange;

    const newRooms = [...this.rooms];
    if (roomChange === undefined) {
      newRooms[roomChangeIndex] = [...newRooms[roomChangeIndex]].slice(1);
    } else {
      newRooms[roomChangeIndex] = [roomChange, ...newRooms[roomChangeIndex]];
    }

    return new State(newHallway, newRooms, this.energy + energy, this);
  }

  isSolution(roomSize: number): boolean {
    for (let i = 0; i < 4; i++) {
      const room = this.rooms[i];
      if (room.length !== roomSize) {
        return false;
      }
      const expected = TARGET_ORDER[i];
      for (let j = 0; j < roomSize; j++) {
        if (room[j][0] !== expected) {
          return false;
        }
      }
    }
    return true;
  }
}

function findMinEnergy(startState: State, roomSize = 2): number {
  let minEnergy = -1;
  dijkstraSearch(
    (state: State, _, distance) => {
      if (state.isSolution(roomSize)) {
        // we found the "cheapest" solution
        minEnergy = distance;
        return null;
      }
      const result: Neighbor<State, undefined>[] = [];

      // moves out of the rooms
      state.rooms.forEach((room, i) => {
        const hallwayPos = ROOM_TO_HALLWAY[i];
        if (room.length > 0 && room[0].length === 1 && state.hallway[hallwayPos] === ".") {
          const amphipod = room[0];
          const stepEnergy = STEP_ENERGY[amphipod];
          const baseSteps = roomSize - room.length + 1;
          for (const posAndSteps of state.getReachableHallwayPositions(hallwayPos)) {
            if (HALLWAY_TO_ROOM[posAndSteps.position] < 0) {
              const energy = (baseSteps + posAndSteps.steps) * stepEnergy;
              result.push(
                new Neighbor(
                  state.updatedState(posAndSteps.position, amphipod, i, undefined, energy),
                  energy,
                  undefined
                )
              );
            }
          }
        }
      });

      // moves into the rooms
      state.hallway.forEach((amphipod, hallwayPos) => {
        const stepEnergy = STEP_ENERGY[amphipod];
        if (stepEnergy !== undefined) {
          for (const posAndSteps of state.getReachableHallwayPositions(hallwayPos)) {
            const roomIndex = HALLWAY_TO_ROOM[posAndSteps.position];
            if (roomIndex >= 0 && TARGET_ORDER[roomIndex] === amphipod) {
              const room = state.rooms[roomIndex];
              if (room && room.length < roomSize && (room.length === 0 || room[0][0] === amphipod)) {
                const energy = (roomSize - room.length + posAndSteps.steps) * stepEnergy;
                result.push(
                  new Neighbor(
                    state.updatedState(hallwayPos, ".", roomIndex, amphipod + "x", energy),
                    energy,
                    undefined
                  )
                );
              }
            }
          }
        }
      });

      return result;
    },
    startState,
    undefined
  );
  return minEnergy;
}

const initialState = new State(
  "...........".split(""),
  ROOM_TO_HALLWAY.map((pos) => [lines[2][pos + 1], lines[3][pos + 1]])
);

p(findMinEnergy(initialState, 2));

const extraLines = ["DCBA", "DBAC"];
const initialState2 = new State(
  "...........".split(""),
  ROOM_TO_HALLWAY.map((pos, roomIndex) => [
    lines[2][pos + 1],
    extraLines[0][roomIndex],
    extraLines[1][roomIndex],
    lines[3][pos + 1],
  ])
);

p(findMinEnergy(initialState2, 4));
