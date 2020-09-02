import React, {Component, createContext} from 'react';
import {updateSessionScore} from '../helpers/database';
import { navigateTo } from '../helpers/utilities'

export const GameJavascriptContext = createContext(
  {
    updateSessionHighScore: (x: any, y:any, z:any) => {}
  });

export default class GameJavascript extends Component<any, any> {

  constructor(props) {
    super(props);
  }

  async updateSessionHighScore(sessionId: any, playerAddress: any, tournamentId: any) {
    let updatedData = await updateSessionScore(sessionId, playerAddress, tournamentId);
    console.log("Data updated with", updatedData);

    // navigate to home for now
    navigateTo('/');
  }

  render() {
    return (
      <GameJavascriptContext.Provider value={
        {
          updateSessionHighScore: this.updateSessionHighScore
        }
      }>
        {this.props.children}
      </GameJavascriptContext.Provider>
    )
  }
}