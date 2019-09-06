import Component from '../Component.js';
import Header from './Header.js';
import MainChar from '../profile/mainChar.js';
import ProfileResults from '../profile/ProfileResults.js';
import { getGames, getCharacter, getCharacterFromApi, getMBTI, updateGame } from '../../services/quiz-api.js';

class ProfileApp extends Component {

    onRender(dom) {


        const header = new Header();
        dom.prepend(header.renderDOM());

        const profileResults = new ProfileResults();
        dom.querySelector('#results-wrapper').appendChild(profileResults.renderDOM());

        //CALCULATE LATEST GAME RESULT

        let userMBTI = '';

        getGames()
            .then(data => {
                const gameIds = data.reduce((acc, val) => {
                    acc.push(val.id);
                    return acc;
                }, []);

                console.log('DATA', data);
                const lastGame = Math.max.apply(Math, gameIds);

                const answer = data.find(val => {
                    return val.id = lastGame;
                });

                const userAnswer = answer.user_answer.split(',');
                const userTotals = userAnswer.reduce((acc, val) => {
                    const answer = val.split('');
                    answer.forEach(letter => {
                        acc[letter]++;
                    });
                    return acc;
                }, { E: 0, I: 0, S: 0, N: 0, F: 0, T: 0, P: 0, J: 0 });


                userTotals.E > userTotals.I ? userMBTI += 'E' : userMBTI += 'I';
                userTotals.S > userTotals.N ? userMBTI += 'S' : userMBTI += 'N';
                userTotals.F > userTotals.T ? userMBTI += 'F' : userMBTI += 'T';
                userTotals.P > userTotals.J ? userMBTI += 'P' : userMBTI += 'J';

                getCharacter(userMBTI).then(result => {

                    updateGame({ id: lastGame, method: 'char', character: result.name });

                    const mainCharProps = {
                        name: result.name,
                        quote: result.quote,
                        image: result.profile,
                        personality: result.mbti
                    };

                    getCharacterFromApi(result.name)
                        .then(result => {
                            mainCharProps.status = result.results[0].status;
                            mainCharProps.species = result.results[0].species;
                            mainCharProps.gender = result.results[0].gender;
                            mainCharProps.origin = result.results[0].origin.name;


                            getMBTI(userMBTI)
                                .then(result => {
                                    mainCharProps.description = result[0].description;


                                    const mainChar = new MainChar(mainCharProps);
                                    console.log(document.getElementById('root'));
                                    document.getElementById('root').appendChild(mainChar.renderDOM());
                                });
                        });
                });
            }).catch(err => {
                // eslint-disable-next-line no-console
                console.log(err);
            });

    }

    renderHTML() {
        return /*html*/`
            <div id="root">

            <div id="results-wrapper"></div>
            <h1>PREVIOUS RESULTS</h1>

            </div>
        `;
    }
}

export default ProfileApp;