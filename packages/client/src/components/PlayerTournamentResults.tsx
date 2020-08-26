import React, { Component } from "react";
import { Card, Heading, Flex, Box, Button, Text } from "rimble-ui";
import RainbowImage from "./RainbowImage";

import { getGameSession } from "../helpers/database";
import Tournament from "./Tournament";
import TournamentResult from "./TournamentResult";
class PlayerTournamentResults extends Component {
  constructor(props){
    super(props);

    this.state = {
      results: [],
      isLoading: false,
      tournamentsCount: 0,
      tournament:[],
    }
  }

  componentDidMount() {
    this.fetchTournaments();
  }

  fetchTournaments = async () => {
    const { drizzle } = this.props;

    const contract = drizzle.contracts.Tournaments;
    const tournamentsCount = await contract.methods.getTournamentsCount().call();
    this.setState({
      tournamentsCount
    })

    

    for (let tournamentId = 0; tournamentId < tournamentsCount; tournamentId++) {
      const tournamentDetails = await contract.methods.getTournament(tournamentId).call()
      const resultsCount = await contract.methods.getResultsCount(tournamentId).call()
      let results = []
      for (let resultIdx = 0; resultIdx < resultsCount; resultIdx++) {
        const rawResult = await contract.methods.getResult(tournamentId, resultIdx). call()
        results.push({
          resultId: resultIdx,
          isWinner: rawResult['0'],
          playerAddress: rawResult['1'],
          sessionId: rawResult['2']
        })
      }

      const promises = results.map( result => getGameSession(result.sessionId, result.Address))
      const sessions = await Promise.all(promises)
      results.forEach( (result, idx) => result.sessionData = sessions[idx])
      results = results.filter(result => !!result.sessionData)
      results.sort((el1, el2) => el2.sessionData.timeLeft - el1.sessionData.timeLeft)

      // // temp: placeholder results for demo
      const tournament = {
        id: tournamentId,
        organizer: tournamentDetails[0],
        prize: tournamentDetails[2]
      }

      results = 
      [
        {
          isWinner: true,
          playerAddress: "0x66aB592434ad055148F20AD9fB18Bf487438943B",
          sessionData: {
            timeLeft: "0:55"
          }
        },
        {
          isWinner: false,
          playerAddress: "0xB83A97B94A7f26047cBDBAdf5eBe53224Eb12fEc",
          sessionData: {
            timeLeft: "0:50"
          }
        },
        {
          isWinner: false,
          playerAddress: "0x9DFb1d585F8C42933fF04C61959b079027Cf88bb",
          sessionData: {
            timeLeft: "0:30"
          }
        }
      ]

      this.setState({
        results,
        isLoading: false,
        tournament: tournament
      })

      console.log(results)
    }
  }

  render() {
    const gameName= 'TOSIOS';
    const gameImage = 'tosios.gif';
    
    return(
      <Card px={3} py={4}>
        <Heading as={"h2"}>Your Tournament Results</Heading> 
        <Flex>
          <RainbowImage src={"images/" + gameImage}/>
          <Box ml={3}>
            <Text>{gameName} -{this.state.tournament.id}</Text>
            <Heading as={"h3"}>You have won {this.state.tournament.prize} ETH</Heading>
            <Button>Button Here</Button>
          </Box>
        </Flex>    
      </Card>
    )
  }
}

export default PlayerTournamentResults;
