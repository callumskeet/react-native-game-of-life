import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  PlatformColor,
  Platform,
} from "react-native";

import { Svg, Rect } from "react-native-svg";

const GAME_SIZE = 25;
const COUNTER_SIZE = 1;

function initializeGame(): number[] {
  const game = [];
  for (let i = 0; i < GAME_SIZE * GAME_SIZE; i++) {
    const cellState = Math.random() > 0.5 ? 1 : 0;
    game.push(cellState);
  }
  return game;
}

function checkCellState(game: number[], i: number, j: number): number {
  const cellPosition = i * GAME_SIZE + j;
  const cell = game[cellPosition];
  const convolution = [-1, 0, 1];
  let lifeCount = 0;
  convolution.forEach((iOffset) => {
    convolution.forEach((jOffset) => {
      const adjacentCellPosition =
        ((i + iOffset) % GAME_SIZE) * GAME_SIZE + ((j + jOffset) % GAME_SIZE);
      if (adjacentCellPosition != cellPosition) {
        const adjacentCell = game[adjacentCellPosition];
        if (adjacentCell > 0) {
          lifeCount += 1;
        }
      }
    });
  });
  // birth
  if (cell == 0 && lifeCount == 3) {
    return 1;
  }
  // survival
  if (lifeCount == 2 || lifeCount == 3) {
    return cell;
  }
  // death
  if (lifeCount >= 4 || lifeCount <= 1) {
    return 0;
  }
  return 0;
}

interface CellProps {
  x: number;
  y: number;
}

function CreateCell({ x, y }: CellProps): JSX.Element {
  return (
    <Rect
      x={x.toString()}
      y={y.toString()}
      width={COUNTER_SIZE.toString()}
      height={COUNTER_SIZE.toString()}
      fill="white"
    />
  );
}

interface GameGridProps {
  game: number[];
}

function GameGrid({ game }: GameGridProps): JSX.Element {
  const grid = [];

  for (let i = 0; i < GAME_SIZE; i++) {
    for (let j = 0; j < GAME_SIZE; j++) {
      if (game[i * GAME_SIZE + j] == 1) {
        grid.push(
          <CreateCell
            x={i * COUNTER_SIZE}
            y={j * COUNTER_SIZE}
            key={(i * GAME_SIZE + j).toString()}
          />
        );
      }
    }
  }

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={
        "0 0 " +
        (GAME_SIZE * COUNTER_SIZE).toString() +
        " " +
        (GAME_SIZE * COUNTER_SIZE).toString()
      }
    >
      {grid}
    </Svg>
  );
}

function updateGame(game: number[]): number[] {
  const nextGameState = [];
  for (let i = 0; i < GAME_SIZE; i++) {
    for (let j = 0; j < GAME_SIZE; j++) {
      const newCellState = checkCellState(game, i, j);
      nextGameState.push(newCellState);
    }
  }
  return nextGameState;
}

let game = initializeGame();
let grid = <GameGrid game={game} />;

export default function App(): JSX.Element {
  const [step, setStep] = useState(false);

  useLayoutEffect(() => {
    const id = setTimeout(() => {
      setStep(!step);
    }, 333);

    game = updateGame(game);
    grid = <GameGrid game={game} />;

    return () => clearInterval(id);
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Conway&apos;s Game of Life</Text>
      </View>
      <View style={styles.game}>
        <View style={StyleSheet.absoluteFill}>{grid}</View>
      </View>
      <Pressable
        style={styles.button}
        onPress={() => {
          game = initializeGame();
          grid = <GameGrid game={game} />;
        }}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  game: {
    flex: 1,
    flexGrow: 3,
    minWidth: "95%",
    aspectRatio: 1,
    borderColor: "white",
    borderWidth: 2,
  },
  button: {
    flex: 1,
    padding: 15,
  },
  buttonText: {
    ...Platform.select({
      ios: {
        color: PlatformColor("systemYellow"),
      },
      android: {
        color: PlatformColor("?android:color/holo_orange_light"),
      },
      default: {
        color: "white",
      },
    }),
    fontSize: 20,
  },
  titleText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Menlo",
    fontWeight: "bold",
    borderColor: "white",
    borderWidth: 2,
    padding: 10,
  },
  titleContainer: {
    flex: 1,
    paddingTop: "10%",
  },
});
