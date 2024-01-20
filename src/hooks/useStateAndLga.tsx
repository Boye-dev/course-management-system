// @ts-ignore
import NaijaStates from 'naija-state-local-government';

export default function useStateAndLGA(state: string) {
  return {
    states: NaijaStates.states(),
    LGAs: state ? NaijaStates.lgas(state).lgas : [],
  };
}
