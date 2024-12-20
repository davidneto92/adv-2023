// https://adventofcode.com/2023/day/4

import { getFileStream, getFirstNumber, convertStringToNumberSet } from '../util';

const stream = getFileStream('input/2023/day_04.txt');

type TScratchcard = {
  gameNumber: number;
  winningNumbers: Set<number>;
  field: Set<number>;
};

const parseScratchyData = (scratchyData: string): TScratchcard => {
  const gameNumber = getFirstNumber(scratchyData)
  const parsed = scratchyData.split(':');
  const allNumbers = parsed[1];
  if (!allNumbers) {
    throw new Error('invalid scratchy data');
  }
  const [winningNumbersData, fieldData] = allNumbers.split('|');

  if (!winningNumbersData || !fieldData) {
    throw new Error('no numbers on scratchy');
  }

  const winningNumbers = convertStringToNumberSet(winningNumbersData);
  const field = convertStringToNumberSet(fieldData);

  return {
    gameNumber,
    winningNumbers,
    field,
  };
};

// part 1
const getScratchcardPoints = ({ winningNumbers, field }: TScratchcard): number => {
  let totalMatches = 0;
  const winningNumbersIterator = winningNumbers.values();
  for (const winningNumber of winningNumbersIterator) {
    if (field.has(winningNumber)) {
      totalMatches += 1;
    }
  }

  return totalMatches <= 1 ? totalMatches : 2 ** (totalMatches - 1);
};

// part 2
const ticketMap: Map<number, number> = new Map()
const getTotalScratchCards = ({ gameNumber: currentGameNumber, winningNumbers, field }: TScratchcard): void => {
  let timesToPlayCard = ticketMap.get(currentGameNumber)
  if (!timesToPlayCard) {
    ticketMap.set(currentGameNumber, 1)
    timesToPlayCard = 1
  }

  let totalMatches = 0;
  const winningNumbersIterator = winningNumbers.values();

  // score the current scratchy for X times it has been duplicated (original + copies)
  for (let _count = 0; _count < timesToPlayCard; _count++) {
    for (const winningNumber of winningNumbersIterator) {
      if (field.has(winningNumber)) {
        totalMatches += 1;
      }
    }

    // update ticketMap
    if (totalMatches) {
      for (let index = 1; index <= totalMatches; index++) {
        const nextGameNumber = index + currentGameNumber
        const currentCount = ticketMap.get(nextGameNumber)
        if (!currentCount) {
          ticketMap.set(nextGameNumber, 2)
        } else {
          ticketMap.set(nextGameNumber, currentCount + 1)
        }
      }
    }
  }
}

// let points = 0;
stream
  .on('line', (scratchy: string) => {
    const parsedScratchy = parseScratchyData(scratchy);
    // part 1
    // const result = getScratchcardPoints(parsedScratchy);
    // points += result;

    // part 2
    getTotalScratchCards(parsedScratchy)
  })
  .on('close', () => {
    // part 1
    // console.log({ total: points });

    // part 2
    const ticketMapValuesIterator = ticketMap.values()
    let totalPlayedTickets = 0
    for (const ticketCount of ticketMapValuesIterator) {
      totalPlayedTickets += ticketCount
    }
    console.log(totalPlayedTickets)
  });

// part 2 idea
// create map of { gameNumber: numberOfCopies }
// can still iterate through all games, and access the map for X times to parse a game
